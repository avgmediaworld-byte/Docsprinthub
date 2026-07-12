import Classic from "./Classic";
import { ResumeData } from "../types/resume";

type Props = {
  data: ResumeData;
};

export default function fresher({ data }: Props) {
  return <Classic data={data} />;
}