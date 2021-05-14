"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("Groceries", {
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
			needed: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			grocery_list_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "GroceryLists",
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
		await queryInterface.dropTable("Groceries");
	},
};
