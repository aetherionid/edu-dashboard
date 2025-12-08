'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Activity, MessageSquare, Phone, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const activities = [
	{
		id: 1,
		icon: UserPlus,
		title: 'New lead added',
		description: 'Mrs. Indah Wijaya',
		time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
	},
	{
		id: 2,
		icon: MessageSquare,
		title: 'AI replied',
		description: 'Pak Hendra',
		time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
	},
	{
		id: 3,
		icon: Phone,
		title: 'Follow-up scheduled',
		description: 'Dr. Rina at 3:00 PM',
		time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
	},
	{
		id: 4,
		icon: UserPlus,
		title: 'New lead added',
		description: 'Budi Santoso (WhatsApp)',
		time: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
	},
];

export function RecentActivity() {
	const handleClick = (activity: typeof activities[0]) => {
		toast.info(`Opening: ${activity.title}`, {
			description: activity.description,
		});
	};

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-2">
					<Activity className="h-4 w-4 text-muted-foreground" />
					<CardTitle className="text-base font-medium">Recent Activity</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-1">
				{activities.map((activity) => (
					<button
						key={activity.id}
						onClick={() => handleClick(activity)}
						className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left group cursor-pointer"
					>
						<activity.icon className="h-4 w-4 text-muted-foreground shrink-0" />
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium">{activity.title}</p>
							<p className="text-xs text-muted-foreground">{activity.description}</p>
						</div>
						<span className="text-[10px] text-muted-foreground shrink-0">
							{formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
						</span>
					</button>
				))}
			</CardContent>
		</Card>
	);
}
