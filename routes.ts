/**
 * Public routes that do not require authentication.
 *
 * @constant {string[]}
 */
export const publicRoutes = [
  "/",
  "/neuralace",
  "/neuralace/mobile",
  "/neuralace/attendance",
  "/privacy-policy",
  "/terms",
  "/neuralace/tech-sheet",
  "/neuralace/candidate-sessions",
  "/api/sheet",
  "/api/candidate-sessions",
  "/api/googlesheet",
  "/api/tech-sheet",
  "/neuralace/roaster",
];

/**
 * Routes for authentication.
 *
 * @constant {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/signup"];

/**
 * Prefix for authentication-related API routes.
 *
 * @constant {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default URL to which users are redirected after a successful login.
 *
 * @constant {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
