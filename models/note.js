"use strict";
const {Model} = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class Note extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {foreignKey: "user_id"});
		}
	}
	Note.init(
		{
			filename: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "Note",
		}
	);
	return Note;
};
