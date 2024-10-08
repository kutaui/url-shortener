'use client'

import * as React from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

export function CustomPieChart({
	data,
}: {
	data: MostClickedLinks[] | undefined
}) {
	const colors = ['red', 'blue', 'yellow', 'orange', 'purple']

	const chartData =
		data?.map((link, index) => ({
			link: link.code,
			clicks: link.clickCount,
			fill: colors[index % colors.length],
		})) || []

	// Ensure chartData has at least one entry
	if (chartData.length === 0) {
		chartData.push({ link: 'No Data', clicks: 0.01, fill: 'gray' })
	}

	const chartConfigData = data?.reduce(
		(acc: { [key: string]: { label: string } }, link) => {
			acc[link.code] = {
				label: link.code,
			}
			return acc
		},
		{}
	)

	const chartConfig = {
		...chartConfigData,
	} satisfies ChartConfig

	const totalClicks = chartData.reduce((acc, curr) => acc + curr.clicks, 0)

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Most Clicked Links</CardTitle>
				<CardDescription>All Time</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={chartData}
							dataKey="clicks"
							nameKey="link"
							innerRadius={60}
							outerRadius={80}
							fill="#8884d8"
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{totalClicks === 0.01 ? 0 : totalClicks}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Clicks
												</tspan>
											</text>
										)
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col gap-2 text-sm">
				<div className="flex items-center gap-2 font-medium leading-none">
					Showing your 5 most clicked links
				</div>
			</CardFooter>
		</Card>
	)
}
