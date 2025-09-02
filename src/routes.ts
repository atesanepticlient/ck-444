/**
 * all about auth routes
 * for only unauthorized users
 * @type {string[]}
 */
export const authRoutes = ["/register", "/login", "/forget-password"];

/**
 * public routes
 * can be access without login or with login
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/slots",
  "/card-x",
  "/pocker",
  "/roulette",
  "/favorites",
  "/table",
  "/fish",
  "/live-sports",
  "/lottery",
  "/api/asiaapi",
  "/api/open-game",
  "/api/newprovider",
  "/api/game/32328e87f8592ed205bbaa065dbacce4",
  "/api/e86256b2787ee7ff0c33d0d4c6159cd922227b79/deposit",
  "/api/e86256b2787ee7ff0c33d0d4c6159cd922227b79/withdraw",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/GetBalance",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/Cancel",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/Deduct",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/Bonus",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/GetBetStatus",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/Rollback",
  "/api/c3433e25424b9af0ad76cdaf667787ae59752b15/Settle",
  "/live-casino",
  "/promotion",
  "/hot",
  "/api/apay/deposit",
  "/api/apay/withdraw",
  "/api/getBalance",
  "/api/Deduct",
  "/api/Settle",
  "/api/Rollback",
  "/api/Cancel",
  "/api/Bonus",
  "/api/GetBetStatus",
  "/getBalance",
];

/**
 * The prefix for api authentication routes
 * @type {string}
 */
export const apiAuthRoutePrefix = "/api";

/**
 * The prefix for provider api endpoints
 * @type {string}
 */
export const providerApiPrefix = "/api/provider";
