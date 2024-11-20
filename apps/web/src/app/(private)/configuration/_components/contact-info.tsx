import type { Company } from "@repo/database";

const ContactInfo = ({ company }: { company: Company }) => {
  return (
    <ul>
      <li
        style={{
          fontSize: "16px",
          textDecoration: "none",
        }}
      >
        Email: <a href={`mailto:${company.email}`}>{company.email}</a>
      </li>
      <li
        style={{
          fontSize: "16px",
          textDecoration: "none",
        }}
      >
        Teléfono:{" "}
        <a href={`tel:${company.phoneNumber}`}>{company.phoneNumber}</a>
      </li>
    </ul>
  );
};

export default ContactInfo;
