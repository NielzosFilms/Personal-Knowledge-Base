"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert("UserGroups", [
			{
				name: "Fam. Hazelaar",
			},
		]);
		await queryInterface.bulkInsert("UserGroupLink", [
			{
				user_group_id: 1,
				user_id: 2,
			},
			{
				user_group_id: 1,
				user_id: 3,
			},
			{
				user_group_id: 1,
				user_id: 4,
			},
			{
				user_group_id: 1,
				user_id: 5,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("UserGroupLink", null, {});
		await queryInterface.bulkDelete("UserGroups", null, {});
	},
};
