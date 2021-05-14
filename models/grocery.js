"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Grocery extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			// this.belongsTo(models.User, {foreignKey: "user_id"});
			// this.belongsTo(models.Folder, {
			// 	foreignKey: "folder_id",
			// });
			this.belongsTo(models.UserGroup, {
				foreignKey: "user_group_id",
			});
		}
	}
	Grocery.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			needed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			user_group_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			// paranoid: true,
			modelName: "Grocery",
		}
	);
	return Grocery;
};
