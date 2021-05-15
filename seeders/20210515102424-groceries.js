"use strict";

const groceries = require("./groceries.json");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const grocery_list_id = 1;
		await queryInterface.bulkInsert("Groceries", [
			...groceries.data.groceries.map((item) => ({
				name: item.name,
				grocery_list_id,
				needed: Math.random() < 0.4,
				// needed: item.checked,
			})),
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Groceries", null, {});
	},
};
