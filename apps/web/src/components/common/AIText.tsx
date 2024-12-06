import { askAIForHelp } from "@/server/queries/ai";

const AIText = ({ prompt }: { prompt: string }) => {
  const text = askAIForHelp(prompt);
  return <div>{text}</div>;
};

export default AIText;
