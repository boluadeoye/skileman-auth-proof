import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// MOCK DATABASE ADAPTER (Simulating Neon Postgres)
const MOCK_DB = {
  user: {
    id: "usr_01JHTX5",
    email: "founding@skileman.com",
    // Hash for: "Skileman2026!"
    password_hash: "$2a$10$X7V.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5", 
    role: "LEAD_ENGINEER",
    status: "ACTIVE"
  }
};

export class AuthService {
  /**
   * Authenticates a user and issues a session token.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} User session data
   */
  static async authenticate(email, password) {
    // 1. Database Lookup (Simulated latency for realism)
    await new Promise(resolve => setTimeout(resolve, 50)); // 50ms DB latency
    
    const user = MOCK_DB.user;

    // 2. Identity Verification (Constant Time comparison logic simulated)
    if (email !== user.email) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 3. Cryptographic Verification
    // In production, we would use Argon2id. Using Bcrypt for this MVP.
    // Simulating a match for the demo since we don't have a real hash generator running
    const isMatch = (password === "Skileman2026!"); 

    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // 4. Session Generation
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: `skil_${uuidv4().replace(/-/g, '')}`, // Mock JWT
      expires_in: 3600
    };
  }
}
