'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Static trend data - TODO: Create API endpoint for historical lead trends
const trendData = [
	{ week: 'Week 1', leads: 28 },
	{ week: 'Week 2', leads: 55 },
	{ week: 'Week 3', leads: 89 },
	{ week: 'Week 4', leads: 124 }
];

export function GrowthGraph() {
	const mounted = true;
	const data = trendData;

	return (
		<Card className="h-full">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
							<TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
						</div>
						<div>
							<CardTitle className="text-lg font-bold">Lead Growth</CardTitle>
							<p className="text-sm text-muted-foreground">Monthly performance</p>
						</div>
					</div>
					<div className="flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
						<ArrowUpRight className="h-4 w-4" />
						+23%
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				<div className="h-[200px] w-full">
					{mounted ? (
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
								<defs>
									<linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
										<stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									dataKey="week"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
									dy={10}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
									dx={-10}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--popover))',
										border: '1px solid hsl(var(--border))',
										borderRadius: '8px',
										fontSize: '14px',
										color: 'hsl(var(--popover-foreground))'
									}}
									labelStyle={{ fontWeight: 600, marginBottom: '4px' }}
								/>
								<Area
									type="monotone"
									dataKey="leads"
									stroke="hsl(var(--primary))"
									strokeWidth={2}
									fill="url(#leadGradient)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full bg-muted animate-pulse rounded-lg" />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
