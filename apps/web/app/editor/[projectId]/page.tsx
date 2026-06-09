import EditorShell from "@/components/editor/EditorShell";

type EditorPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params;

  return <EditorShell projectId={projectId} />;
}
