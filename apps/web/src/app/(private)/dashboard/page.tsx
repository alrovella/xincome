import TransactionsSummaryCard from "@/app/(private)/dashboard/_components/transactions-summary-card";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import CustomerBirthdaysCard from "./_components/customer-birthdays-card";
import FrequentCustomersCard from "./_components/frequent-customers-card";

export default async function Page() {
  return (
    <>
      <div className="gap-4 grid lg:grid-cols-5 mb-4">
        <TransactionsSummaryCard
          fromDate={startOfMonth(addMonths(new Date(), -1))}
          toDate={endOfMonth(addMonths(new Date(), -1))}
        />
        <TransactionsSummaryCard
          fromDate={startOfMonth(new Date())}
          toDate={endOfMonth(new Date())}
        />
        <CustomerBirthdaysCard />
      </div>
      <FrequentCustomersCard />
    </>
  );
}
