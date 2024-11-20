import type {
  Customer,
  Product,
  ProductSize,
  Sale,
  SaleItem,
} from "@repo/database";
import type { ExtendedBankAccountTransaction } from "./bank-account-transactions";

export type ExtendedSale = Sale & {
  items: ExtendedSaleItem[];
  bankAccountTransactions: ExtendedBankAccountTransaction[];
  customer: Customer;
};

export type ExtendedSaleItem = SaleItem & {
  product: Product;
  productSize?: ProductSize | null;
};

export type SaleListItem = {
  id: number;
  customerName: string;
  isReseller: boolean;
  createdAt: Date;
  total: number;
  bankAccountName?: string;
  isCancelled: boolean;
};
