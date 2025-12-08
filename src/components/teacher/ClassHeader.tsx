'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, CalendarDays, Download, MoreHorizontal, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ClassHeaderProps {
	selectedClassId: string;
	onClassChange: (classId: string) => void;
	onViewSyllabus?: () => void;
	classes: { id: number | string; name: string }[];
}

export function ClassHeader({ selectedClassId, onClassChange, onViewSyllabus, classes = [] }: ClassHeaderProps) {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [autoGrade, setAutoGrade] = useState(false);
	const [notifications, setNotifications] = useState(true);

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const handleDownloadReports = () => {
		// Generate CSV for class reports
		const currentClass = classes.find(c => c.id.toString() === selectedClassId);
		if (!currentClass) {
			toast.error('No class selected');
			return;
		}

		const csvContent = [
			['Student Name', 'Last Report', 'Status', 'Parent Phone'].join(','),
			// Add sample data - in production this would come from API
			['Budi Ahmad', '2 days ago', 'Present', '+6281234567890'].join(','),
			['Kevin Tan', '8 days ago', 'Absent', '+6281234567891'].join(','),
		].join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);

		link.setAttribute('href', url);
		link.setAttribute('download', `${currentClass.name}_reports_${new Date().toISOString().split('T')[0]}.csv`);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success('Reports downloaded', {
			description: `Downloaded ${currentClass.name} reports as CSV`
		});
	};

	const handleSaveSettings = () => {
		// In production, save to API/localStorage
		toast.success('Settings saved', {
			description: 'Your preferences have been updated'
		});
		setSettingsOpen(false);
	};

	return (
		<>
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
						<DropdownMenuItem onClick={handleDownloadReports} className="cursor-pointer">
							<Download className="mr-2 h-4 w-4" />
							Download Reports
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onViewSyllabus ? onViewSyllabus() : null}
							className="cursor-pointer"
						>
							<BookOpen className="mr-2 h-4 w-4" />
							View Syllabus
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setSettingsOpen(true)} className="cursor-pointer">
							<Settings className="mr-2 h-4 w-4" />
							Settings
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Settings Modal */}
			<Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Class Settings</DialogTitle>
						<DialogDescription>
							Manage preferences for this class
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="flex items-center justify-between py-3">
							<div className="space-y-0.5 flex-1">
								<Label className="text-sm font-medium">
									Auto-submit reports
								</Label>
								<p className="text-xs text-muted-foreground">
									Automatically send reports after grading
								</p>
							</div>
							<Switch
								checked={autoGrade}
								onCheckedChange={setAutoGrade}
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div className="space-y-0.5 flex-1">
								<Label className="text-sm font-medium">
									Email notifications
								</Label>
								<p className="text-xs text-muted-foreground">
									Receive email updates for this class
								</p>
							</div>
							<Switch
								checked={notifications}
								onCheckedChange={setNotifications}
							/>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							variant="outline"
							onClick={() => setSettingsOpen(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button onClick={handleSaveSettings} className="flex-1">
							Save Changes
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
