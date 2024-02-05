// import { Buffer } from 'buffer';
import bcrypt from 'bcrypt';
import User from '../models/user-model.js';

const autheticateUser = async (request, response, next) => {
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
            response.status(200).header('Cache-Control', 'no-cache').json();
            return;
        }

        next();
    } catch (error) {
        response.status(400).header('Cache-Control', 'no-cache').json();
        return;
    }
}

export default autheticateUser;