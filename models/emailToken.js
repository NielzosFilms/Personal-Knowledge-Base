"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class EmailToken extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	EmailToken.init(
		{
			token: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			expiration: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: "EmailToken",
		}
	);
	return EmailToken;
};
