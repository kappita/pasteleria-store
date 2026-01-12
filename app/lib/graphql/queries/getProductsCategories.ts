import { gql } from "graphql-request";
import { client } from "../client";

const CATEGORIES = gql`
  {
    productCategories {
      nodes {
        name
        id
      }
    }
  }
`;

export async function getProductsCategories() {
  try {
    const { productCategories } = await client.request(CATEGORIES);
    return productCategories.nodes;
  } catch (err) {
    throw err;
  }
}
