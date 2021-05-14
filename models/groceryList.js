"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class GroceryList extends Model {
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
			this.hasMany(models.Grocery, {foreignKey: "grocery_list_id"});
			this.belongsTo(models.UserGroup, {foreignKey: "user_group_id"});
		}
	}
	GroceryList.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			user_group_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			// paranoid: true,
			modelName: "GroceryList",
		}
	);
	return GroceryList;
};
