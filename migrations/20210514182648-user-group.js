"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("UserGroups", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
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
		await queryInterface.dropTable("UserGroups");
	},
};
