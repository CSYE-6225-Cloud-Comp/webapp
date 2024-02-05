import User from "../models/user-model.js";

export const isExistingUser = async (username) => {
    const isExistingUser = await User.findOne({ 
        where: { username: username } 
    });

    console.log("isExistingUser: ", isExistingUser);
    return isExistingUser;
}

export const createUser = async (userDetails) => {
    const userData = userDetails;
    console.log(userData);

    const user = await User.create({
        username: userData.username,
        first_name: userData.first_name,
        last_name: userData.last_name,
        password: userData.password
    });

    return user;
}

export const getUser = async (username) => {
    
}
