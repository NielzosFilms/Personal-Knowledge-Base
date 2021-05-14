"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class UserGroup extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// this.hasMany(models.User, {
			// 	foreignKey: "user_id",
			// 	through: "UserGroupLink",
			// });
			this.belongsToMany(models.User, {
				foreignKey: "user_group_id",
				through: "UserGroupLink",
			});
			// this.hasMany(models.Grocery, {
			// 	foreignKey: "user_group_id",
			// });
		}
	}
	UserGroup.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			// paranoid: true,
			modelName: "UserGroup",
		}
	);
	return UserGroup;
};
