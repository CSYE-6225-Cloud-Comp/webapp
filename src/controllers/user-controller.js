import User from '../models/user-model.js';
import Email from '../models/email.js';
import * as UserService from '../services/user-service.js';
import bcrypt from 'bcrypt';
import logger from '../../logger.js';
import dotenv from 'dotenv';

dotenv.config();

export const createUser = async(request, response) => {
    logger.debug("Creating a new user");
    // Check request body fields. If more fields than necessary throw an error
    const allowedFields = ['first_name', 'last_name', 'password', 'username'];

    // Check if authentication disabled
    const authenticationHeader = request.headers.authorization;
    if(authenticationHeader !== undefined) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check if request body missing
    if(request.headers['content-length'] == 0 || Object.keys(request.query).length) {
        logger.error("Request body is missing when creating a user");
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check is the fields in the request body are the fields that we need
    for (const field of Object.keys(request.body)) {
        if (!allowedFields.includes(field)) {
            logger.error("Unknown fields in the request body");
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }
    }

    // Throw an error if user already exists
    try {
        const isExistingUser = await UserService.isExistingUser(request.body.username);
        if(isExistingUser !== null) {
            logger.error("User Already Registered!");
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }
    } catch (error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check is the password is empty
    if(request.body.password === "" || typeof(request.body.password) !== 'string' ) {
        logger.error("Password is empty");
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Create a new user if user does not exist
    try {
        const user = await UserService.createUser(request.body);
        logger.info("User Created!");

        //Publish a message to the topic
        const data = JSON.stringify({
            id: user.id,
            fromMail: user.username,
            to: user.username,
            subject: "Verification Email",
        });

        const message = await UserService.publish('verify_email', data);

        response.status(201).header('Cache-Control', 'no-cache').json({
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            account_created: user.account_created,
            account_updated: user.account_updated,
        });

        return;
    } catch (error) {
        console.log("Error: ", error);
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
    
}

// Get a user
export const getUser = async(request, response) => {
    logger.debug("Fetching user details");
    // Check if request body and parameters are empty
    if(request.headers['content-length'] !== undefined || Object.keys(request.query).length) {
        // Bad Request response and do not cache the response
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Authenticate User
    const authenticationHeader = request.headers.authorization;
    if(!authenticationHeader) {
        response.status(401).header('Cache-Control', 'no-cache').json();
        return;
    }

    const auth = authenticationHeader.split(' ');

    if(auth.length !== 2 || auth[0].toLowerCase() !== 'basic') {
        response.status(401).header('Cache-Control', 'no-cache').json();
        return;
    }

    const userCredentials = Buffer.from(auth[1], 'base64').toString('utf-8').split(':');

    const username = userCredentials[0];
    const password = userCredentials[1];

    try {
        // Fecth user from database by username
        const user = await User.findOne({
            where: { username: username }
        });

        if(user !== null && user.verified !== true) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }

        const userAccountCreatedDate = new Date(user.account_created.getTime() - 5 * 60 * 60 * 1000);
        const userAccountUpdatedDate = new Date(user.account_updated.getTime() - 5 * 60 * 60 * 1000);
        console.log("User Account Created Date: ", userAccountCreatedDate);
        // Check if user entered password and the password stored in the database is the same
        const comparePassword = await bcrypt.compare(password, user.password);


        // Throw an error is the password does not match
        if (!user || !comparePassword) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }
        else {
            logger.info(`User ${user.first_name} fetched!`);
            response.status(200).header('Cache-Control', 'no-cache').json({
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                account_created: userAccountCreatedDate,
                account_updated: userAccountUpdatedDate
            });
            return;
        }
    } catch (error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

}

export const updateUser = async(request, response) => {
    logger.debug("Updating user details");
    const userDetails = request.body;

    // Autheticate User
    const authenticationHeader = request.headers.authorization;
    if(!authenticationHeader) {
        response.status(401).header('Cache-Control', 'no-cache').json();
        return;
    }

    const auth = authenticationHeader.split(' ');

    if(auth.length !== 2 || auth[0].toLowerCase() !== 'basic') {
        response.status(401).header('Cache-Control', 'no-cache').json();
        return;
    }

    const userCredentials = Buffer.from(auth[1], 'base64').toString('utf-8').split(':');

    const username = userCredentials[0];
    const password = userCredentials[1];

    try {
        // Fetch user from database by username
        const user = await User.findOne({
            where: { username: username }
        })

        if(user !== null && user.verified !== true) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }

        // Check if user entered password and the password stored in the database is the same
        const comparePassword = await bcrypt.compare(password, user.password);

        if(!user || !comparePassword) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }

        // Check if request body is missing
        if(request.headers['content-length'] == 0 || Object.keys(request.query).length) {
            console.log("Request body missing");
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        // Check is there are more parameters than necessary in the request body
        const allowedFields = ['first_name', 'last_name', 'password'];

        for (const field of Object.keys(request.body)) {
            if (!allowedFields.includes(field)) {
                response.status(400).header('Cache-Control', 'no-cache').json();
                return;
            }
        }

        // Update user details
        try {
            const updatedUser = await User.update({
                id: user.id,
                username: user.username,
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                password: userDetails.password,
                account_created: user.account_created,
                account_updated: new Date()
            }, {
                where: { username: username }
            })

        } catch(error) {
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        response.status(204).header('Cache-Control', 'no-cache').json();
    } catch(error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
}

export const methodNotAllowed = async(request, response) => {
    response.status(405).header('Cache-Control', 'no-cache').json();
    return;
}

export const verifyUser = async(request, response) => {
    // Get the UUID from the url query parameter
    logger.debug("Inside Verifying User Method");
    console.log("Inside Verify User Method")
    const urlToken = request.query.token;
    console.log("Token From the URL: ", urlToken);
    logger.debug(`Token From the URL ${urlToken}`);

    // Check if the expiration date of the token has passed
    const email = await Email.findOne({
        where: {
            token: urlToken
        }
    });

    console.log("Email: ", email.token)
    logger.debug(`Email: ${email.token}`);
    console.log("Email token equals url token: ", email.token === urlToken);
    logger.debug(`Email token equals url token: ${email.token === urlToken}`);

    const expirationDate = email.expiration;
    // If the token has not expired, update the user as verified in the users table, else mark do nothing
    logger.debug(`Time Left for Token to Expire: ${Math.abs((expirationDate.getTime() - new Date().getTime()) / 1000)}`)
    if(Math.abs((expirationDate.getTime() - new Date().getTime()) / 1000) > 120) {
        response.status(403).header('Cache-Control', 'no-cache').json();
        return;
    }
    else {
        const user = await User.update({
            verified: true
        }, {
            where: {
                id: email.token
            }
        });

        console.log("User Verified!");
        logger.info("User Verified!");
        return response.status(200).header('Cache-Control', 'no-cache').json();
    }

    return;
}
