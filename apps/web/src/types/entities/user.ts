import type {
  Company,
  CompanyOptions,
  CompanyPlan,
  Schedule,
  Service,
} from "@repo/database";

export type LoggedUser = {
  firstName: string | null;
  lastName: string | null;
  id: string;
  email: string;
  clerkId: string;
  createdAt: Date;
  company: LoggedCompany;
};

export type LoggedCompany = Company & {
  services: Service[];
  options?: CompanyOptions | null;
  companyPlan: CompanyPlan;
  schedules: Schedule[];
};
