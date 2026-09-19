import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, isStaffAuthReady } from "@/server/auth";

export const runtime = "nodejs";

async function handleAuth(request: Request): Promise<Response> {
  if (!isStaffAuthReady()) {
    return Response.json(
      {
        error: "auth-unavailable",
        message: "Staff authentication is not configured in this environment.",
      },
      { status: 503 },
    );
  }

  try {
    const auth = await getAuth();
    return auth.handler(request);
  } catch {
    return Response.json(
      {
        error: "auth-unavailable",
        message: "Staff authentication could not start.",
      },
      { status: 503 },
    );
  }
}

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler({
  handler: handleAuth,
});
