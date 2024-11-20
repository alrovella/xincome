import { BankAccountTransaction, BankAccount } from "@repo/database";

export type ExtendedBankAccountTransaction = BankAccountTransaction & {
  bankAccount: BankAccount;
};
