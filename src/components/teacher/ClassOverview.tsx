'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Calendar, Download, Settings } from 'lucide-react';
import { toast } from 'sonner';

const todayAgenda = [
	{ time: '09:00', title: 'Primary A - English', students: 12, active: true },
	{ time: '11:00', title: 'Primary B - Grammar', students: 8, active: false },
	{ time: '14:00', title: 'TOEFL Prep', students: 6, active: false },
];

interface ClassOverviewProps {
	gradedCount: number;
	pendingCount: number;
}

export function ClassOverview({ gradedCount, pendingCount }: ClassOverviewProps) {
	const totalStudents = gradedCount + pendingCount;
	const progress = totalStudents > 0 ? (gradedCount / totalStudents) * 100 : 0;

	const handleAction = (action: string) => {
		toast.info(action, { description: 'Feature coming soon' });
	};

	return (
		<div className="space-y-4">
			{/* Progress */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">Today&apos;s Progress</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">Graded</span>
						<span className="font-medium">{gradedCount}/{totalStudents}</span>
					</div>
					<Progress value={progress} className="h-2" />
				</CardContent>
			</Card>

			{/* Schedule */}
			<Card>
				<CardHeader className="pb-3">
					<div className="flex items-center gap-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<CardTitle className="text-sm font-medium">Schedule</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="space-y-2">
					{todayAgenda.map((item, idx) => (
						<div
							key={idx}
							className={`flex items-center gap-3 p-2 rounded-lg text-sm cursor-pointer transition-colors hover:bg-accent ${item.active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20' : ''}`}
						>
							<span className="font-mono text-xs w-10 text-muted-foreground">{item.time}</span>
							<div className="flex-1 min-w-0">
								<p className="font-medium truncate">{item.title}</p>
								<p className="text-xs text-muted-foreground">{item.students} students</p>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('Download Reports')}>
						<Download className="h-4 w-4 mr-2" />
						Download Reports
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('View Syllabus')}>
						<BookOpen className="h-4 w-4 mr-2" />
						View Syllabus
					</Button>
					<Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction('Settings')}>
						<Settings className="h-4 w-4 mr-2" />
						Settings
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
