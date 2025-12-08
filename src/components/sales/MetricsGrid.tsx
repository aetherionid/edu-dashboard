'use client';

import { AlertCircle, ArrowUpRight, CheckCircle, Flame, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

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
			trend: 'up',
			gradient: 'from-blue-600 via-blue-500 to-cyan-400',
			shadowColor: 'shadow-blue-500/25',
		},
		{
			title: 'Action Required',
			value: metrics.action_required,
			icon: AlertCircle,
			change: '5 urgent',
			trend: 'warning',
			gradient: 'from-orange-600 via-orange-500 to-amber-400',
			shadowColor: 'shadow-orange-500/25',
		},
		{
			title: 'Hot Pipeline',
			value: metrics.hot_pipeline,
			icon: Flame,
			change: '+8%',
			trend: 'up',
			gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
			shadowColor: 'shadow-emerald-500/25',
		},
		{
			title: 'Valid Rate',
			value: metrics.valid_invalid_ratio,
			icon: CheckCircle,
			change: 'On target',
			trend: 'stable',
			gradient: 'from-sky-600 via-blue-500 to-indigo-400',
			shadowColor: 'shadow-sky-500/25',
		}
	];

	const handleClick = (card: typeof cards[0]) => {
		toast.info(`Opening ${card.title}`);
	};

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map((card, idx) => (
				<div
					key={idx}
					onClick={() => handleClick(card)}
					className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${card.shadowColor}`}
				>
					{/* Glow effect */}
					<div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

					{/* Decorative circles */}
					<div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl pointer-events-none" />
					<div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-black/10 pointer-events-none" />

					<div className="relative z-10">
						<div className="flex items-center justify-between mb-4">
							<card.icon className="h-6 w-6 text-white/90" />
							{card.trend === 'up' && (
								<span className="flex items-center gap-1 text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
									<ArrowUpRight className="h-3 w-3" />
									{card.change}
								</span>
							)}
							{card.trend === 'warning' && (
								<span className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
									{card.change}
								</span>
							)}
							{card.trend === 'stable' && (
								<span className="text-xs font-semibold text-white/80">
									{card.change}
								</span>
							)}
						</div>
						<p className="text-4xl font-black text-white tracking-tight">
							{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
						</p>
						<p className="text-sm text-white/80 mt-1 font-medium">{card.title}</p>
					</div>
				</div>
			))}
		</div>
	);
}
