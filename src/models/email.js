import { DataTypes } from "sequelize";
import sequelize from "./db.js";

const Email = sequelize.define('email', {
    expiration: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    }
}, {
    timestamps: false
});


sequelize.sync();

export default Email;