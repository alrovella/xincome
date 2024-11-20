import type {
  Company,
  CompanyOptions,
  CompanyPlan,
  PaymentMethod,
  Schedule,
  Service,
} from "@repo/database";

export type ExtendedCompany = Company & {
  services: Service[];
  options: CompanyOptions | null;
  schedules: Schedule[];
  companyPlan: CompanyPlan | null;
};

export type ExtendedCompanyForWeb = ExtendedCompany & {
  paymentMethods: PaymentMethod[];
};
