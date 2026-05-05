import { BarChart3, FileText, FolderOpen, Star } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: "50",
    label: "Published prompts",
  },
  {
    icon: FolderOpen,
    value: "12",
    label: "Categories",
  },
  {
    icon: BarChart3,
    value: "Live",
    label: "Engagement ranking",
  },
  {
    icon: Star,
    value: "AI",
    label: "Quality evaluation",
  },
];

export const Stats = () => {
  return (
    <section className="relative py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-3 border-y border-border/50 py-4 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-md border border-border/50 bg-card/35 p-4 backdrop-blur-sm transition-colors hover:border-primary/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
