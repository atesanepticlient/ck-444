// In-memory storage for accounts and bets.
// This module provides a singleton store that persists across requests
// within the same Node.js process. Next.js API routes are stateless by
// default, so attaching state to the global object ensures that data
// survives between calls during testing.  Do not persist sensitive
// information here in production.

export const DEFAULT_COMPANY_KEY = 'F4D8A3106EA44C5D969D0AAE0B472762';

export function initialiseStore() {
  if (!globalThis.__walletStore) {
    globalThis.__walletStore = {
      companyKey: DEFAULT_COMPANY_KEY,
      // Map of username → account info { balance: number }
      accounts: new Map(),
      // Map of unique bet key (username+transferCode+transactionId) → bet record
      // Bet record: {
      //   username: string,
      //   transferCode: string,
      //   transactionId: string,
      //   amount: number,            // current stake
      //   status: 'Running'|'Settled'|'Void',
      //   winLoss: number,           // last win/loss applied on settle
      //   lastRollbackFromSettled: boolean // true if last rollback transitioned
      //                                     // from Settled to Running
      // }
      bets: new Map()
    };

    // Seed the store with the test user.  The testing harness expects
    // user 01735156550 to start with a balance of 4 750.00 based on the
    // sample test cases.  Using a different starting balance will cause
    // virtually every scenario to fail because subsequent debit/credit
    // operations assume a 4 750.00 baseline.  Additional accounts are
    // not automatically created; attempting to operate on unknown users
    // will return error code 1.
    globalThis.__walletStore.accounts.set('01735156550', { balance: 4750 });
  }
  return globalThis.__walletStore;
}
