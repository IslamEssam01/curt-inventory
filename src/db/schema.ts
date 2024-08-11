import { InferSelectModel } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

export const items = sqliteTable("inventory-items", {
    id: text("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    quantity: integer("quantity", { mode: "number" }).notNull(),
});

export type InventoryItem = InferSelectModel<typeof items>;
