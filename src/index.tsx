import { Html, html } from "@elysiajs/html";
import jwt from "@elysiajs/jwt";
import { staticPlugin } from "@elysiajs/static";
import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { ACCESS_TOKEN_EXP, JWT_NAME } from "./config/constant";
import { db } from "./db";
import { Item, electricalParts, rawMaterials, users, User } from "./db/schema";
import { getExpTimestamp } from "./lib/utils";

const electricalPartsPlugin = new Elysia()
    .decorate("user", {})
    .get("/electrical-parts", async ({ user }) => {
        const data = await db.select().from(electricalParts).all();
        return (
            <>
                <Table
                    items={data}
                    endpoint="electrical-parts"
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "voltage", type: "number" },
                        { name: "current", type: "number" },
                        {
                            name: "powerRating",
                            type: "number",
                            placeholder: "power rating",
                        },
                    ]}
                    title="Electrical Parts"
                    role={(user as User)!.role}
                />
            </>
        );
    })
    .post(
        "/electrical-parts/edit",
        ({ body }) => {
            return (
                <RowEdit
                    item={body}
                    endpoint="electrical-parts"
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "voltage", type: "number" },
                        { name: "current", type: "number" },
                        { name: "powerRating", type: "number" },
                    ]}
                />
            );
        },
        {
            body: t.Object({
                id: t.String(),
                name: t.String(),
                quantity: t.Numeric(),
                voltage: t.Numeric(),
                current: t.Numeric(),
                powerRating: t.Numeric(),
            }),
        },
    )
    .delete(
        "/electrical-parts/:id",
        async ({ params }) => {
            await db
                .delete(electricalParts)
                .where(eq(electricalParts.id, params.id));
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .post(
        "/electrical-parts",
        async ({ body, redirect }) => {
            if (body.name.length === 0) {
                throw new Error("name can't be empty");
            }
            await db.insert(electricalParts).values(body).all();
            return redirect("/electrical-parts");
        },
        {
            body: t.Object({
                name: t.String(),
                quantity: t.Numeric(),
                voltage: t.Numeric(),
                current: t.Numeric(),
                powerRating: t.Numeric(),
            }),
        },
    )
    .get(
        "/electrical-parts/:id",
        async ({ params: { id }, user }) => {
            const electricalPart = await db
                .select()
                .from(electricalParts)
                .where(eq(electricalParts.id, id))
                .get();
            if (electricalPart)
                return (
                    <Row
                        item={electricalPart}
                        role={(user as User)!.role}
                        columns={[
                            { name: "name", type: "text" },
                            { name: "quantity", type: "number" },
                            { name: "voltage", type: "number" },
                            { name: "current", type: "number" },
                            { name: "powerRating", type: "number" },
                        ]}
                        endpoint="electrical-parts"
                    />
                );
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .put(
        "/electrical-parts/:id",
        async ({ body, params: { id }, user }) => {
            const electricalPart = await db
                .update(electricalParts)
                .set(body)
                .where(eq(electricalParts.id, id))
                .returning()
                .get();
            return (
                <Row
                    item={electricalPart}
                    role={(user as User)!.role}
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "voltage", type: "number" },
                        { name: "current", type: "number" },
                        { name: "powerRating", type: "number" },
                    ]}
                    endpoint="electrical-parts"
                />
            );
        },
        {
            params: t.Object({ id: t.String() }),
            body: t.Object({
                name: t.String(),
                quantity: t.Numeric(),
                voltage: t.Numeric(),
                current: t.Numeric(),
                powerRating: t.Numeric(),
            }),
        },
    );

const rawMaterialsPlugin = new Elysia()
    .decorate("user", {})
    .get("/raw-materials", async ({ user }) => {
        const data = await db.select().from(rawMaterials).all();
        return (
            <>
                <Table
                    items={data}
                    endpoint="raw-materials"
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "type", type: "string" },
                        { name: "purity", type: "number" },
                    ]}
                    title="Raw Materials"
                    role={(user as User)!.role}
                />
            </>
        );
    })
    .post(
        "/raw-materials/edit",
        ({ body }) => {
            return (
                <RowEdit
                    item={body}
                    endpoint="raw-materials"
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "type", type: "string" },
                        { name: "purity", type: "number" },
                    ]}
                />
            );
        },
        {
            body: t.Object({
                id: t.String(),
                name: t.String(),
                quantity: t.Numeric(),
                type: t.String(),
                purity: t.Numeric(),
            }),
        },
    )
    .delete(
        "/raw-materials/:id",
        async ({ params }) => {
            await db.delete(rawMaterials).where(eq(rawMaterials.id, params.id));
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .post(
        "/raw-materials",
        async ({ body, redirect }) => {
            if (body.name.length === 0) {
                throw new Error("name can't be empty");
            }
            await db.insert(rawMaterials).values(body).all();
            return redirect("/raw-materials");
        },
        {
            body: t.Object({
                name: t.String(),
                quantity: t.Numeric(),
                type: t.String(),
                purity: t.Numeric(),
            }),
        },
    )
    .get(
        "/raw-materials/:id",
        async ({ params: { id }, user }) => {
            const rawMaterial = await db
                .select()
                .from(rawMaterials)
                .where(eq(rawMaterials.id, id))
                .get();
            if (rawMaterial)
                return (
                    <Row
                        item={rawMaterial}
                        role={(user as User)!.role}
                        columns={[
                            { name: "name", type: "text" },
                            { name: "quantity", type: "number" },
                            { name: "type", type: "string" },
                            { name: "purity", type: "number" },
                        ]}
                        endpoint="raw-materials"
                    />
                );
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .put(
        "/raw-materials/:id",
        async ({ body, params: { id }, user }) => {
            const rawMaterial = await db
                .update(rawMaterials)
                .set(body)
                .where(eq(rawMaterials.id, id))
                .returning()
                .get();
            return (
                <Row
                    item={rawMaterial}
                    role={(user as User)!.role}
                    columns={[
                        { name: "name", type: "text" },
                        { name: "quantity", type: "number" },
                        { name: "type", type: "string" },
                        { name: "purity", type: "number" },
                    ]}
                    endpoint="raw-materials"
                />
            );
        },
        {
            params: t.Object({ id: t.String() }),
            body: t.Object({
                name: t.String(),
                quantity: t.Numeric(),
                type: t.String(),
                purity: t.Numeric(),
            }),
        },
    );

const usersPlugin = new Elysia()
    .decorate("user", {})
    .get("/users", async ({ user }) => {
        const data = await db.select().from(users).all();
        return (
            <>
                <UsersTable
                    users={data}
                    endpoint="users"
                    columns={[
                        { name: "username", type: "text" },
                        { name: "role", type: "string" },
                    ]}
                    title="Users"
                    role={(user as User)!.role}
                />
            </>
        );
    })
    .delete(
        "/users/:id",
        async ({ params }) => {
            await db.delete(users).where(eq(users.id, params.id));
        },
        {
            params: t.Object({ id: t.String() }),
        },
    )
    .put(
        "/users/:id",
        async ({ params: { id }, user }) => {
            const userData = await db
                .update(users)
                .set({ role: "admin" })
                .where(eq(users.id, id))
                .returning()
                .get();
            return (
                <UserRow
                    user={userData}
                    role={(user as User)!.role}
                    columns={[
                        { name: "username", type: "text" },
                        { name: "role", type: "text" },
                    ]}
                    endpoint="users"
                />
            );
        },
        {
            params: t.Object({ id: t.String() }),
        },
    );

new Elysia()
    .use(staticPlugin())
    .use(html())
    .use(
        jwt({
            name: JWT_NAME,
            secret: Bun.env.JWT_SECRET!,
        }),
    )
    .derive(async ({ jwt, cookie: { auth } }) => {
        if (!auth.value) return;
        const jwtPayload = await jwt.verify(auth.value);
        if (!jwtPayload) return;
        const userId = jwtPayload.sub;
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, userId!))
            .get();
        if (!user) return;
        return { user };
    })
    .get("/sign-up", ({ user, redirect }) => {
        if (user && Object.keys(user).length !== 0) return redirect("/");
        return (
            <Base>
                <SignUp />
            </Base>
        );
    })
    .get("/sign-in", ({ user, redirect }) => {
        if (user && Object.keys(user).length !== 0) return redirect("/");
        return (
            <Base>
                <SignIn />
            </Base>
        );
    })
    .post(
        "/sign-up",
        async ({ body, set }) => {
            const password = await Bun.password.hash(body.password, {
                algorithm: "bcrypt",
                cost: 10,
            });

            const user = await db
                .select()
                .from(users)
                .where(eq(users.username, body.username))
                .get();
            if (user) return "User Already Registered";
            await db
                .insert(users)
                .values({
                    username: body.username,
                    password,
                    role: "user",
                })
                .returning()
                .get();

            set.headers["HX-Redirect"] = "/sign-in";
        },
        {
            body: t.Object({
                username: t.String({ minLength: 4 }),
                password: t.String({ minLength: 6 }),
            }),
        },
    )
    .post(
        "/sign-in",
        async ({ body, jwt, cookie: { auth }, set }) => {
            const user = await db
                .select()
                .from(users)
                .where(eq(users.username, body.username))
                .get();
            if (!user) {
                return "User or Password Wrong";
            }
            // match password
            const matchPassword = await Bun.password.verify(
                body.password,
                user.password,
                "bcrypt",
            );
            if (!matchPassword) {
                return "User or Password Wrong";
            }

            // create access token
            const accessJWTToken = await jwt.sign({
                sub: user.id,
                exp: getExpTimestamp(ACCESS_TOKEN_EXP),
            });
            if (!body.rememberMe)
                auth.set({
                    value: accessJWTToken,
                    httpOnly: true,
                    path: "/",
                    sameSite: "none",
                    secure: true,
                });
            else
                auth.set({
                    value: accessJWTToken,
                    httpOnly: true,
                    maxAge: ACCESS_TOKEN_EXP,
                    path: "/",
                    sameSite: "none",
                    secure: true,
                });

            set.headers["HX-Redirect"] = "/";
            return {
                message: "Sign-in successfully",
                data: {
                    user: user,
                    accessToekn: accessJWTToken,
                },
            };
        },
        {
            body: t.Object({
                username: t.String(),
                password: t.String(),
                rememberMe: t.Optional(t.String()),
            }),
        },
    )
    .get("logout", ({ cookie: { auth }, set }) => {
        auth.remove();
        set.headers["HX-Redirect"] = "/sign-in";
    })
    .guard(
        {
            beforeHandle: ({ user, redirect }) => {
                if (!user || Object.keys(user).length === 0)
                    return redirect("/sign-in");
            },
        },
        (app) =>
            app
                .get("/", ({ user }) => (
                    <Base>
                        <div class="grid h-[100vh] grid-cols-[12rem_1fr] grid-rows-[auto_1fr]">
                            <aside class="row-span-full flex flex-col gap-4 bg-white p-2 shadow-[4px_0_4px_-5px_#00000040]">
                                <h2 class="mb-16 text-center text-xl font-bold">
                                    Curt Inventory
                                </h2>
                                <button
                                    class="sidebar-button cursor-pointer rounded-md bg-slate-800 p-2 text-slate-100 transition-colors duration-300 hover:bg-slate-800 hover:text-slate-100"
                                    hx-get="/electrical-parts"
                                    hx-swap="innerHTML"
                                    hx-target="main"
                                    hx-trigger={`click[document.querySelector("main").dataset.items!=="electrical-parts"]`}
                                    _={`
on click 
set document.querySelector("main").dataset.items to "electrical-parts"
set buttons to document.querySelectorAll(".sidebar-button")

for button in buttons
    remove .bg-slate-800 from button remove .text-slate-100 from button
end

add .bg-slate-800 add .text-slate-100 
`}
                                    hx-indicator="#main"

                                    //                                     _={`on load set global main to document.querySelector("main")
                                    // if main.dataset.items is "electrical-parts" add .bg-slate-950 to target end
                                    // on click set main.dataset.items to "electrical-parts" `}
                                >
                                    Electrical Parts
                                </button>
                                <button
                                    class="sidebar-button cursor-pointer rounded-md p-2 transition-colors duration-300 hover:bg-slate-800 hover:text-slate-100"
                                    hx-get="/raw-materials"
                                    hx-swap="innerHTML"
                                    hx-target="main"
                                    hx-trigger={`click[document.querySelector("main").dataset.items!=="raw-materials"]`}
                                    _={`
on click 
set document.querySelector("main").dataset.items to "raw-materials"
set buttons to document.querySelectorAll(".sidebar-button")

for button in buttons
    remove .bg-slate-800 from button remove .text-slate-100 from button
end

add .bg-slate-800 add .text-slate-100 
`}
                                    hx-indicator="#main"
                                    //                                     _={`on load set global main to document.querySelector("main")
                                    // if main.dataset.items is "raw-materials" add .bg-slate-950 to target end
                                    // on click set main.dataset.items to "raw-materials"`}
                                >
                                    Raw Materials
                                </button>
                                {user!.role === "owner" && (
                                    <button
                                        class="sidebar-button cursor-pointer rounded-md p-2 transition-colors duration-300 hover:bg-slate-800 hover:text-slate-100"
                                        hx-get="/users"
                                        hx-swap="innerHTML"
                                        hx-target="main"
                                        hx-trigger={`click[document.querySelector("main").dataset.items!=="users"]`}
                                        _={`
on click 
set document.querySelector("main").dataset.items to "users"
set buttons to document.querySelectorAll(".sidebar-button")

for button in buttons
remove .bg-slate-800 from button remove .text-slate-100 from button
end

add .bg-slate-800 add .text-slate-100 
`}
                                        hx-indicator="#main"

                                        //                                     _={`on load set global main to document.querySelector("main")
                                        // if main.dataset.items is "electrical-parts" add .bg-slate-950 to target end
                                        // on click set main.dataset.items to "electrical-parts" `}
                                    >
                                        Users
                                    </button>
                                )}
                            </aside>
                            <header class="flex justify-between p-2">
                                <p class="ml-4 text-2xl font-semibold capitalize">
                                    Hello {user!.username} 👋🏼
                                </p>
                                <button
                                    hx-get="/logout"
                                    class="rounded-md bg-red-600 px-2 py-1 text-lg font-semibold text-red-50 transition-colors duration-500 hover:bg-red-800"
                                >
                                    Logout
                                </button>
                            </header>
                            <div class="relative" id="main">
                                <main
                                    hx-get="/electrical-parts"
                                    hx-swap="innerHTML"
                                    hx-trigger="load"
                                    class="h-full w-full items-center justify-center overflow-auto"
                                    data-items="electrical-parts"
                                    hx-indicator="#main"
                                ></main>
                                <div
                                    id="spinner"
                                    class="absolute top-0 flex h-full w-full justify-center"
                                >
                                    <svg
                                        aria-hidden="true"
                                        class="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                                        viewBox="0 0 100 101"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                            fill="currentFill"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Base>
                ))
                .use(electricalPartsPlugin)
                .use(rawMaterialsPlugin)
                .use(usersPlugin),
    )
    .listen(3000);

// Base HTML Component
const Base = ({ children }: { children: JSX.Element }) => {
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossorigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
                    rel="stylesheet"
                />
                <link href="/public/main.css" rel="stylesheet" />
                {/* <script src="https://cdn.tailwindcss.com"></script> */}
                <script src="https://unpkg.com/htmx.org@2.0.1"></script>
                <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>

                <title>Curt Inventory</title>
            </head>
            <body class="bg-[#FAFBFF]">{children}</body>
        </html>
    );
};

//Table components
function TableData({
    children,
    className,
}: {
    children: JSX.Element;
    className?: string;
}) {
    return (
        <td class={`p-4 ${className} w-fit transition-colors duration-1000`}>
            {children}
        </td>
    );
}
function TableHeader({ children }: { children: JSX.Element }) {
    return (
        <th class="p-4 text-left font-semibold capitalize text-[#B5B7C0]">
            {children}
        </th>
    );
}

function Row<T extends Item>({
    item,
    role,
    columns,
    endpoint,
}: {
    item: T;
    role: string;
    columns: { name: keyof T; type: string }[];
    endpoint: string;
}) {
    const vals = Object.entries(item).map(([key, value]) => {
        return `"${key}":"${value}"`;
    });
    return (
        <tr class="w-full">
            {columns.map((col) => (
                <TableData>{String(item[col.name])}</TableData>
            ))}
            {role !== "user" && (
                <TableData className="delete-cell">
                    <div class="flex justify-between" hx-indicator="none">
                        <button
                            hx-delete={`/${endpoint}/${item.id}`}
                            class="delete-button"
                            hx-confirm="Are you sure?"
                            hx-target="closest tr"
                            hx-swap="outerHTML swap:0.7s"
                            title="delete item"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6 text-red-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                        <button
                            id={`edit-button-${item.id}`}
                            hx-post={`/${endpoint}/edit`}
                            hx-target="closest tr"
                            hx-swap="outerHTML"
                            hx-vals={`{${vals.join(",")}}`}
                            // hx-vals={`{"name":"${name}","quantity":${quantity},"voltage":${voltage},"current":${current},"powerRating":${powerRating}}`}
                            hx-trigger="click"
                            title="edit item"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="size-6 text-slate-600"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </button>
                    </div>
                </TableData>
            )}
        </tr>
    );
}

function RowEdit<T extends Item>({
    item,
    endpoint,
    columns,
}: {
    item: T;
    endpoint: string;
    columns: { name: keyof T; type: string }[];
}) {
    return (
        <tr class="w-full" id={`edit-table-row-${item.id}`}>
            {columns.map((col) => (
                <TableData>
                    <input
                        type={col.type}
                        value={String(item[col.name])}
                        class="m-[-0.5rem] p-2 focus:outline-none"
                        placeholder={`${String(col.name)} can't be empty`}
                        name={String(col.name)}
                        form={`edit-${endpoint}-${item.id}`}
                        required
                    />
                </TableData>
            ))}
            <TableData className="delete-cell">
                <div class="flex justify-between">
                    <button
                        hx-get={`/${endpoint}/${item.id}`}
                        hx-target="closest tr"
                        hx-swap="outerHTML"
                        hx-indicator="none"
                        title="cancel edit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="h-6 w-7 text-red-600"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <button
                        type="submit"
                        id={`save-button-${item.id}`}
                        form={`edit-${endpoint}-${item.id}`}
                        hx-indicator="none"
                        title="save item"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="h-6 w-7 text-slate-600"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </TableData>
        </tr>
    );
}

function Table<T extends Item>({
    items,
    role,
    endpoint,
    title,
    columns,
}: {
    items: T[];
    role: string;
    endpoint: string;
    title: string;
    columns: { name: keyof T; type: string; placeholder?: string }[];
}) {
    return (
        <div
            id={`${endpoint}-list`}
            class="flex h-fit w-full items-start justify-center p-4"
        >
            <form
                class="hidden"
                hx-post={`/${endpoint}`}
                hx-target="closest main"
                hx-swap="innerHTML"
                id={`add-${endpoint}`}
                hx-indicator="none"
                // _="on submit wait for htmx:afterOnLoad then target.reset()"
            ></form>
            {items.map((item) => (
                <form
                    class="hidden"
                    hx-put={`/${endpoint}/${item.id}`}
                    hx-target={`#edit-table-row-${item.id}`}
                    hx-swap="outerHTML"
                    hx-indicator="none"
                    id={`edit-${endpoint}-${item.id}`}
                ></form>
            ))}
            <table class="w-fit border-collapse rounded-md bg-white shadow-md shadow-slate-700">
                <thead>
                    <th
                        class="p-4 pb-6 text-left text-2xl font-bold"
                        colspan="100"
                    >
                        {title}
                    </th>
                </thead>
                <thead class="border-b border-slate-400">
                    {columns.map((col) => (
                        <TableHeader>{String(col.name)}</TableHeader>
                    ))}
                    {role !== "user" && <TableHeader>Options</TableHeader>}
                </thead>
                <tbody>
                    {items.map((item) => (
                        <Row
                            item={item}
                            role={role}
                            columns={columns}
                            endpoint={endpoint}
                        />
                    ))}
                    {role !== "user" && (
                        <RowAdd columns={columns} endpoint={endpoint} />
                    )}
                </tbody>
            </table>
        </div>
    );
}

function RowAdd<T extends Item>({
    columns,
    endpoint,
}: {
    columns: { name: keyof T; type: string; placeholder?: string }[];
    endpoint: string;
}) {
    return (
        <tr class="w-full">
            {columns.map((col) => (
                <TableData>
                    <input
                        type={col.type}
                        name={String(col.name)}
                        class="m-[-0.5rem] p-2 focus:outline-none"
                        placeholder={col.placeholder || String(col.name)}
                        form={`add-${endpoint}`}
                        required
                    />
                </TableData>
            ))}
            <TableData>
                <div class="flex w-full justify-center">
                    <button
                        type="submit"
                        form={`add-${endpoint}`}
                        title="add item"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="size-8 text-slate-600"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            </TableData>
        </tr>
    );
}

function SignUp() {
    return (
        <div class="flex h-dvh w-dvw items-center justify-center bg-white backdrop-blur-lg">
            <form
                class="mb-36 flex w-fit flex-col items-center gap-4 border-4 border-slate-800 bg-slate-100 p-4 shadow-lg shadow-slate-950"
                hx-post="/sign-up"
                hx-target="#sign-up-error"
                hx-swap="innerHTML"
                id="sign-up"
                _={`on submit wait for htmx:afterOnLoad then target.reset() document.querySelector("#sign-up-username").focus()`}
            >
                <div class="relative grid grid-cols-[max-content_1fr] items-center gap-4">
                    <label for="sign-up-username">User Name:</label>
                    <input
                        id="sign-up-username"
                        type="text"
                        name="username"
                        placeholder="username"
                        class="rounded-md border border-slate-600 p-2"
                        required
                        minlength={4}
                    />
                    <label for="sign-up-password">Password:</label>
                    <input
                        id="sign-up-password"
                        class="rounded-md border border-slate-600 p-2"
                        type="password"
                        name="password"
                        placeholder="password"
                        required
                        minlength={6}
                    />
                    <button
                        type="button"
                        _={`on click  set password to document.querySelector("#sign-up-password") if password.type is "text" set password.type to "password" else set password.type to "text"`}
                        class="absolute bottom-2 right-2"
                        title="show/hide password"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                    </button>
                </div>
                <button
                    class="w-fit rounded-lg border-2 border-slate-900 bg-slate-700 px-1 py-2 text-slate-100 transition-colors duration-500 hover:bg-slate-300 hover:text-slate-900"
                    type="submit"
                >
                    Sign Up
                </button>
                <p>
                    <span
                        id="sign-up-error"
                        class="h-fit text-lg text-red-800"
                    ></span>
                </p>
                <div class="mt-2 flex w-full items-center gap-2">
                    <span>Already Registered?</span>
                    <a
                        class="w-fit text-slate-900 underline transition-colors duration-500 hover:text-slate-500"
                        href="/sign-in"
                    >
                        Sign In
                    </a>
                </div>
            </form>
        </div>
    );
}

function SignIn() {
    return (
        <div class="flex h-dvh w-dvw items-center justify-center bg-white backdrop-blur-lg">
            <form
                class="mb-36 flex w-fit flex-col items-center gap-4 border-4 border-slate-800 bg-slate-100 p-4 shadow-lg shadow-slate-950"
                hx-post="/sign-in"
                hx-target="#sign-in-error"
                hx-swap="innerHTML"
                id="sign-in"
                _={`on submit wait for htmx:afterOnLoad then target.reset() document.querySelector("#sign-in-username").focus()`}
            >
                <div class="relative grid grid-cols-[max-content_1fr] items-center gap-4">
                    <label for="sign-in-username">User Name:</label>
                    <input
                        id="sign-in-username"
                        type="text"
                        name="username"
                        placeholder="username"
                        class="rounded-md border border-slate-600 p-2"
                        required
                    />
                    <label for="sign-in-password">Password:</label>
                    <input
                        id="sign-in-password"
                        class="rounded-md border border-slate-600 p-2"
                        type="password"
                        name="password"
                        placeholder="password"
                        required
                    />
                    <button
                        type="button"
                        _={`on click  set password to document.querySelector("#sign-in-password") if password.type is "text" set password.type to "password" else set password.type to "text"`}
                        class="absolute bottom-2 right-2"
                        title="show/hide password"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                    </button>
                </div>
                <div class="flex w-full gap-2">
                    <label for="sign-in-remember">Remember Me</label>
                    <input
                        id="sign-in-remember"
                        class="rounded-md border border-slate-600 p-2"
                        type="checkbox"
                        name="rememberMe"
                    />
                </div>
                <button
                    class="w-fit rounded-lg border-2 border-slate-900 bg-slate-700 px-1 py-2 text-slate-100 transition-colors duration-500 hover:bg-slate-300 hover:text-slate-900"
                    type="submit"
                >
                    Sign In
                </button>
                <p>
                    <span
                        id="sign-in-error"
                        class="h-fit text-lg text-red-800"
                    ></span>
                </p>
                <div class="mt-2 flex w-full items-center gap-2">
                    <span>Not A User?</span>
                    <a
                        class="w-fit text-slate-900 underline transition-colors duration-500 hover:text-slate-500"
                        href="/sign-up"
                    >
                        Sign Up
                    </a>
                </div>
            </form>
        </div>
    );
}

// Users Components
function UserRow<T extends User>({
    user,
    role,
    columns,
    endpoint,
}: {
    user: T;
    role: string;
    columns: { name: keyof T; type: string }[];
    endpoint: string;
}) {
    return (
        <tr class="w-full" id={`user-table-row-${user.id}`}>
            {columns.map((col) => (
                <TableData>{String(user[col.name])}</TableData>
            ))}
            {role === "owner" && (
                <TableData className="delete-cell">
                    <div class="flex justify-between" hx-indicator="none">
                        {user.role !== "owner" && (
                            <button
                                hx-delete={`/${endpoint}/${user.id}`}
                                class="delete-button"
                                hx-confirm="Are you sure?"
                                hx-target="closest tr"
                                hx-swap="outerHTML swap:0.7s"
                                title="delete user"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6 text-red-600"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </button>
                        )}
                        {user.role === "user" && (
                            <button
                                id={`admin-button-${user.id}`}
                                // hx-post={`/${endpoint}/edit`}
                                form={`edit-${endpoint}-${user.id}`}
                                hx-indicator="none"
                                title="make admin"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    class="size-6 text-slate-800"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </TableData>
            )}
        </tr>
    );
}

function UsersTable<T extends User>({
    users,
    role,
    endpoint,
    title,
    columns,
}: {
    users: T[];
    role: string;
    endpoint: string;
    title: string;
    columns: { name: keyof T; type: string; placeholder?: string }[];
}) {
    return (
        <div
            id={`${endpoint}-list`}
            class="flex h-fit w-full items-start justify-center p-4"
        >
            {users.map((user) => (
                <form
                    class="hidden"
                    hx-put={`/${endpoint}/${user.id}`}
                    hx-target={`#user-table-row-${user.id}`}
                    hx-swap="outerHTML"
                    hx-indicator="none"
                    id={`edit-${endpoint}-${user.id}`}
                ></form>
            ))}
            <table class="w-fit border-collapse rounded-md bg-white shadow-md shadow-slate-700">
                <thead>
                    <th
                        class="p-4 pb-6 text-left text-2xl font-bold"
                        colspan="100"
                    >
                        {title}
                    </th>
                </thead>
                <thead class="border-b border-slate-400">
                    {columns.map((col) => (
                        <TableHeader>{String(col.name)}</TableHeader>
                    ))}
                    {role !== "user" && <TableHeader>Options</TableHeader>}
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow
                            user={user}
                            role={role}
                            columns={columns}
                            endpoint={endpoint}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
