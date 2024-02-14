import request from "supertest";
import app from "../app.js";
import sequelize from "../src/models/db.js";

describe("Account Creation and Updation", () => {
    beforeAll(async () => {
        await sequelize.sync();
    });

    test("It should create a new account and validate the account", async () => {
        const postResponse = await request(app).post("/v1/user")
            .send({
                "first_name": "John",
                "last_name": "Doe",
                "username": "johndoe@example.com",
                "password": "password"
            });
        console.log("postResponse", postResponse.body);
        expect(postResponse.statusCode).toBe(201);

        // const comparePassword = await bcrypt.compare("password", user.password);

        const encodedCredentials = Buffer.from("johndoe@example.com:password").toString('base64');
        const getResponse = await request(app).get("/v1/user/self")
                                .set("Authorization", `Basic ${encodedCredentials}`);
        console.log("getResponse: ", getResponse.body.username, postResponse.body.username);
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.id).toEqual(postResponse.body.id);
        expect(getResponse.body.username).toEqual(postResponse.body.username);
        expect(getResponse.body.first_name).toEqual(postResponse.body.first_name);
        expect(getResponse.body.last_name).toEqual(postResponse.body.last_name);
    });

    test('It should update an account and validate the account', async () => {
        
        const encodedCredentials = Buffer.from("johndoe@example.com:password").toString('base64');
        const putResponse = await request(app).put('/v1/user/self')
            .set('Authorization', `Basic ${encodedCredentials}`)
            .send({
                'first_name': 'Johnnny',
                'last_name': 'Doe',
                'password': 'password1',
            });
        expect(putResponse.statusCode).toBe(204);

        const updatedEncodedCredentials = Buffer.from("johndoe@example.com:password1").toString('base64');
        const getResponse = await request(app).get("/v1/user/self")
                                .set("Authorization", `Basic ${updatedEncodedCredentials}`)
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body.username).toEqual("johndoe@example.com");

    });
});


