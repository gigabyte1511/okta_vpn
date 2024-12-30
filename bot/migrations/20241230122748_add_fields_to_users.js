/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.string("name").defaultTo(null); // Добавляем поле name
        table.integer("telegramid").defaultTo(null); // Добавляем поле telegramid
        table.string("telegramlink").defaultTo(null); // Добавляем поле telegramlink
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("name"); // Удаляем поле name
        table.dropColumn("telegramid"); // Удаляем поле telegramid
        table.dropColumn("telegramlink"); // Удаляем поле telegramlink
    });
};