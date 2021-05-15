"use strict";

const passwordHash = require("password-hash");

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
		await queryInterface.bulkInsert("Users", [
			{
				name: "admin",
				email: "admin@test.nl",
				password: passwordHash.generate("asdf"),
				admin: true,
			},
			{
				name: "Niels",
				email: "nielzosfilms@gmail.com",
				password: passwordHash.generate("asdf"),
				admin: false,
			},
			{
				name: "Esmee",
				email: "asdf1@asdf",
				password: passwordHash.generate("asdf"),
				admin: false,
			},
			{
				name: "Roelof",
				email: "asdf2@asdf",
				password: passwordHash.generate("asdf"),
				admin: false,
			},
			{
				name: "Metta",
				email: "asdf3@asdf",
				password: passwordHash.generate("asdf"),
				admin: false,
			},
			{
				name: "Nina",
				email: "asdf4@asdf",
				password: passwordHash.generate("asdf"),
				admin: false,
			},
			{
				name: "Ief",
				email: "asdf5@asdf",
				password: passwordHash.generate("asdf"),
				admin: false,
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
		await queryInterface.bulkDelete("Sessions", null, {});
		await queryInterface.bulkDelete("Users", null, {});
	},
};
