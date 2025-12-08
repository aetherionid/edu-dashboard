'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, ChevronRight, Clock, Lightbulb, Sparkles, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const insights = [
	{
		id: 1,
		icon: Lightbulb,
		iconColor: 'text-amber-500',
		bgColor: 'bg-amber-50 dark:bg-amber-900/20',
		title: 'Follow up with Mrs. Indah',
		description: 'High intent - schedule call within 24h',
		action: 'Schedule Call',
		priority: 'high',
	},
	{
		id: 2,
		icon: TrendingUp,
		iconColor: 'text-emerald-500',
		bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
		title: 'Weekend inquiries up 23%',
		description: 'Consider extending support hours',
		action: 'View Report',
		priority: 'medium',
	},
	{
		id: 3,
		icon: Target,
		iconColor: 'text-cyan-500',
		bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
		title: '3 leads ready to close',
		description: 'Hendra, Indah, Siti - final stage',
		action: 'View Leads',
		priority: 'high',
	},
	{
		id: 4,
		icon: Clock,
		iconColor: 'text-rose-500',
		bgColor: 'bg-rose-50 dark:bg-rose-900/20',
		title: 'Budi - Payment Issue',
		description: 'Escalated 5h ago - needs attention',
		action: 'Escalate',
		priority: 'urgent',
	},
];

export function AIInsights() {
	const handleAction = (insight: typeof insights[0]) => {
		toast.success(`Action: ${insight.action}`, {
			description: `Processing "${insight.title}"...`,
		});
	};

	return (
		<Card className="h-full">
			<CardHeader className="pb-3 border-b">
				<div className="flex items-center gap-2">
					<div className="p-1.5 rounded-md bg-cyan-100 dark:bg-cyan-900/30">
						<Brain className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
					</div>
					<CardTitle className="text-base font-semibold">AI Insights</CardTitle>
					<Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="divide-y">
					{insights.map((insight) => (
						<button
							key={insight.id}
							onClick={() => handleAction(insight)}
							className="w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-all duration-200 text-left group hover:scale-[1.01] hover:shadow-sm rounded-lg cursor-pointer"
						>
							<div className={`p-2 rounded-lg ${insight.bgColor} shrink-0`}>
								<insight.icon className={`h-4 w-4 ${insight.iconColor}`} />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{insight.title}</p>
								<p className="text-xs text-muted-foreground truncate">{insight.description}</p>
							</div>
							<ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
						</button>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
