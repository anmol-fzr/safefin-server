import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/config/db";
import { phoneNumber } from "better-auth/plugins"
import { expo } from "@better-auth/expo"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    expo(),
    phoneNumber({
      sendOTP: ({ phoneNumber, code }, request) => {
        console.log({ phoneNumber, code })
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => phoneNumber
      }
    })
  ],
  trustedOrigins: [
    "safefin://",
    "safefin://*",
  ]
});
