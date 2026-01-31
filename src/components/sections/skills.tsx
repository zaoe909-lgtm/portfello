"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { SectionHeading } from "../shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const chartConfig = {
  proficiency: {
    label: "Proficiency",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function Skills() {
  const firestore = useFirestore();
  const skillsCol = useMemoFirebase(() => firestore && collection(firestore, "skills"), [firestore]);
  const { data: skills, isLoading } = useCollection(skillsCol);
  
  return (
    <section id="skills" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Technical Skills"
          subtitle="My proficiency in key technologies. I'm constantly learning and expanding my skillset to stay at the forefront of mobile development."
          className="mb-12"
        />
        <Card>
          <CardHeader>
            <CardTitle>Proficiency Levels</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />}
            {skills && (
              <ChartContainer config={chartConfig} className="w-full h-[400px]">
                <BarChart
                  data={skills}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" dataKey="proficiency" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="hsl(var(--foreground))"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 14 }}
                    width={110}
                    orientation={'left'}
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--accent))" }}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Bar
                    dataKey="proficiency"
                    fill="var(--color-proficiency)"
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
