import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    /** @see https://nextjs.org/docs/app/api-reference/functions/next-response#next */
    // Create an unmodified response

    // response.request.headers 에 아래 필드가 추가된다.
    // headers: {
    //   "x-middleware-override-headers": "accept,accept-encoding,accept-language,cache-control,connection,cookie,host,referer,sec-ch-ua,sec-ch-ua-mobile,sec-ch-ua-platform,sec-fetch-dest,sec-fetch-mode,sec-fetch-site,sec-fetch-user,upgrade-insecure-requests,user-agent,x-forwarded-for,x-forwarded-host,x-forwarded-port,x-forwarded-proto",
    //   "x-middleware-request-accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    //   "x-middleware-request-accept-encoding": "gzip, deflate, br, zstd",
    //   "x-middleware-request-accept-language": "en-US,en;q=0.9,ko;q=0.8",
    //   "x-middleware-request-cache-control": "max-age=0",
    //   "x-middleware-request-connection": "keep-alive",
    //   "x-middleware-request-cookie": "sb-kcqstxacrcuarmpmyeta-auth-token-code-verifier=\"%22480d92fc373b4ab8f3f244a9a8ed0042590fe64c20217a87e2208c59fd4438ad3f1b45fcd4a43b7daf466d0a46d7a0ca6e01c794ecbd9e54%22",
    //   "x-middleware-request-host": "localhost:3000",
    //   "x-middleware-request-referer": "http://localhost:3000/login",
    //   "x-middleware-request-sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    //   "x-middleware-request-sec-ch-ua-mobile": "?0",
    //   "x-middleware-request-sec-ch-ua-platform": "\"macOS\"",
    //   "x-middleware-request-sec-fetch-dest": "document",
    //   "x-middleware-request-sec-fetch-mode": "navigate",
    //   "x-middleware-request-sec-fetch-site": "same-origin",
    //   "x-middleware-request-sec-fetch-user": "?1",
    //   "x-middleware-request-upgrade-insecure-requests": "1",
    //   "x-middleware-request-user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    //   "x-middleware-request-x-forwarded-for": "::1",
    //   "x-middleware-request-x-forwarded-host": "localhost:3000",
    //   "x-middleware-request-x-forwarded-port": "3000",
    //   "x-middleware-request-x-forwarded-proto": "http"
    // }
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // If the cookie is updated, update the cookies for the request and response
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            // If the cookie is removed, update the cookies for the request and response
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs

    // 인증 토큰의 유효성을 재확인한다.
    // supabase.auth.getSession() 은 유효성을 확인하지않음.
    await supabase.auth.getUser();

    // Browser response
    // Test
    // response.headers.set("set-header-test", "hello");
    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
