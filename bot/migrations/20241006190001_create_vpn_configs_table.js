/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("vpn_configs", (table) => {
        table.increments("id").primary();
        table
            .bigInteger("chat_id")
            .unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.string("name").notNullable();
        table.string("config_json").notNullable();
        table.date("valid_until_date").notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.string("transaction_id").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("vpn_configs");
};
