import Classic from "./Classic";
import { ResumeData } from "../types/resume";

type Props = {
  data: ResumeData;
};

export default function Biodata({ data }: Props) {
  return <Classic data={data} />;
}