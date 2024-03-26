import User from "../models/user-model.js";
import {PubSub} from '@google-cloud/pubsub';

const pubSubClient = new PubSub({
    projectId: "tf-gcp-infra"
});


export const isExistingUser = async (username) => {
    const isExistingUser = await User.findOne({ 
        where: { username: username } 
    });

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
        throw new Error("Unable to get user details");
    }
}

export const publish = async (topicId, data) => {
    const dataBuffer = Buffer.from(data);
    try {
        const messageId = await pubSubClient
            .topic(topicId)
            .publishMessage({data: dataBuffer});
        console.log(`Message ${messageId} published.`);
    } catch (error) {
        console.error(`Received error while publishing: ${error.message}`);
        process.exitCode = 1;
    }
};
