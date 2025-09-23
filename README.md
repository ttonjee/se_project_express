🧥 WTWR (What to Wear?): Back End
The WTWR (What to Wear?) project is the backend portion of a full-stack web application that allows users to manage their wardrobe, view suggested outfits, and share clothing items. This server-side application handles data storage, user authentication, and routing logic, forming the foundation for interaction with the front-end client.

🔧 Project Functionality
This Node.js Express server supports the following core features:

User Registration and Authentication
Users can register and log in to the application. JWT-based authentication is used for session management.

Item Management
Users can:

Add new clothing items to their collection

View their personal wardrobe

Delete items they own

User Profile Management
Users can:

Retrieve their user data

Update their profile information

Robust Error Handling
Meaningful error responses are returned for invalid requests, unauthorized access, and missing resources.

🛠️ Technologies and Techniques Used
Node.js
Runtime environment used to run JavaScript on the server side.

Express.js
Framework used to simplify routing, middleware integration, and server setup.

MongoDB + Mongoose

MongoDB is used as a NoSQL database for storing users and items.

Mongoose is used to define schemas and models for application data.

ESLint
Enforces consistent coding standards and automatically detects code quality issues.

dotenv
Loads environment variables from .env files securely.

RESTful API Design
The backend is structured as a REST API, making it easy to integrate with any frontend.

JWT (JSON Web Tokens)
Used for user authentication and secure access to protected routes.

Middleware Patterns
Custom middleware is used for authentication, request parsing, error handling, and mock user setup during development.

## 🌐 Deployment

The WTWR application is deployed and accessible at the following domains:

**Frontend Application:**
- **Domain:** https://flexx.crabdance.com
- **Description:** The user interface for the WTWR application where users can interact with their wardrobe and clothing items

**Backend API:**
- **Domain:** https://api.flexx.crabdance.com
- **Description:** RESTful API server handling authentication, data management, and business logic

Both applications are deployed with proper CORS configuration to ensure secure communication between the frontend and backend services.
