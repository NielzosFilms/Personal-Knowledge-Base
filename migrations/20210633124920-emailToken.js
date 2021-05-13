"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("EmailTokens", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			expiration: {
				type: Sequelize.DATE,
				allowNull: false,
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
		await queryInterface.dropTable("EmailTokens");
	},
};
