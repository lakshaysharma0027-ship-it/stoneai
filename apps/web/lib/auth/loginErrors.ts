export const LOGIN_ERROR_CODES = {
  oauthDenied: "oauth_denied",
  oauthFailed: "oauth_failed",
  sessionFailed: "session_failed",
} as const;

export type LoginErrorCode = (typeof LOGIN_ERROR_CODES)[keyof typeof LOGIN_ERROR_CODES];

const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, string> = {
  oauth_denied: "Google sign-in was cancelled or denied. Try again or use email and password.",
  oauth_failed: "Google sign-in failed. Try again or use email and password.",
  session_failed: "Could not complete sign-in. Try again.",
};

export function resolveLoginErrorMessage(code: string | null): string | null {
  if (!code) return null;
  if (code in LOGIN_ERROR_MESSAGES) {
    return LOGIN_ERROR_MESSAGES[code as LoginErrorCode];
  }
  return LOGIN_ERROR_MESSAGES.oauth_failed;
}

export function oauthErrorCode(oauthError: string): LoginErrorCode {
  if (oauthError === "access_denied") return LOGIN_ERROR_CODES.oauthDenied;
  return LOGIN_ERROR_CODES.oauthFailed;
}
