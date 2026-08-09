import { notFound } from "next/navigation";
import CoverPageEditor from "../../components/CoverPageEditor";
import { TEMPLATE_REGISTRY } from "../../data/templateList";

export async function generateStaticParams() {
  return [
    { templateId: "blank-cover" },
    ...TEMPLATE_REGISTRY.map((template) => ({ templateId: template.id })),
  ];
}

export default async function CoverPageEditorRoute({ params }: PageProps<"/cover-page-generator/editor/[templateId]">) {
  const { templateId } = await params;
  const isKnownTemplate = templateId === "blank-cover" || TEMPLATE_REGISTRY.some((template) => template.id === templateId);

  if (!isKnownTemplate) notFound();

  return <CoverPageEditor templateId={templateId} />;
}
