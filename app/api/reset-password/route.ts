import { NextResponse } from "next/server";
import { gql } from "graphql-request";
import { client } from "@/app/lib/graphql/client";

export async function POST(req: Request) {
  const RESET_MUTATION = gql`
    mutation ResetUserPassword($input: ResetUserPasswordInput!) {
      resetUserPassword(input: $input) {
        user {
          username
          email
        }
      }
    }
  `;

  try {
    const { key, login, password } = await req.json();

    if (!key || !login || !password) {
      return NextResponse.json(
        { message: "Faltan datos requeridos." },
        { status: 400 }
      );
    }

    const variables = {
      input: { key, login, password },
    };

    const data = await client.request(RESET_MUTATION, variables);

    return NextResponse.json({
      success: true,
      user: data.resetUserPassword.user,
    });
  } catch (err: any) {
    // Extraemos el mensaje de error de WordPress si existe
    const raw =
      err.response?.errors?.[0]?.message ||
      "Error al restablecer la contraseña.";
    console.log(err);
    return NextResponse.json({ message: raw }, { status: 400 });
  }
}
