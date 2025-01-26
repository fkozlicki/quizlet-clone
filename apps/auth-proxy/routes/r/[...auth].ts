import { Auth } from "@auth/core";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import Nodemailer from "@auth/core/providers/nodemailer";
import { eventHandler, toWebRequest } from "h3";

export default eventHandler(async (event) =>
  Auth(toWebRequest(event), {
    basePath: "/r",
    secret: process.env.AUTH_SECRET,
    trustHost: !!process.env.VERCEL,
    redirectProxyUrl: process.env.AUTH_REDIRECT_PROXY_URL,
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
      Nodemailer({
        server: process.env.AUTH_EMAIL_SERVER,
        from: process.env.AUTH_EMAIL_FROM,
      }),
    ],
  }),
);
