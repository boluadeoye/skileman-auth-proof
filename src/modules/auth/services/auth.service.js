import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const MOCK_DB = {
  user: {
    id: "usr_01JHTX5",
    email: "founding.engineer@skileman.com",
    password_hash: "$2a$10$X7V.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5.j5", 
    role: "LEAD_ENGINEER",
    status: "ACTIVE"
  }
};

export class AuthService {
  /**
   * Validates credentials and issues session token
   * @param {string} email 
   * @param {string} password 
   */
  static async authenticate(email, password) {
    // Simulate DB latency
    await new Promise(resolve => setTimeout(resolve, 50));
    
    const user = MOCK_DB.user;

    if (email !== user.email) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Production: Use Argon2id verify here
    const isMatch = (password === "Skileman2026!"); 

    if (!isMatch) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: `skil_${uuidv4().replace(/-/g, '')}`,
      expires_in: 3600
    };
  }
}
