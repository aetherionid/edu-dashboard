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
		<Card className="h-full overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
			{/* Background decoration */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30 pointer-events-none" />

			<CardHeader className="pb-2 relative z-10">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/25">
							<TrendingUp className="h-5 w-5 text-white" />
						</div>
						<div>
							<CardTitle className="text-lg font-bold text-white">Lead Growth</CardTitle>
							<p className="text-sm text-slate-400">Monthly performance</p>
						</div>
					</div>
					<div className="flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
						<ArrowUpRight className="h-4 w-4" />
						+23%
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-4 relative z-10">
				<div className="h-[200px] w-full">
					{mounted ? (
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
								<defs>
									<linearGradient id="leadGradientPremium" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
										<stop offset="100%" stopColor="#10b981" stopOpacity={0} />
									</linearGradient>
								</defs>
								<XAxis
									dataKey="week"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: '#94a3b8' }}
									dy={10}
								/>
								<YAxis
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 12, fill: '#64748b' }}
									dx={-10}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: '#1e293b',
										border: '1px solid #334155',
										borderRadius: '12px',
										boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
										fontSize: '14px',
										color: '#f8fafc'
									}}
									labelStyle={{ fontWeight: 700, marginBottom: '4px', color: '#f8fafc' }}
								/>
								<Area
									type="monotone"
									dataKey="leads"
									stroke="#10b981"
									strokeWidth={3}
									fill="url(#leadGradientPremium)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					) : (
						<div className="h-full bg-gradient-to-br from-cyan-500/10 to-teal-500/10 animate-pulse rounded-xl" />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
