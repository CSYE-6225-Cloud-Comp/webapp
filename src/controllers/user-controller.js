import User from '../models/user-model.js';
import * as UserService from '../services/user-service.js';
import bcrypt from 'bcrypt';
// import { Buffer } from buffer;

export const createUser = async(request, response) => {
    // Check request body fields. If more fields than necessary throw an error
    const allowedFields = ['first_name', 'last_name', 'password', 'username'];

    // Check if authentication disabled
    const authenticationHeader = request.headers.authorization;
    console.log("Authentication Header: ", authenticationHeader);
    if(authenticationHeader !== undefined) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check if request body missing
    console.log("Content Length: ", typeof(request.headers['content-length']));
    if(request.headers['content-length'] == 0 || Object.keys(request.query).length) {
        console.log("Request body missing");
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check is the fields in the request body are the fields that we need
    for (const field of Object.keys(request.body)) {
        if (!allowedFields.includes(field)) {
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }
    }

    // Throw an error if user already exists
    try {
        const isExistingUser = await UserService.isExistingUser(request.body.username);

        if(isExistingUser !== null) {
            console.log("Inside isExistingUser");
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }
    } catch (error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Check is the password is empty
    if(request.body.password === "" || typeof(request.body.password) !== 'string' ) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }

    // Create a new user if user does not exist
    try {
        const user = await UserService.createUser(request.body);
        console.log("User: ", user);
        response.status(200).header('Cache-Control', 'no-cache').json();
        return;
    } catch (error) {
        console.log("Error: ", error);
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
    
}

export const getUser = async(request, response) => {
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

    console.log("User Credentials: ", username, password);

    try {
        // Fecth user from database by username
        const user = await User.findOne({
            where: { username: username }
        });

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
    console.log("Inside updateUser");
    const userDetails = request.body;
    console.log("User Details: ", userDetails);

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

    console.log("User Credentials: ", username, password);

    try {
        // Fetch user from database by username
        const user = await User.findOne({
            where: { username: username }
        })

        // Check if user entered password and the password stored in the database is the same
        const comparePassword = await bcrypt.compare(password, user.password);

        if(!user || !comparePassword) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }

        console.log("User: ", user);

        // Check if request body is missing
        if(request.headers['content-length'] == 0 || Object.keys(request.query).length) {
            console.log("Request body missing");
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        // Check if the user given by user is same as user in the database
        if(userDetails.username !== user.username) {
            console.log("Username cannot be updated.")
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        // Check is there are more parameters than necessary in the request body
        const allowedFields = ['first_name', 'last_name', 'password', 'username'];

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

            console.log("Updated User: ", updatedUser);

        } catch(error) {
            console.log("Error here: ", error);
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

        response.status(200).header('Cache-Control', 'no-cache').json();
    } catch(error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
}

export const methodNotAllowed = async(request, response) => {
    response.status(405).header('Cache-Control', 'no-cache').json();
    return;
}