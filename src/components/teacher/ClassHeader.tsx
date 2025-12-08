'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, CalendarDays, Download, MoreHorizontal, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ClassHeaderProps {
	selectedClassId: string;
	onClassChange: (classId: string) => void;
	onViewSyllabus?: () => void;
	classes: { id: number | string; name: string }[];
}

export function ClassHeader({ selectedClassId, onClassChange, onViewSyllabus, classes = [] }: ClassHeaderProps) {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const handleAction = (action: string) => {
		toast.info(action, { description: 'Feature coming soon' });
	};

	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
			{/* Left: Class Selector */}
			<div className="flex items-center gap-4">
				<Select value={selectedClassId.toString()} onValueChange={onClassChange}>
					<SelectTrigger className="w-auto min-w-[220px] bg-card border text-base font-semibold h-11 shadow-sm">
						<SelectValue placeholder="Select class" />
					</SelectTrigger>
					<SelectContent>
						{classes.map((cls) => (
							<SelectItem key={cls.id} value={cls.id.toString()}>
								{cls.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Center: Date */}
			<div className="hidden md:flex items-center gap-2 text-muted-foreground">
				<CalendarDays className="h-4 w-4" />
				<span className="text-sm">{today}</span>
			</div>

			{/* Right: Quick Actions */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" size="sm" className="gap-2">
						<MoreHorizontal className="h-4 w-4" />
						<span className="hidden sm:inline">Quick Actions</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem onClick={() => handleAction('Download Reports')} className="cursor-pointer">
						<Download className="mr-2 h-4 w-4" />
						Download Reports
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => onViewSyllabus ? onViewSyllabus() : handleAction('View Syllabus')}
						className="cursor-pointer"
					>
						<BookOpen className="mr-2 h-4 w-4" />
						View Syllabus
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleAction('Settings')} className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
