import { NextResponse } from "next/server";
import { updateUser } from "@/app/lib/graphql/mutations/updateUser";
import { cookies } from "next/headers";
import { gql } from "graphql-request";
import { client } from "@/app/lib/graphql/client";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
    }
  }
`;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  try {
    const { email, username, firstName, lastName, password, newPass } =
      await req.json();

    // En caso de estar la contraseña actual y nueva, verificarla
    if (password && newPass) {
      try {
        await client.request(LOGIN, { username, password });
      } catch (err) {
        return NextResponse.json(
          { message: "Contraseña actual incorrecta" },
          { status: 400 }
        );
      }
    }

    // actualizar usuario
    const data = {
      email: email || undefined,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      password: newPass || undefined,
    };

    const user = await updateUser(token, data);

    return NextResponse.json({ user });
  } catch (err: any) {
    const raw = err.response?.errors?.[0]?.message;
    const msg = cleanMessage(raw);

    return NextResponse.json({ message: msg }, { status: 400 });
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
}
