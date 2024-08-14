
# Curt Inventory

## Features

- **Elysia Framework**: Leverages Elysia for fast and scalable API development.
- **Bun Runtime**: Utilizes Bun for high-performance execution.
- **Turso Database**: Uses Turso as the primary database solution.
- **HTMX for Frontend**: Utilizes HTMX for dynamic, server-driven UI updates without full page reloads.
- **Hyperscript**: Employs Hyperscript as an inline scripting library for enhanced client-side interactions.
- **Drizzle ORM**: Handles database migrations and schema management with Drizzle ORM.
- **Efficient Inventory Tracking**: Provides tools to manage products, categories, and stock levels.
- **User Authentication**: Secure authentication and authorization mechanisms.

## Getting Started

### Prerequisites

- **Bun**: Ensure that Bun is installed on your system. [Install Bun](https://bun.sh/)
- **Turso CLI**: Install the Turso CLI for managing the Turso database. [Install Turso CLI](https://docs.turso.tech/cli/installation)
- **Drizzle ORM**: Drizzle is included in the dependencies.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/IslamEssam01/curt-inventory.git
   cd curt-inventory
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Database Setup

1. **Set Up Turso Database**:
   - Log in to Turso CLI:
     ```bash
     turso auth login
     ```
   - Create a new database:
     ```bash
     turso db create curt_inventory_db
     ```
   - Retrieve the database URL:
     ```bash
     turso db show curt_inventory_db
     ```
   - Create a token for the database:
     ```bash
     turso db tokens create curt-inventor
     ```
   - Create a JWT Secret

   - Add the database URL and token to the .env file:
     ```env
     DATABASE_URL="your_turso_database_url_here"
     DATABASE_AUTH_TOKEN="your_token"
     JWT_SECRET="your_secret"
     ```

2. **Run Migrations with Drizzle ORM**:
   - Push Database Schema using drizzle:
     ```bash
     bun run db:push
     ```
### Running the Application

Start the application:

```bash
bun run start
```

### Usage

- **API Endpoints**: Interact with the inventory system via API endpoints.
- **Authentication**: Access secure routes with valid credentials.

### License

This project is licensed under the MIT License.
