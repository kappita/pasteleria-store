import { getAuthClient } from "../client";

export async function addToCart(
  token: string,
  data: {
    productId: string;
    variationId?: string;
    quantity: number;
  }
) {
  const query = `
    mutation AddToCart($input: AddToCartInput!) {
        addToCart(input: $input) {
            cartItem {
                key
            }
        }
    }   
  `;

  const client = getAuthClient(token);
  try {
    const { res } = await client.request(query, { input: data });
    return res;
  } catch (err) {
    throw err;
  }
}
