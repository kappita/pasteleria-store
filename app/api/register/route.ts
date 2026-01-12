import { NextResponse } from "next/server";
import { gql } from "graphql-request";
import { client } from "@/app/lib/graphql/client";

export async function POST(req: Request) {
  const REGISTER_USER = gql`
    mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) {
        user {
          id
          name
          email
        }
      }
    }
  `;

  // Para enviar correo de restablecimiento de contraseña
  const SEND_PASSWORD_EMAIL = gql`
    mutation SendPasswordReset($input: SendPasswordResetEmailInput!) {
      sendPasswordResetEmail(input: $input) {
        user {
          username
        }
      }
    }
  `;

  try {
    const { username, email, firstName, lastName } = await req.json();
    const variables = {
      input: {
        username,
        email,
        firstName,
        lastName,
      },
    };
    const { registerUser } = await client.request(REGISTER_USER, variables);
    const user = registerUser.user;

    const emailVariables = {
      input: { username: user.name },
    };

    await client.request(SEND_PASSWORD_EMAIL, emailVariables);

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    const raw = err.response?.errors?.[0]?.message;
    const msg = cleanMessage(raw);

    return NextResponse.json({ message: msg }, { status: 400 });
  }
}

function cleanMessage(rawMessage: string): string {
  if (!rawMessage) return "Error al registrar usuario.";

  const decoded = rawMessage
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return decoded
    .replace(/<[^>]+>/g, "")
    .replace(/^[\s\n\r]*Error:\s*/i, "")
    .trim();
}
