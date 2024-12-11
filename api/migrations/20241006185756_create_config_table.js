/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("configs", (table) => {
        table.increments("id").primary();
        table.string("chat_id").notNullable();
        table.binary("config_mobileconfig").notNullable();
        table.binary("config_p12").notNullable();
        table.binary("config_sswan").notNullable();
        table.timestamp("valid_until_date").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("configs");
};
