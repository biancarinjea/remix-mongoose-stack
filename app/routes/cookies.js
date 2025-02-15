import { createCookie } from "@remix-run/node";

export const sessionCookie = createCookie("__session", {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  secrets: [process.env.COOKIE_SECRET],
});
