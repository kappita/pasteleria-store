import { NextResponse } from "next/server";
import { login } from "@/app/lib/graphql/auth/login";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const { authToken, refreshToken, user } = await login(username, password);

    if (!authToken || !refreshToken) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    // Guardamos el authToken (token de acceso)
    cookieStore.set("authToken", authToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 300, // 5 min
    });

    // Guardamos el refreshToken (la llave maestra para renovar)
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return NextResponse.json({ user });
  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos." },
        { status: 401 } // No autorizado
      );
    }

    // Verificación de correo no realizada
    if (err.message === "EMAIL_NOT_VERIFIED") {
      return NextResponse.json(
        { message: "Debes confirmar tu correo antes de iniciar sesión." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Hubo un problema con el servidor. Intenta más tarde." },
      { status: 500 } // Error de servidor
    );
  }
}
