import { InferSelectModel } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

const items = {
    id: text("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    quantity: integer("quantity", { mode: "number" }).notNull(),
};
export const electricalParts = sqliteTable("electrical-parts", {
    ...items,
    voltage: real("voltage"),
    current: real("current"),
    powerRating: real("power-rating"),
});
export const rawMaterials = sqliteTable("row-materials", {
    ...items,
    type: text("type"),
    purity: real("purity"),
});

// export const items = sqliteTable("inventory-items", {
//     id: text("id", { length: 36 })
//         .primaryKey()
//         .$defaultFn(() => randomUUID()),
//     name: text("name").notNull(),
//     quantity: integer("quantity", { mode: "number" }).notNull(),
// });

export const users = sqliteTable("users", {
    id: text("id", { length: 36 })
        .primaryKey()
        .$defaultFn(() => randomUUID()),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    role: text("role", { enum: ["user", "admin", "owner"] }).notNull(),
});

// export type InventoryItem = InferSelectModel<typeof items>;
export type ElectricalPart = InferSelectModel<typeof electricalParts>;
export type RawMaterials = InferSelectModel<typeof rawMaterials>;
export type User = InferSelectModel<typeof users>;
export type Item = { id: string; quantity: number; name: string };
