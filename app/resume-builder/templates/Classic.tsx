"use client";

import { ResumeData } from "../types/resume";
import type { PageSection } from "../auto-page-break/types";

type Props = {
    data: ResumeData;
    section?: string;
    pageSection?: PageSection;
    pageNumber?: number;
};

  export default function Classic({
    data,
    section,
    pageSection,
    pageNumber = 1,
}: Props) {

  const hasItem = (
    type: string,
    id?: string
  ) => {

    if (!pageSection) {
      return true;
    }

    return pageSection.items.some(
      (item) =>
        item.type === type &&
        (!id || item.dataId === id)
    );
  };

  const { personal } = data;

  /*
  |--------------------------------------------------------------------------
  | Common Styles
  |--------------------------------------------------------------------------
  */

  const thStyle = {
    border: "1px solid #555",
    padding: "8px",
    fontWeight: 700,
    textAlign: "center" as const,
    background: "#EAF2FF",
  };

  const tdStyle = {
    border: "1px solid #555",
    padding: "8px",
    textAlign: "center" as const,
  };

  const plabelStyle = {
  width: "220px",
  padding: "4px 8px",
  fontWeight: 700,
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const,
};

  const pvalueStyle = {
    width: "180px",
    padding: "4px 8px",
    textAlign: "left" as const,
  };

  /*
  |--------------------------------------------------------------------------
  | Helper Flags
  |--------------------------------------------------------------------------
  */

  const showHeader =
  pageNumber === 1 &&
  !section;

  const hasPersonalDetails =
    !!(
      personal.fatherName ||
      personal.motherName ||
      personal.spouseName ||
      personal.dob ||
      personal.languages ||
      personal.hobbies ||
      personal.correspondenceAddress||
      personal.permanentAddress
    );

  const hasOtherPersonalDetails =
    personal.extraFields.length > 0;

  const hasExperience = data.experience.some(
  (item) =>
    item.company ||
    item.designation ||
    item.duration ||
    item.description
    );

    const formatDate = (date?: string) => {
  if (!date) return "";

  const d = new Date(date);

  if (isNaN(d.getTime())) return date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

  /*
  |--------------------------------------------------------------------------
  | Section Heading
  |--------------------------------------------------------------------------
  */

  const SectionHeading = ({
    title,
  }: {
    title: string;
  }) => (
    <div
      data-heading
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "16px",
        marginBottom: "8px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "#163A70",
            color: "#fff",
            minWidth: "180px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: "15px",
            padding: "10px",
            borderTopLeftRadius: "12px",
            borderBottomLeftRadius: "12px",
          }}
        >
          {title}
        </div>

        <svg
          width="20"
          height="31"
          viewBox="0 0 20 30"
        >
          <polygon
            points="0,0 18,15 0,30"
            fill="#163A70"
          />
        </svg>
      </div>

      <div
        style={{
          flex: 1,
          height: "2px",
          background: "#163A70",
          position: "relative",
          marginRight: "10px",
          marginLeft: "-4px"
        }}
      >
        <span
          style={{
            position: "absolute",
            right: "-1px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            background: "#163A70",
          }}
        />
      </div>
    </div>
  );

  const renderHeader = () => (
 <div
  data-section="header"
  data-page-item
  data-splittable="false"
  style={{
  marginBottom: "10px",
  }}
>
  {/* Resume Heading */}
  <div
    style={{
      textAlign: "center",
      marginBottom: "10px",
    }}
  >
    <h1
      style={{
    fontSize: "32px",
    fontWeight: 600,
    color: "#163A70",
    letterSpacing: "1px",
    textAlign: "center",

    textDecoration: "underline",
    textUnderlineOffset: "6px",
    textDecorationThickness: "2px",
    }}
    >
      RESUME
    </h1>
        <div
        style={{
          width: "150px",
          height: "2px",
          background: "#163A70",
          margin: "-3px auto",
        }}
        />
    </div>

  {/* Header Content */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
    }}
  >
    {/* Left Side */}
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        minHeight: "150px",
        paddingLeft: "10px",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          color: "#163A70",
          fontWeight: 700,
          margin: 0,
          marginBottom: "6px",
        }}
      >
        {personal.fullName}
      </h2>

      {personal.phone && (
        <div style={{ fontSize: "14px", marginBottom: "6px" }}>
          {personal.phone}
        </div>
      )}

      {personal.email && (
        <div style={{ fontSize: "14px", marginBottom: "6px" }}>
          {personal.email}
        </div>
      )}

      {personal.correspondenceAddress && (
        <div style={{ fontSize: "14px" }}>
          {personal.correspondenceAddress}
        </div>
      )}
    </div>

    {/* Right Side */}
    {personal.photo && (
      <div
        style={{
          width: "120px",
          height: "150px",
          border: "2px solid #163A70",
          borderRadius: "8px",
          overflow: "hidden",
          background: "#fff",
          flexShrink: 0,
          marginLeft: "30px",
        }}
      >
        <img
          src={personal.photo}
          alt="Passport"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    )}
  </div>
</div>
  )
  
  const renderObjective = () => (
  <>
  {!pageSection?.isContinuation && (
    <SectionHeading title="CAREER OBJECTIVE" />
  )}
    <p
      data-page-item
      data-type="objective"
      style={{
        marginTop: "10px",
        fontSize: "14px",
        lineHeight: "24px",
        textAlign: "justify",
      }}
    >
      {data.objective}
    </p>
  </>
);

const educationItems = pageSection
  ? data.education.filter(item =>
      pageSection.items.some(
        i => i.dataId === item.id
      )
    )
  : data.education;

 const educationThStyle = {
  border: "1.5px solid #666",
  padding: "6px 8px",
  fontSize: "13px",
  fontWeight: 700,
  textAlign: "center" as const,
  lineHeight: "18px",
  height: "34px",
}; 

const educationTdStyle = {
  border: "1.5px solid #666",
  padding: "2px 6px",
  fontSize: "13px",
  height: "24px",
  lineHeight: "16px",
  verticalAlign: "middle" as const,
};
  
const renderEducation = () => (
  <>
    {!pageSection?.isContinuation && (
    <SectionHeading title="EDUCATION" />
    )}
      <table
      style={{
        width: "95%",
        borderCollapse: "collapse",
         margin: "8px auto 0",
        fontSize: "13px",
        tableLayout: "fixed",
      }}
    >
      <colgroup>
      <col style={{ width: "26%" }} />
      <col style={{ width: "35%" }} />
      <col style={{ width: "19%" }} />
      <col style={{ width: "12%" }} />
      <col style={{ width: "8%" }} />
      </colgroup>
      <thead>
        <tr style={{ background: "#EAF2FF" }}>
        <th style={educationThStyle}>Qualification</th>
        <th style={educationThStyle}>Board / University</th>
        <th style={educationThStyle}>Institute</th>
        <th style={educationThStyle}>Year</th>
        <th style={educationThStyle}>%</th>
          
        </tr>
      </thead>

      <tbody>
        {educationItems.map((item) => (
          <tr
            key={item.id}
            data-page-item
            data-id={item.id}
            data-type="education-row"
            data-splittable="true"
          >
          <td style={educationTdStyle}>{item.course}</td>
          <td style={educationTdStyle}>{item.board}</td>
          <td style={educationTdStyle}>{item.institute}</td>
          <td style={educationTdStyle}>{item.year}</td>
          <td style={educationTdStyle}>{item.percentage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

const experienceItems = pageSection
  ? data.experience.filter((exp) =>
      pageSection.items.some(
        (i) => i.dataId === exp.id
      )
    )
  : data.experience;

const renderExperience = () => {

  if (experienceItems.length === 0) {
    return null;
  }

  return (
    <>
      <SectionHeading title="EXPERIENCE" />

      <div
        style={{
          marginTop: "10px",
        }}
      >
        {experienceItems.map((item) => (
          <div
            key={item.id}
            data-page-item
            data-id={item.id}
            data-type="experience-item"
            data-splittable="true"
            style={{
              marginBottom: "8px",
              lineHeight: "22px",
              fontSize: "14px",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: "#163A70",
              }}
            >
              {item.designation}
            </div>

            <div>
              {item.company}
              {item.duration && ` | ${item.duration}`}
            </div>

            {item.description && (
              <div
                style={{
                  marginTop: "4px",
                }}
              >
                {item.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

const skillsItems = pageSection
  ? data.skills.filter(skill =>
      pageSection.items.some(
        i => i.dataId === skill.id
      )
    )
  : data.skills;

const hasSkills = skillsItems.length > 0;

const renderSkills = () => {

  if (!hasSkills) {
    return null;
  }

  return (
    <>
      {!pageSection?.isContinuation && (
        <SectionHeading title="SKILLS" />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginTop: pageSection?.isContinuation
            ? "0px"
            : "12px",
          fontSize: "14px",
        }}
      >
        {skillsItems.map((skill) => (
          <div
            key={skill.id}
            data-page-item
            data-id={skill.id}
            data-type="skill-item"
            data-splittable="true"
          >
            • {skill.name}
          </div>
        ))}
      </div>
    </>
  );
};
const certificateItems = pageSection
  ? data.certificates.filter(item =>
      pageSection.items.some(
        i => i.dataId === item.id
      )
    )
  : data.certificates;

const renderCertificates = () => {

  if (certificateItems.length === 0) {
    return null;
  }

  return (
    <>
      {!pageSection?.isContinuation && (
        <SectionHeading title="CERTIFICATES" />
      )}

      <div
        style={{
          marginTop: pageSection?.isContinuation
            ? "0px"
            : "12px",
          fontSize: "14px",
          lineHeight: "26px",
        }}
      >
        {certificateItems.map((item) => (
          <div
            key={item.id}
            data-page-item
            data-id={item.id}
            data-type="certificate-item"
            data-splittable="true"
          >
            • <strong>{item.title}</strong>

            {item.organization &&
              ` - ${item.organization}`}

            {item.year &&
              ` (${item.year})`}
          </div>
        ))}
      </div>
    </>
  );
};

const renderPersonalDetails = () => (
  <>
      {!pageSection?.isContinuation && (
      <SectionHeading title="PERSONAL DETAILS" />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: pageSection?.isContinuation
            ? "0px"
            : "6px",
        }}
      >
        <table
        style={{
          width: "420px",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      > 
      <tbody>

        {personal.fatherName &&
          hasItem("father-name") && (
          <tr
            data-page-item
            data-id="father-name"
            data-type="father-name"
            data-splittable="true"
          >
            <td style={plabelStyle}>Father's Name</td>
            <td style={pvalueStyle}>{personal.fatherName}</td>
          </tr>
        )}

        {personal.motherName &&
          hasItem("mother-name") && (
          <tr
            data-page-item
            data-id="mother-name"
            data-type="mother-name"
            data-splittable="true"
          >
            <td style={plabelStyle}>Mother's Name</td>
            <td style={pvalueStyle}>{personal.motherName}</td>
          </tr>
        )}

        {personal.spouseName &&
          hasItem("spouse-name") && (
          <tr
            data-page-item
            data-id="spouse-name"
            data-type="spouse-name"
            data-splittable="true"
          >
            <td style={plabelStyle}>Spouse Name</td>
            <td style={pvalueStyle}>{personal.spouseName}</td>
          </tr>
        )}

        {personal.dob &&
          hasItem("dob") && (
          <tr
            data-page-item
            data-id="dob"
            data-type="dob"
            data-splittable="true"
          >
            <td style={plabelStyle}>Date of Birth</td>
            <td style={pvalueStyle}>{formatDate(personal.dob)}</td>
          </tr>
        )}

        {personal.languages &&
          hasItem("languages") && (
          <tr
            data-page-item
            data-id="languages"
            data-type="languages"
            data-splittable="true"
          >
            <td style={plabelStyle}>Languages</td>
            <td style={pvalueStyle}>{personal.languages}</td>
          </tr>
        )}

        {personal.hobbies &&
          hasItem("hobbies") && (
          <tr
            data-page-item
            data-id="hobbies"
            data-type="hobbies"
            data-splittable="true"
          >
            <td style={plabelStyle}>Hobbies</td>
            <td style={pvalueStyle}>{personal.hobbies}</td>
          </tr>
        )}

        {personal.permanentAddress &&
          hasItem("address") && (
          <tr
            data-page-item
            data-id="address"
            data-type="address"
            data-splittable="true"
          >
            <td style={plabelStyle}>Address</td>
            <td style={pvalueStyle}>{personal.permanentAddress}</td>
          </tr>
        )}

      </tbody>
    </table>
    </div>
  </>
);

const otherPersonalItems = pageSection
  ? personal.extraFields.filter(item =>
      pageSection.items.some(
        i => i.dataId === item.id
      )
    )
  : personal.extraFields;

const renderOtherPersonalDetails = () => {

  if (otherPersonalItems.length === 0) {
    return null;
  }

  return (
    <>
      {!pageSection?.isContinuation && (
        <SectionHeading title="OTHER PERSONAL DETAILS" />
      )}

      <table
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
          marginTop: pageSection?.isContinuation
            ? "0px"
            : "10px",
          fontSize: "14px",
        }}
      >
        <tbody>
          {otherPersonalItems.map((item) => (
            <tr
              key={item.id}
              data-page-item
              data-id={item.id}
              data-type="other-personal-detail"
              data-splittable="true"
            >
              <td style={plabelStyle}>
                {item.label}
              </td>

              <td style={pvalueStyle}>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const declarationItems =
pageSection
? pageSection.items.filter(
    item =>
      item.section === "declaration"
  )
: [
    {
      type: "declaration"
    },
    {
      type: "place"
    },
    {
      type: "date"
    },
    {
      type: "signature"
    },
  ];

    console.log(
    "Declaration Items",
    declarationItems
  );
  const renderDeclaration = () => (
  <>
    {!pageSection?.isContinuation && (
      <SectionHeading title="DECLARATION" />
    )}

        {declarationItems.some(
      item => item.type === "declaration"
    ) && (
      <p
        data-page-item
        data-id="declaration"
        data-type="declaration"
        style={{
          marginTop: "10px",
          fontSize: "14px",
          lineHeight: "24px",
          textAlign: "justify",
        }}
      >  {data.declaration.text}
      </p>
    )}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: "50px",
      }}
    >
      <div>

        {declarationItems.some(
        item => item.type === "place"
      ) && (
        <div
          data-page-item
          data-id="place"
          data-type="place"
        >
          <strong>Place :</strong>
          {data.declaration.place}
        </div>
      )}

         {declarationItems.some(
        item => item.type === "date"
      ) && (
        <div
          data-page-item
          data-id="date"
          data-type="date"
          style={{
            marginTop: "8px",
          }}
        >
          <strong>Date :</strong>
          {data.declaration.date}
        </div>
      )}
      </div>

          {declarationItems.some(
        item => item.type === "signature"
      ) && (
        <div
          data-page-item
          data-id="signature"
          data-type="signature"
          style={{
            width: "180px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              height: "50px",
            }}
          />

          <div
            style={{
              borderTop: "1px solid #000",
              paddingTop: "6px",
            }}
          >
            {personal.fullName}
          </div>
        </div>
      )}
    </div>
  </>
);

  const sectionMap = {
  header: renderHeader,
  objective: renderObjective,
  education: renderEducation,
  experience: renderExperience,
  skills: renderSkills,
  certificates: renderCertificates,
  "personal-details": renderPersonalDetails,
  "other-personal-details": renderOtherPersonalDetails,
  declaration: renderDeclaration,
};

   return (

    <div
    id="resume-content"
    style={{
    width: "100%",
    
    background:"#fff",
    position:"relative",
    boxSizing:"border-box",
    overflow:"visible",
                   
    }}
    >
  {section ? (
  sectionMap[section as keyof typeof sectionMap]?.() ?? null
  ) : (
  <>

    {showHeader && renderHeader()}  

     
      {/* ---------- PART-2 ---------- */}

    {/* Career Objective */}
 

    <div
      data-section="objective"
      data-splittable="false"
    >
      {(!section || section === "objective") &&
        renderObjective()}
    </div>

    {/* Education */}

    <div
      data-section="education"
      data-splittable="true"
    >
      {(!section || section === "education") &&
        renderEducation()}
    </div>

    {/* Experience */}

    <div
    data-section="experience"
    data-splittable="true"
  >
    {(!section || section === "experience") &&
      hasExperience &&
      renderExperience()}
      
    </div>

{/* Skills */}

  <div
    data-section="skills"
    data-splittable="true"
  >
    {(!section || section === "skills") &&
      data.skills.length > 0 &&
      renderSkills()}
  </div>

    {/* Certificates */}

<div
  data-section="certificates"
  data-splittable="true"
>
  {(!section || section === "certificates") &&
    data.certificates.length > 0 &&
    renderCertificates()}
</div>

  {/* Personal-Details */}

      
  <div
    data-section="personal-details"
    data-splittable="true"
  >
    {(!section || section === "personal-details") &&
      hasPersonalDetails &&
      renderPersonalDetails()}
  </div>

      {/* Other-Personal-Details */}


 <div
  data-section="other-personal-details"
  data-splittable="true"
>
  {(!section ||
    section === "other-personal-details") &&
    hasOtherPersonalDetails &&
    renderOtherPersonalDetails()}
  </div>       

     {/* declaration */}

   <div
  data-section="declaration"
  data-splittable="false"
>
  {(!section ||
    section === "declaration") &&
    renderDeclaration()}
</div>
 </>
  )}
</div>
);
}