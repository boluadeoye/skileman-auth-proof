import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { LoginSchema } from "@/modules/auth/validators/login.schema";
import { AuthService } from "@/modules/auth/services/auth.service";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  // 1. Observability: Generate a Trace ID for this request
  const traceId = uuidv4();
  const timestamp = new Date().toISOString();

  try {
    // 2. Payload Parsing
    const body = await req.json();

    // 3. Schema Validation (The Shield)
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      // RFC 7807 Problem Details Format
      return NextResponse.json({
        type: "https://api.skileman.com/probs/validation-error",
        title: "Validation Failed",
        status: 400,
        detail: "The request payload failed schema validation.",
        instance: `/api/v1/auth/login`,
        trace_id: traceId,
        errors: validation.error.format()
      }, { status: 400 });
    }

    // 4. Business Logic Execution
    const result = await AuthService.authenticate(
      validation.data.email, 
      validation.data.password
    );

    // 5. Success Response
    return NextResponse.json({
      success: true,
      meta: {
        trace_id: traceId,
        timestamp: timestamp,
        server_latency: "12ms" // Mocked metric
      },
      data: result
    }, { status: 200 });

  } catch (error) {
    // 6. Secure Error Handling
    const isAuthError = error.message === "INVALID_CREDENTIALS";
    
    if (isAuthError) {
      return NextResponse.json({
        type: "https://api.skileman.com/probs/auth-error",
        title: "Authentication Failed",
        status: 401,
        detail: "Invalid email or password.",
        trace_id: traceId
      }, { status: 401 });
    }

    // Fatal Error (Log this internally, do not leak details to client)
    console.error(`[FATAL] Trace: ${traceId}`, error);
    
    return NextResponse.json({
      type: "https://api.skileman.com/probs/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      detail: "An unexpected condition was encountered.",
      trace_id: traceId
    }, { status: 500 });
  }
}
