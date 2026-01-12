import { gql } from "graphql-request";
import { getAuthClient } from "../client";

const GET_ORDER = gql`
  query GetOrder($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      orderNumber
      date
      status
      total
      subtotal
      shippingTotal
      paymentMethodTitle
      customerNote
      lineItems {
        nodes {
          product {
            node {
              date
              name
            }
          }
          quantity
          total
          metaData {
            key
            value
          }
        }
      }
      billing {
        firstName
        lastName
        address1
        city
        state
        postcode
        phone
        email
      }
      shipping {
        address1
        address2
        city
        company
        country
        firstName
        lastName
        phone
        state
        postcode
        email
      }
    }
  }
`;

export async function getOrder(token: string, id: string) {
  const client = getAuthClient(token);

  const order = await client.request(GET_ORDER, { id });

  return order;
}
