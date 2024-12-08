import { Container } from "@repo/ui/components/ui/container";
import ScheduleTable from "./_components/schedule-table";
import AddScheduleButton from "./_components/add-schedule-button";

export default function Page() {
  return (
    <Container title="Agendas" headerChildren={<AddScheduleButton />}>
      <ScheduleTable />
    </Container>
  );
}
