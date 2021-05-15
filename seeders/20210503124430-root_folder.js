"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert("Folders", [
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 1,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 2,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 3,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 4,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 5,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 6,
			},
			{
				ancestry: "root/",
				name: "Notes",
				user_id: 7,
			},
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("Notes", null, {});
		await queryInterface.bulkDelete("Folders", null, {});
	},
};
