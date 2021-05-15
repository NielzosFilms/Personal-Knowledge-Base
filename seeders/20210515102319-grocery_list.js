"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("GroceryLists", [
			{
				name: "Boodschappen Fam.H",
				user_group_id: 1,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("GroceryLists", null, {});
	},
};
