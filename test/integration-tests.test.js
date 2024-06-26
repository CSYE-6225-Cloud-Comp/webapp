import request from "supertest";
import app from "../app.js";
import sequelize from "../src/models/db.js";
import User from "../src/models/user-model.js";

describe("Account Creation and Updation", () => {
    // Sync the database before running the tests
    beforeAll(async () => {
        await sequelize.sync();
    });

    // Create a new account and validate the account
    test("It should create a new account and validate the account", async () => {
        const postResponse = await request(app).post("/v2/user")
            .send({
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe@example.com",
                "password": "password"
            });
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.headers).toMatchObject({ 'cache-control': 'no-cache' });

        // const comparePassword = await bcrypt.compare("password", user.password);

        const updatedUser = await User.update(
            { 
                verified: true 
            },
            { 
                where: { 
                    id: postResponse.body.id 
                } 
            }
        );
    
        console.log("Updated User: ", updatedUser);
        // Expectations for the update operation
        expect(updatedUser[0]).toBe(1);

        const encodedCredentials = Buffer.from("johndoe@example.com:password").toString('base64');
        const getResponse = await request(app).get("/v2/user/self")
                                .set("Authorization", `Basic ${encodedCredentials}`);
        console.log("getResponse: ", getResponse.body.username, postResponse.body.username);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.id).toEqual(postResponse.body.id);
        expect(getResponse.body.username).toEqual(postResponse.body.username);
        expect(getResponse.body.first_name).toEqual(postResponse.body.first_name);
        expect(getResponse.body.last_name).toEqual(postResponse.body.last_name);
        expect(getResponse.headers).toMatchObject({ 'cache-control': 'no-cache' });
    });

    // Update an account and validate the account
    test('It should update an account and validate the account', async () => {
        
        const encodedCredentials = Buffer.from("johndoe@example.com:password").toString('base64');
        const putResponse = await request(app).put('/v2/user/self')
            .set('Authorization', `Basic ${encodedCredentials}`)
            .send({
                'first_name': 'Johnnny',
                'last_name': 'Doe',
                'password': 'password1',
            });
        expect(putResponse.statusCode).toBe(204);
        expect(putResponse.headers).toMatchObject({ 'cache-control': 'no-cache' });
        expect(putResponse.body).toEqual({});

        // const updatedUser = await User.update(
        //     { 
        //         verified: true 
        //     },
        //     { 
        //         where: { 
        //             username: "johndoe@example.com" 
        //         } 
        //     }
        // );
    
        // // Expectations for the update operation
        // expect(updatedUser[0]).toBe(1);

        const updatedEncodedCredentials = Buffer.from("johndoe@example.com:password1").toString('base64');
        const getResponse = await request(app).get("/v2/user/self")
                                .set("Authorization", `Basic ${updatedEncodedCredentials}`)
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.username).toEqual("johndoe@example.com");
        expect(getResponse.body.first_name).toEqual("Johnnny");
        expect(getResponse.body.last_name).toEqual("Doe");
        expect(getResponse.headers).toMatchObject({ 'cache-control': 'no-cache' });
    });
});


