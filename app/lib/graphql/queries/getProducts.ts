import { getAuthClient } from "../client";
import { getViewer } from "./getViewer";

export async function updateUser(
  token: string,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  }
) {
  const query = `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
        user {
          id
          name
          email
        }
      }
    }
  `;

  // Filtra solo los campos no vacíos
  const input: Record<string, string> = {};
  if (data.email) input.email = data.email;
  if (data.firstName) input.firstName = data.firstName;
  if (data.lastName) input.lastName = data.lastName;
  if (data.password) input.password = data.password;

  const viewer = await getViewer(token);
  input.id = viewer?.id || "";

  if (Object.keys(input).length === 0) {
    throw new Error("Debe enviar al menos un campo para actualizar.");
  }

  const client = getAuthClient(token);
  try {
    const { res } = await client.request(query, { input });
    return res;
  } catch (err) {
    throw err;
  }
}
