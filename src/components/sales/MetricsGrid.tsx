'use client';

import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowUpRight, CheckCircle, Flame, TrendingUp } from 'lucide-react';

interface MetricsGridProps {
	metrics: {
		total_leads: number;
		action_required: number;
		hot_pipeline: number;
		valid_invalid_ratio: string;
	};
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
	const cards = [
		{
			title: 'Total Leads',
			value: metrics.total_leads,
			icon: TrendingUp,
			change: '+12%',
			trend: 'up' as const,
			color: 'text-blue-600 dark:text-blue-400',
			bgColor: 'bg-blue-50 dark:bg-blue-950/50',
			borderColor: 'border-blue-200 dark:border-blue-800',
		},
		{
			title: 'Action Required',
			value: metrics.action_required,
			icon: AlertCircle,
			change: '5 urgent',
			trend: 'warning' as const,
			color: 'text-orange-600 dark:text-orange-400',
			bgColor: 'bg-orange-50 dark:bg-orange-950/50',
			borderColor: 'border-orange-200 dark:border-orange-800',
		},
		{
			title: 'Hot Pipeline',
			value: metrics.hot_pipeline,
			icon: Flame,
			change: '+8%',
			trend: 'up' as const,
			color: 'text-emerald-600 dark:text-emerald-400',
			bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
			borderColor: 'border-emerald-200 dark:border-emerald-800',
		},
		{
			title: 'Valid Rate',
			value: metrics.valid_invalid_ratio,
			icon: CheckCircle,
			change: 'On target',
			trend: 'stable' as const,
			color: 'text-sky-600 dark:text-sky-400',
			bgColor: 'bg-sky-50 dark:bg-sky-950/50',
			borderColor: 'border-sky-200 dark:border-sky-800',
		}
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card, idx) => (
				<Card
					key={idx}
					className={`p-5 border-2 ${card.borderColor} ${card.bgColor} hover:shadow-md transition-shadow cursor-pointer`}
				>
					<div className="flex items-start justify-between mb-3">
						<div className={`p-2 rounded-lg ${card.color} bg-background`}>
							<card.icon className="h-5 w-5" />
						</div>
						{card.trend === 'up' && (
							<span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
								<ArrowUpRight className="h-3 w-3" />
								{card.change}
							</span>
						)}
						{card.trend === 'warning' && (
							<span className="text-xs font-medium text-orange-600 dark:text-orange-400">
								{card.change}
							</span>
						)}
						{card.trend === 'stable' && (
							<span className="text-xs font-medium text-muted-foreground">
								{card.change}
							</span>
						)}
					</div>
					<p className="text-3xl font-bold tracking-tight mb-1">
						{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
					</p>
					<p className="text-sm text-muted-foreground font-medium">{card.title}</p>
				</Card>
			))}
		</div>
	);
}
