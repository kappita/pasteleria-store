import { gql } from "graphql-request";
import { client } from "../client";

const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;

export async function login(username: string, password: string) {
  try {
    const { login } = await client.request(LOGIN, { username, password });
    return login;
  } catch (err: any) {
    // graphql-request guarda los errores de WP en err.response.errors
    const wpError = err.response?.errors?.[0]?.message || "";

    // WordPress suele devolver "invalid_username" o "incorrect_password"
    if (
      wpError.includes("invalid") ||
      wpError.includes("incorrect") ||
      wpError.includes("empty")
    ) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Verificación de correo no realizada
    if (wpError.includes("email_not_verified")) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    // Si no es un error de credenciales, es un error técnico (WP caído, etc.)
    console.error("Detalle del error técnico:", err);
    throw new Error("SERVER_ERROR");
  }
}
