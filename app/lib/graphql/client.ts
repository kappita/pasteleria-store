import { GraphQLClient } from "graphql-request";

const endpoint = process.env.WORDPRESS_URL! + "/graphql";

// Cliente sin autorización
export const client = new GraphQLClient(endpoint, {
  headers: {
    "Content-Type": "application/json",
  },
});

// Cliente con autorización
export function getAuthClient(token: string) {
  return new GraphQLClient(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}
