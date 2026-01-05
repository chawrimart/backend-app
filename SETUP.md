# ChawriMart Backend Setup Guide

This guide provides instructions on how to set up and run the ChawriMart backend application, either natively or using Docker.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher) - for native run
- [Docker](https://www.docker.com/products/docker-desktop) & Docker Compose - for Docker run
- [Git](https://git-scm.com/)

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/chawrimart/backend-app.git
    cd backend-app
    ```

## Option 1: Running with Docker (Recommended)

This is the easiest way to run the application as it automatically sets up MySQL and Redis for you.

1.  **Run Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    This command will:
    - Build the NestJS application image.
    - Start a MySQL container (setup with `chawrimart_db`).
    - Start a Redis container.
    - Start the Backend App container on port 3000.

2.  **Access the API:**
    - The API will be available at `http://localhost:3000`.

3.  **Stopping the containers:**
    - Press `Ctrl+C` to stop.
    - To remove containers: `docker-compose down`

## Option 2: Running Natively

If you prefer to run the application directly on your machine.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Setup Database & Redis:**
    - Ensure you have **MySQL** running locally. Create a database named `chawrimart_db`.
    - Ensure you have **Redis** running locally on port 6379.

3.  **Environment Configuration:**
    - Create a `.env` file in the root directory (or update defaults in `src/config`).
    - Example `.env`:
        ```env
        PORT=3000
        DB_HOST=localhost
        DB_PORT=3306
        DB_USERNAME=root
        DB_PASSWORD=your_password
        DB_NAME=chawrimart_db
        REDIS_HOST=localhost
        REDIS_PORT=6379
        JWT_SECRET=supersecretkey
        JWT_EXPIRES_IN=7d
        ```

4.  **Run the Application:**
    - Development mode:
        ```bash
        npm run start:dev
        ```
    - Production mode:
        ```bash
        npm run build
        npm run start:prod
        ```

## Project Structure

- `src/app.module.ts`: Root module.
- `src/modules/`: Feature modules (Auth, Users, Products, etc.).
- `src/shared/entities/`: Database entities.
- `docker-compose.yml`: Docker services configuration.
- `Dockerfile`: App container definition.

## Testing

- Run unit tests: `npm run test`
- Run e2e tests: `npm run test:e2e`
