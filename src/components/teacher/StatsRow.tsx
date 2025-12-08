'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock, Users } from 'lucide-react';

interface StatsRowProps {
	stats: {
		total_students: number;
		graded_today: number;
		pending: number;
	};
}

export function StatsRow({ stats }: StatsRowProps) {
	const progress = stats.total_students > 0
		? Math.round((stats.graded_today / stats.total_students) * 100)
		: 0;

	const statCards = [
		{
			label: 'Students',
			value: stats.total_students,
			icon: Users,
			color: 'text-emerald-500',
			bgColor: 'bg-emerald-500/10',
		},
		{
			label: 'Graded',
			value: stats.graded_today,
			icon: CheckCircle2,
			color: 'text-emerald-500',
			bgColor: 'bg-emerald-500/10',
		},
		{
			label: 'Pending',
			value: stats.pending,
			icon: Clock,
			color: 'text-amber-500',
			bgColor: 'bg-amber-500/10',
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{statCards.map((stat, idx) => (
				<Card
					key={idx}
					className="p-5 border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors hover:shadow-lg"
				>
					<div className="flex items-center gap-4">
						<div className={`p-3 rounded-xl ${stat.bgColor}`}>
							<stat.icon className={`h-5 w-5 ${stat.color}`} />
						</div>
						<div>
							<p className="text-3xl font-bold">{stat.value}</p>
							<p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
						</div>
					</div>
				</Card>
			))}

			{/* Progress Ring Card */}
			<Card className="p-5 border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-200">
				<div className="flex items-center gap-4">
					<div className="relative w-14 h-14">
						{/* Background circle */}
						<svg className="w-14 h-14 -rotate-90">
							<circle
								cx="28"
								cy="28"
								r="24"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								className="text-muted/30"
							/>
							<circle
								cx="28"
								cy="28"
								r="24"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
								strokeDasharray={`${2 * Math.PI * 24}`}
								strokeDashoffset={`${2 * Math.PI * 24 * (1 - progress / 100)}`}
								strokeLinecap="round"
								className="text-emerald-500 transition-all duration-500"
							/>
						</svg>
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-sm font-bold">{progress}%</span>
						</div>
					</div>
					<div>
						<p className="text-sm font-medium">Today&apos;s Progress</p>
						<p className="text-xs text-muted-foreground">
							{stats.graded_today} of {stats.total_students} graded
						</p>
					</div>
				</div>
			</Card>
		</div>
	);
}
