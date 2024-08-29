'use client'
import { CustomBarChart } from '@/components/charts/CustomBarChart';
import { CustomPieChart } from '@/components/charts/CustomPieChart';
import { CustomRadialChart } from '@/components/charts/CustomRadialChart';
import { Sortable } from '@/components/dnd/Sortable';
import { closestCenter, DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { useState } from 'react';

const initialCharts = [
	{ id: 'chart-1', content: <CustomPieChart /> },
	{ id: 'chart-2', content: <CustomBarChart /> },
	{ id: 'chart-3', content: <CustomRadialChart /> },
	{ id: 'chart-4', content: <CustomRadialChart /> },
	{ id: 'chart-5', content: <CustomBarChart /> },
];


export default function Page() {
	const [charts, setCharts] = useState(initialCharts);

	function handleDragEnd(event) {
		const { active, over } = event;

		if (active.id !== over.id) {
			setCharts((items) => {
				const oldIndex = items.findIndex(item => item.id === active.id);
				const newIndex = items.findIndex(item => item.id === over.id);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	return (
		<DndContext
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={charts}>
				<main className="grid grid-cols-3 gap-4 p-20">
					{charts.map(chart => (
						<Sortable key={chart.id} id={chart.id} className=''>
							{chart.content}
						</Sortable>
					))}
				</main>
			</SortableContext>
		</DndContext>
	);
}

