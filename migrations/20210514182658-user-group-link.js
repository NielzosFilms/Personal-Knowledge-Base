"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("UserGroupLink", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_group_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "UserGroups",
					key: "id",
				},
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "Users",
					key: "id",
				},
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date(),
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: new Date(),
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("UserGroupLink");
	},
};
