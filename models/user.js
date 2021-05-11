"use strict";
const {Model} = require("sequelize");
const passwordHash = require("password-hash");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Note, {
				foreignKey: "user_id",
			});
			this.hasMany(models.Session, {
				foreignKey: "user_id",
			});
			this.hasMany(models.Folder, {
				foreignKey: "user_id",
			});
		}
	}
	User.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				private: true,
				set(value) {
					this.setDataValue("password", passwordHash.generate(value));
				},
			},
			admin: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "User",
		}
	);
	return User;
};
