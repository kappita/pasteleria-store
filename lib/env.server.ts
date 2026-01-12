import "server-only";

export const MP_ACCESS_TOKEN = (() => {
  const token = process.env.MP_ACCESS_TOKEN;

  if (!token) {
    throw new Error("❌ MP_ACCESS_TOKEN no está definido");
  }

  return token;
})();

export const MP_WEBHOOK_SECRET = (() => {
  const secret = process.env.MP_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("❌ MP_WEBHOOK_SECRET no está definido");
  }

  return secret;
})();
