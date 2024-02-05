import User from '../models/user-model.js';
import * as UserService from '../services/user-service.js';
import bcrypt from 'bcrypt';
// import { Buffer } from buffer;

export const createUser = async(request, response) => {
    // Check request body fields. If more fields than necessary throw an error
    const allowedFields = ['first_name', 'last_name', 'password', 'username'];

    Object.keys(request.body).forEach((field) => {
        if(!allowedFields.includes(field)) {
            response.status(400).header('Cache-Control', 'no-cache').json("More parameters than necessary.");
            return;
        }
    });

    // Check is user exists
    const isExistingUser = await UserService.isExistingUser(request.body.username);
    console.log("isExistingUser controller: ", isExistingUser)

    // Throw an error if user already exists
    if(isExistingUser !== null) {
        console.log("Inside isExistingUser");
        response.status(400).header('Cache-Control', 'no-cache').json("User already exists.");
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
        response.status(400).header('Cache-Control', 'no-cache').json("Enter details correctly.");
        return;
    }
    
}

export const getUser = async(request, response) => {
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

    // Check if password matches the db password
    try {
        // Get username and password from database
        const user = await User.findOne({
            where: { username: username }
        });

        console.log("User: ", user);

        console.log("Value: ", await bcrypt.compare(password, user.password));

        const comparePassword = await bcrypt.compare(password, user.password);

        if(!user || !comparePassword) {
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
    

    // UserService.createUser(req);


}

export const updateUser = async(request, response) => {
    
}

export const methodNotAllowed = async(request, response) => {
    response.status(405).header('Cache-Control', 'no-cache').json();
    return;
}