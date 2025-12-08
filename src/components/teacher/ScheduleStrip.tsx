'use client';

import { cn } from '@/lib/utils';

const scheduleItems = [
	{ time: '09:00', title: 'Primary A - English', students: 12, active: true },
	{ time: '11:00', title: 'Primary B - Grammar', students: 8, active: false },
	{ time: '14:00', title: 'TOEFL Prep', students: 6, active: false },
];

export function ScheduleStrip() {
	return (
		<div className="flex items-center gap-2 overflow-x-auto pb-2">
			<span className="text-sm text-muted-foreground font-medium shrink-0">Today:</span>
			<div className="flex gap-2">
				{scheduleItems.map((item, idx) => (
					<button
						key={idx}
						className={cn(
							"flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shrink-0",
							"cursor-pointer",
							item.active
								? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
								: "bg-muted hover:bg-muted/80 text-muted-foreground"
						)}
					>
						<span className="font-mono text-xs opacity-70">{item.time}</span>
						<span>{item.title}</span>
						{item.active && (
							<span className="w-2 h-2 rounded-full bg-white" />
						)}
					</button>
				))}
			</div>
		</div>
	);
}
