import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

/** @see https://nextjs.org/docs/app/building-your-application/routing/middleware */

export async function middleware(request: NextRequest) {
  // middleware 는 요청 전에 실행된다.

  console.log({ isServer: !!typeof window }); // undefined (next server 에서 실행되므로)

  // request 주체는 browser, response 대상도 browser 가 된다.

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
