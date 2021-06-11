"use strict";
const faker = require("faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const user_id = 1;
        const folder_id = 1;

        const notes = [];

        for (let i = 0; i < 10; i++) {
            notes.push({
                filename: faker.lorem.word(),
                content: faker.lorem.paragraph(),
                folder_id,
                user_id,
            });
        }

        await queryInterface.bulkInsert("Notes", notes);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Notes", null, {});
    },
};
