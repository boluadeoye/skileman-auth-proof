import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { LoginSchema } from "@/modules/auth/validators/login.schema";
import { AuthService } from "@/modules/auth/services/auth.service";

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const traceId = uuidv4();
  const timestamp = new Date().toISOString();

  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        type: "https://api.skileman.com/probs/validation-error",
        title: "Validation Failed",
        status: 400,
        detail: "Schema validation failed for request payload.",
        instance: `/api/v1/auth/login`,
        trace_id: traceId,
        errors: validation.error.format()
      }, { status: 400 });
    }

    const result = await AuthService.authenticate(
      validation.data.email, 
      validation.data.password
    );

    return NextResponse.json({
      success: true,
      meta: {
        trace_id: traceId,
        timestamp: timestamp,
      },
      data: result
    }, { status: 200 });

  } catch (error) {
    if (error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json({
        type: "https://api.skileman.com/probs/auth-error",
        title: "Authentication Failed",
        status: 401,
        detail: "Invalid credentials provided.",
        trace_id: traceId
      }, { status: 401 });
    }

    console.error(`[FATAL] Trace: ${traceId}`, error);
    
    return NextResponse.json({
      type: "https://api.skileman.com/probs/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      trace_id: traceId
    }, { status: 500 });
  }
}
