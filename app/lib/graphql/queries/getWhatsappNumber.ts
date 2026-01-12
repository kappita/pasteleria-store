import { gql } from "graphql-request";
import { client } from "../client";

const WHATSAPP_NUMBER = gql`
  {
    whatsappNumber
  }
`;

export async function getWhatsappNumber() {
  try {
    const { whatsappNumber } = await client.request(WHATSAPP_NUMBER);
    return whatsappNumber;
  } catch (err) {
    throw err;
  }
}
