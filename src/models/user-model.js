import { Sequelize, DataTypes } from "sequelize";
import sequelize from "./db.js";
import bcrypt from "bcrypt";

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[a-z\s]+$/i,
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[a-z\s]+$/i,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
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
            isEmail: true,
        }
    },
    account_created: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true,
    },
    account_updated: {
        type: Sequelize.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        readOnly: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    timestamps: false
});

sequelize.sync();

export default User;