export interface EducationItem {
  id: string;
  course: string;
  institute: string;
  board?: string;
  year: string;
  division?: string;
  percentage?: string;
  status: "Completed" | "Pursuing";
}

export interface ExperienceItem {
  id: string;
  company: string;
  designation: string;
  duration: string;
  description: string;
}

export interface SkillItem {
  id: string;
  name: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  organization: string;
  year: string;
}

export interface PersonalExtraField {
  id: string;
  label: string;
  value: string;
}

export interface PersonalDetails {
  photo: string;

  fullName: string;

  email: string;

  phone: string;

  alternatePhone: string;

  fatherName: string;

  motherName: string;

  spouseName: string;

  dob: string;

  languages: string;

  hobbies: string;

  correspondenceAddress: string;

  permanentAddress: string;

  sameAddress: boolean;

  extraFields: PersonalExtraField[];

}



export interface DeclarationData {
  enabled: boolean;
  type: "standard" | "professional" | "government" | "custom";
  place: string;
  date: string;
  text: string;
}

export interface ResumeData {
  template: "biodata" | "fresher" | "classic" | "modern";

  personal: PersonalDetails;

  objective: string;

  education: EducationItem[];

  experience: ExperienceItem[];

  skills: SkillItem[];

  certificates: CertificateItem[];

  declaration: DeclarationData;
}