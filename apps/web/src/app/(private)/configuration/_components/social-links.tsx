import type { Company } from "@repo/database";

const SocialLinks = ({ company }: { company: Company }) => {
  return (
    <ul>
      {company.facebook ? (
        <li>
          <a
            href={company.facebook}
            style={{
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            Seguinos en Facebook
          </a>
        </li>
      ) : null}

      {company.instagram ? (
        <li>
          <a
            href={company.instagram}
            style={{
              fontSize: "16px",
              textDecoration: "none",
            }}
          >
            Seguinos en Instagram
          </a>
        </li>
      ) : null}
    </ul>
  );
};

export default SocialLinks;
