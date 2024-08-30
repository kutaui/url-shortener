import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface GroupedByMonthLinks {
    month: string;
    clickCount: number;
}

// Utility function to format month strings
const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1); // Month is zero-based
    return date.toLocaleString('default', { month: 'long' }); // E.g., "August"
};

const chartConfig = {
    desktop: {
        label: "Clicks",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CustomBarChart({ data }: { data: GroupedByMonthLinks[] }) {
    const chartData = data?.map((item) => ({
        month: formatMonth(item.month),
        clicks: item.clickCount,
    })) || [];

    const currentYear = new Date().getFullYear();
    const startMonth = chartData[0]?.month ?? 'Unknown';
    const endMonth = chartData[chartData.length - 1]?.month ?? 'Unknown';
    const monthRange = `${startMonth} - ${endMonth} ${currentYear}`;

    const totalClicks = chartData.reduce((sum, item) => sum + item.clicks, 0);
    const previousMonthClicks = chartData.length > 1 ? chartData[chartData.length - 2]?.clicks || 0 : 0;
    const currentMonthClicks = chartData[chartData.length - 1]?.clicks || 0;
    const percentageChange = previousMonthClicks > 0
        ? ((currentMonthClicks - previousMonthClicks) / previousMonthClicks) * 100
        : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clicks by Month</CardTitle>
                <CardDescription>{monthRange}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="clicks" fill="var(--color-desktop)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {percentageChange > 0 ? "Trending up" : "Trending down"} by {Math.abs(percentageChange).toFixed(1)}% this month{" "}
                    <TrendingUp className={`h-4 w-4 ${percentageChange < 0 ? "transform rotate-180" : ""}`} />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last {chartData.length} months
                </div>
                <div className="leading-none text-muted-foreground">
                    Total clicks: {totalClicks}
                </div>
            </CardFooter>
        </Card>
    );
}
