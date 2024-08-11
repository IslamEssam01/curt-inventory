import { Elysia, t } from "elysia";
import { Html, html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { db } from "./db";
import { InventoryItem, items } from "./db/schema";
import { eq } from "drizzle-orm";

new Elysia()
    .use(staticPlugin())
    .use(html())
    .get("/", () => (
        <Base>
            <>
                <div
                    hx-get="/items"
                    hx-swap="innerHTML"
                    hx-trigger="load"
                    // hx-indicator="#spinner"
                >
                    <div id="spinner">Loading</div>
                </div>
            </>
        </Base>
    ))
    .post("/clicked", () => "HELLOOO")
    .get("/items", async () => {
        const data = await db.select().from(items).all();
        return <ItemList inventoryItems={data} />;
    })
    .delete(
        "/items/:id",
        async ({ params }) => {
            await db.delete(items).where(eq(items.id, params.id));
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .post(
        "/items",
        async ({ body }) => {
            if (body.name.length === 0) {
                throw new Error("name can't be empty");
            }
            const newItem = await db
                .insert(items)
                .values(body)
                .returning()
                .get();
            return <Item {...newItem} />;
        },
        {
            body: t.Object({
                name: t.String(),
                quantity: t.Numeric(),
            }),
        },
    )
    .listen(3000);

const Base = ({ children }: { children: JSX.Element }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link href="/public/main.css" rel="stylesheet" />
                <script src="https://cdn.tailwindcss.com"></script>
                <script src="https://unpkg.com/htmx.org@2.0.1"></script>
                <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
                <title>Curt Inventory</title>
            </head>
            <body>
                <h1 class="text-4xl">Curt Inventory</h1>
                {children}
            </body>
        </html>
    );
};

function Item({ name, quantity, id }: InventoryItem) {
    return (
        <div class="flex gap-2">
            <div class="flex flex-col gap-4">
                <div class="flex gap-2 items-center">
                    <span>Id:</span> <span>{id}</span>
                </div>
                <div class="flex gap-2 items-center">
                    <span>Name:</span> <span>{name}</span>
                </div>
                <div class="flex gap-2 items-center">
                    <span>Quantity:</span> <span>{quantity}</span>
                </div>
            </div>
            <button
                hx-delete={`/items/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            >
                Delete
            </button>
        </div>
    );
}

function ItemList({ inventoryItems }: { inventoryItems: InventoryItem[] }) {
    return (
        <div class="flex flex-col gap-8">
            {inventoryItems.map((item) => (
                <Item {...item} />
            ))}
            <ItemForm />
        </div>
    );
}

function ItemForm() {
    return (
        <form
            class="flex space-x-3"
            hx-post="/items"
            hx-swap="beforebegin"
            _="on submit wait for htmx:afterOnLoad then target.reset()"
        >
            <input
                type="text"
                name="name"
                class="border border-black"
                required
            />
            <input
                type="number"
                name="quantity"
                class="border border-black"
                required
            />
            <button type="submit">Add</button>
        </form>
    );
}
