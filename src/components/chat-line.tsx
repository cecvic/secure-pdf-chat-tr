import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/services/utils";
import { Message } from "ai/react";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";

const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={`${i}-${line}`}>
      {line}
      <br />
    </span>
  ));

interface ChatLineProps extends Partial<Message> {
  sources: string[];
}

export function ChatLine({ role = "assistant", content, sources }: ChatLineProps) {
  if (!content) {
    return null;
  }
  const formattedMessage = convertNewLines(content);

  return (
    <div className={cn(
      "flex gap-3 p-4",
      role === "assistant" ? "bg-muted/50" : "bg-background"
    )}>
      <div className="w-8 h-8 flex items-center justify-center">
        {role === "assistant" ? (
          <Bot className="w-6 h-6 text-blue-500" />
        ) : (
          <User className="w-6 h-6 text-amber-500" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <div className="text-sm">
          <Balancer>{formattedMessage}</Balancer>
        </div>
        {sources?.length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            {sources.map((source, index) => (
              <AccordionItem
                value={`source-${index}`}
                key={index + source}
                className="border-none"
              >
                <AccordionTrigger className="text-xs text-muted-foreground hover:no-underline py-2">
                  Source {index + 1}
                </AccordionTrigger>
                <AccordionContent className="text-xs">
                  <ReactMarkdown linkTarget="_blank">
                    {source}
                  </ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}
