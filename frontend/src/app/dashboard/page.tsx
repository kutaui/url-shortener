'use client'
import { CustomBarChart } from '@/components/charts/CustomBarChart'
import { CustomPieChart } from '@/components/charts/CustomPieChart'
import { CustomRadialChart } from '@/components/charts/CustomRadialChart'
import { Sortable } from '@/components/dnd/Sortable'
import {
	GetClicksGroupedByMonthQuery,
	GetMostClickedUrlsQuery,
	GetTotalClicksQuery,
} from '@/controllers/AnalyticsController'
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

export default function Page() {
	const { data: mostClicked, isLoading: mostIsLoading } =
		GetMostClickedUrlsQuery()
	const { data: clicksByMonth, isLoading: monthIsLoading } =
		GetClicksGroupedByMonthQuery()
	const { data: totalClicks, isLoading: totalIsLoading } = GetTotalClicksQuery()

	const [charts, setCharts] = useState<any[]>([])

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event

		if (over && active.id !== over.id) {
			setCharts((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id)
				const newIndex = items.findIndex((item) => item.id === over.id)
				const newItems = arrayMove(items, oldIndex, newIndex)
				localStorage.setItem(
					'chartsOrder',
					JSON.stringify(newItems.map((item) => item.id))
				)
				return newItems
			})
		}
	}

	useEffect(() => {
		if (!mostIsLoading && !monthIsLoading && !totalIsLoading) {
			const defaultCharts = [
				{ id: 'most-clicked', content: <CustomPieChart data={mostClicked} /> },
				{
					id: 'clicks-by-month',
					content: <CustomBarChart data={clicksByMonth} />,
				},
				{
					id: 'total-clicks',
					content: <CustomRadialChart data={totalClicks} />,
				},
			]

			const savedOrder = localStorage.getItem('chartsOrder')
			if (savedOrder) {
				const order = JSON.parse(savedOrder)
				const orderedCharts = order.map((id: string) =>
					defaultCharts.find((chart) => chart.id === id)
				)
				setCharts(orderedCharts)
			} else {
				setCharts(defaultCharts)
			}
		}
	}, [
		mostClicked,
		clicksByMonth,
		totalClicks,
		mostIsLoading,
		monthIsLoading,
		totalIsLoading,
	])

	return (
		<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<SortableContext items={charts}>
				<main className="p-20">
					<h1 className="text-5xl font-bold pb-10">Dashboard</h1>
					<section className="grid grid-cols-3 gap-4 ">
						{charts.map((chart) => (
							<Sortable key={chart.id} id={chart.id} className="">
								{chart.content}
							</Sortable>
						))}
					</section>
				</main>
			</SortableContext>
		</DndContext>
	)
}
