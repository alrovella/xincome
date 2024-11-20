import { Customer, Sale } from "@repo/database";

export type SuggestedCustomer = Customer & {
  id: string | undefined;
  name: string;
  sales?: Sale[];
};

export type RequentCustomer = {
  name: string;
  id: string;
  _count: {
    appointments: number;
    company: number;
  };
};
