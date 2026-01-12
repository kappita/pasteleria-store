import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "./app/lib/graphql/auth/refreshToken";

export async function proxy(req: NextRequest) {
  const cookiesStore = await cookies();
  let token = cookiesStore.get("authToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  // VARIABLE PARA LA RESPUESTA
  let response = NextResponse.next();

  // INTENTO DE REFRESCO (Si falta el token pero hay llave maestra)
  if (!token && refreshToken) {
    try {
      const data = await refreshAccessToken(refreshToken);
      token = data.authToken;

      // Seteamos las nuevas cookies
      response.cookies.set("authToken", data.authToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 15, // 15 min
      });
    } catch (error) {
      // Si falla el refresco (ej. refreshToken vencido)
      response.cookies.delete("authToken");
      response.cookies.delete("refreshToken");
      token = undefined; // Forzamos que la validación de abajo falle
    }
  }

  // VALIDACIÓN DE RUTAS PROTEGIDAS
  const protectedRoutes = ["/my-account"];
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
