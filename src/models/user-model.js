import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from "./db.js";
import bcrypt from "bcrypt";

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            // Hashing the password before saving it to db using BCrypt
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hashedPassword);
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    account_created: {
        type: DataTypes.DATE,
        allowNull: false,
        readOnly: true,
        // defaultValue: () => new Date().toISOString()
    },
    account_updated: {
        type: DataTypes.DATE,
        allowNull: false,
        readOnly: true,
        // defaultValue: () => new Date().toISOString()
    }
}, {
    timestamps: false
});

sequelize.sync();

export default User;