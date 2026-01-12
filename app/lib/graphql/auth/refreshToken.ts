import { gql } from "graphql-request";
import { client } from "../client";

const REFRESH_TOKEN = gql`
  mutation RefreshToken($jwtRefreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $jwtRefreshToken }) {
      authToken
    }
  }
`;

export async function refreshAccessToken(refreshToken: string) {
  try {
    const { refreshJwtAuthToken } = await client.request(REFRESH_TOKEN, {
      jwtRefreshToken: refreshToken,
    });
    return refreshJwtAuthToken;
  } catch (err: any) {
    const wpError = err.response?.errors?.[0]?.message || "";

    // Si el refreshToken ya venció o es inválido
    if (
      wpError.toLowerCase().includes("expired") ||
      wpError.toLowerCase().includes("invalid")
    ) {
      throw new Error("REFRESH_TOKEN_EXPIRED");
    }

    console.error("Error técnico al refrescar:", err);
    throw new Error("SERVER_ERROR");
  }
}
