import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import sequelize from "../models/db.js";

dotenv.config();

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        return "Connection has been established successfully."
    } catch (error) {
        throw new Error('Unable to connect to the database:', error.message);
    }
}
