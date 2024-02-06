import User from '../models/user-model.js';
import * as UserService from '../services/user-service.js';
import bcrypt from 'bcrypt';
// import { Buffer } from buffer;

export const createUser = async(request, response) => {
    // Check request body fields. If more fields than necessary throw an error
    const allowedFields = ['first_name', 'last_name', 'password', 'username'];

    // Check is the fields in the request body are the fields that we need
    for (const field of Object.keys(request.body)) {
        if (!allowedFields.includes(field)) {
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }
    }

    // Throw an error if user already exists
    if(isExistingUser !== null) {
        console.log("Inside isExistingUser");
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

    // Get user
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
        const user = await User.findOne({
            where: { username: username }
        });

        const comparePassword = await bcrypt.compare(password, user.password);

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
                account_created: user.account_created,
                account_updated: user.account_updated
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
        const user = await User.findOne({
            where: { username: username }
        })
        const comparePassword = await bcrypt.compare(password, user.password);

        if(!user || !comparePassword) {
            response.status(401).header('Cache-Control', 'no-cache').json();
            return;
        }

        console.log("User: ", user);

        if(userDetails.username !== user.username) {
            console.log("Username cannot be updated.")
            response.status(400).header('Cache-Control', 'no-cache').json();
            return;
        }

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