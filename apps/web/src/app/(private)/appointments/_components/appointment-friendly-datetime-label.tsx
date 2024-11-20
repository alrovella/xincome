import { formatFriendlyDateTime } from "@/util/formatters";

interface AppointmentFriendlyDatetimeLabelProps
  extends React.ComponentProps<"span"> {
  datetime: Date;
}

const AppointmentFriendlyDatetimeLabel = ({
  datetime,
  ...props
}: AppointmentFriendlyDatetimeLabelProps) => {
  return <span {...props}>{formatFriendlyDateTime(datetime)}</span>;
};

export default AppointmentFriendlyDatetimeLabel;
