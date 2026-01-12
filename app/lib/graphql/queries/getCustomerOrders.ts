import { gql } from "graphql-request";
import { getAuthClient } from "../client";

const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($email: String!, $first: Int = 10, $after: String) {
    orders(where: { billingEmail: $email }, first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        date
        status
        total
      }
    }
  }
`;

export async function getCustomerOrders(
  token: string,
  email: string,
  first = 10,
  after?: string
) {
  const client = getAuthClient(token);

  const { orders } = await client.request(GET_CUSTOMER_ORDERS, {
    email,
    first,
    after,
  });

  return orders;
}
