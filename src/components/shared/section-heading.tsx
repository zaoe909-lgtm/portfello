import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle: string;
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("text-center space-y-3", className)}>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline">
        {title}
      </h2>
      <p className="max-w-[800px] mx-auto text-muted-foreground md:text-xl/relaxed">
        {subtitle}
      </p>
    </div>
  );
}
