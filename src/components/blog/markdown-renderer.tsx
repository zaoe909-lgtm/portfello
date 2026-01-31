import { cn } from "@/lib/utils";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

// This is a very basic markdown renderer. For a real app, use a library like react-markdown.
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const lines = content.split('\\n');

  return (
    <div className={cn("prose prose-invert max-w-none text-foreground/80", className)}>
      {lines.map((line, index) => {
        line = line.trim();
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-2 text-primary-foreground/90">{line.substring(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b pb-2 text-primary-foreground">{line.substring(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-4xl font-extrabold mt-10 mb-6 text-primary-foreground">{line.substring(2)}</h1>;
        }
        if (line.startsWith('* ')) {
          return <li key={index} className="ml-6 list-disc">{line.substring(2)}</li>;
        }
        if (line.startsWith('```')) {
            const codeBlockLines = [];
            let i = index + 1;
            while(i < lines.length && !lines[i].startsWith('```')) {
                codeBlockLines.push(lines[i]);
                i++;
            }
            // This is a hack to skip lines that are part of the code block in next iterations
            lines.splice(index + 1, i - index); 
            return <pre key={index} className="bg-muted/50 p-4 rounded-md my-4 overflow-x-auto"><code className="font-code">{codeBlockLines.join('\n')}</code></pre>;
        }
        return <p key={index} className="my-4 leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
