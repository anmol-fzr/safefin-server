import { BetterAuthOptions } from 'better-auth';
import { phoneNumber, admin, openAPI } from "better-auth/plugins"
import { expo } from "@better-auth/expo"

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  /**
   * The name of the application.
   */
  appName: 'Server',
  // .... More options
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    changeEmail: {
      enabled: true,
    }
  },
  plugins: [
    expo(),
    openAPI(),
    admin(),
    phoneNumber({
      allowedAttempts: 3,
      sendOTP: ({ phoneNumber, code }) => {
        console.info({ phoneNumber, code })
      },
      signUpOnVerification: {
        getTempEmail: (phoneNumber) => phoneNumber,
        getTempName: (phoneNumber) => phoneNumber
      }
    })
  ],
  trustedOrigins: [
    "safefin://*",
    "http://192.168.29.57:5173",
    "http://192.168.29.57:5173/",
  ]
};
