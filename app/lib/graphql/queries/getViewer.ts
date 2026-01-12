import { gql } from "graphql-request";
import { getAuthClient } from "../client";

const VIEWER = gql`
  query Viewer {
    viewer {
      id
      firstName
      lastName
      email
      username
    }
  }
`;

export async function getViewer(token: string) {
  if (!token) return null;
  const client = getAuthClient(token);

  try {
    const { viewer } = await client.request(VIEWER);
    return viewer;
  } catch (err) {
    throw err;
  }
}
