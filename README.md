# Skileman Backend Task: Auth Service

For this MVP, I decided to skip the standard "single-file" API route approach. Instead, I structured this as a standalone microservice to demonstrate how I handle code organization in production apps.

### 🏗️ The Approach
I separated the concerns into three distinct layers:
1.  **API Layer (`/app/api`)**: Handles the HTTP request, status codes, and response formatting.
2.  **Service Layer (`/services`)**: Contains the actual business logic. This makes it easier to unit test later without mocking the entire HTTP request.
3.  **Validation Layer (`/lib`)**: I used **Zod** to sanitize inputs before they even reach the logic.

### 🛡️ Security Decisions
- **Strict Validation**: The Zod schema is set to `.strict()` to strip out any unexpected fields in the payload (prevents mass assignment issues).
- **Error Standards**: I used the **RFC 7807** format for errors. It’s cleaner for frontend teams to parse than generic text strings.
- **Hashing**: In the mock service, I referenced **Argon2id**. For a real deployment, I'd prefer that over Bcrypt for better GPU resistance.

### 🚀 Running Locally
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the dev server:
    ```bash
    npm run dev
    ```
3.  Test the endpoint at `POST http://localhost:3000/api/v1/auth/login`

**Bolu Adeoye**
