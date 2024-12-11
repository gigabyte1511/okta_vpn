/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("transactions", (table) => {
        table.string("id").primary();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table
            .bigInteger("chat_id")
            .unsigned()
            .references("id")
            .inTable("users")
            .onDelete("CASCADE");
        table.boolean("state").defaultTo(false);
        table.bigInteger("amount").defaultTo(null);
        table.string("type").defaultTo(null);
        table.string("orderValue").defaultTo(null);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("transactions");
};
