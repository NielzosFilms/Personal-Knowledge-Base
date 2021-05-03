"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Folder extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Note, {foreignKey: "folder_id"});
		}
	}
	Folder.init(
		{
			ancestry: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			paranoid: true,
			modelName: "Folder",
		}
	);
	return Folder;
};
