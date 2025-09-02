// Common helper functions shared by multiple API routes.  Placing
// reusable logic in this module helps keep the individual route
// handlers concise and consistent.

import { initialiseStore } from './_store.js';

/**
 * Format a numeric balance to a string with exactly two decimal
 * places.  Always uses a fixed number of digits even for integer
 * values (e.g. 10 becomes "10.00").
 *
 * @param {number} value The numeric balance.
 * @returns {string}
 */
export function formatBalance(value) {
  // Ensure value is a finite number.  If not, default to 0.
  const num = Number(value);
  if (!Number.isFinite(num)) return '0.00';
  return num.toFixed(2);
}

/**
 * Return the account object for a username.  If the user does not
 * exist in the store and the `createIfMissing` flag is true, a new
 * account with zero balance will be created.  Otherwise returns
 * undefined.
 *
 * @param {string} username
 * @param {boolean} [createIfMissing=false]
 * @returns {{ balance: number }|undefined}
 */
export function getAccount(username, createIfMissing = false) {
  const store = initialiseStore();
  const accounts = store.accounts;
  if (accounts.has(username)) {
    return accounts.get(username);
  }
  if (createIfMissing) {
    const acct = { balance: 0 };
    accounts.set(username, acct);
    return acct;
  }
  return undefined;
}

/**
 * Compose a unique key for a bet based on username, transferCode and
 * transactionId.  Using all three fields ensures bets are tracked
 * correctly even in product types where the same transfer code may
 * appear with different transaction IDs.
 *
 * @param {string} username
 * @param {string} transferCode
 * @param {string|number|undefined} transactionId
 */
export function makeBetKey(username, transferCode, transactionId) {
  return `${username}|${transferCode}|${transactionId ?? ''}`;
}

/**
 * Find an existing bet by username and transferCode.  This helper
 * searches across all transaction IDs for the given transfer code.
 * Returns the bet record if exactly one match is found.  If more
 * than one match exists (which should only happen for 3rd Wan Mei
 * product types), the first match is returned.  If none are found
 * then undefined is returned.
 *
 * @param {string} username
 * @param {string} transferCode
 */
export function findBetByTransferCode(username, transferCode) {
  const store = initialiseStore();
  for (const bet of store.bets.values()) {
    if (bet.username === username && bet.transferCode === transferCode) {
      return bet;
    }
  }
  return undefined;
}
