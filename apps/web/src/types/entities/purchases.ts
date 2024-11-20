import type {
  Purchase,
  BankAccount,
  Supplier,
  PurchaseItem,
  Product,
} from "@repo/database";
import type { ExtendedBankAccountTransaction } from "./bank-account-transactions";

export type ExtendedPurchase = Purchase & {
  items: ExtendedPurchaseItem[];
  bankAccountTransactions: ExtendedBankAccountTransaction[];
  bankAccount: BankAccount | null;
  supplier: Supplier;
};

export type ExtendedPurchaseItem = PurchaseItem & {
  product: Product;
};

export type PurchaseListItem = {
  id: number;
  supplierName: string;
  createdAt: Date;
  bankAccountTransactions: ExtendedBankAccountTransaction[];
  subTotal: number;
  discount: number;
  total: number;
};
