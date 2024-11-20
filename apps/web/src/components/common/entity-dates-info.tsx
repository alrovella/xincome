import AppointmentFriendlyDatetimeLabel from "@/app/(private)/appointments/_components/appointment-friendly-datetime-label";

const EntityDatesInfo = ({
  createdAt,
  updatedAt,
}: {
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      {createdAt && (
        <small>
          Creado: <AppointmentFriendlyDatetimeLabel datetime={createdAt} />
        </small>
      )}
      {updatedAt && (
        <small>
          Ultima Actualización:{" "}
          <AppointmentFriendlyDatetimeLabel datetime={updatedAt} />
        </small>
      )}
    </div>
  );
};

export default EntityDatesInfo;
