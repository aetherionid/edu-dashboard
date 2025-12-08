'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, ChevronLeft, ChevronRight, Search, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { GradingWizard } from './GradingWizard';

interface StudentRosterProps {
	students: Student[];
	onGradingSuccess: (studentId: number) => void;
}

export function StudentRoster({ students, onGradingSuccess }: StudentRosterProps) {
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [wizardOpen, setWizardOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<'all' | 'graded' | 'pending'>('all');
	const [sortBy, setSortBy] = useState<'name' | 'recent'>('name');
	const itemsPerPage = 8;

	const handleGradeClick = (student: Student) => {
		setSelectedStudent(student);
		setWizardOpen(true);
	};

	const handleGradingComplete = () => {
		if (selectedStudent) {
			onGradingSuccess(selectedStudent.id);
		}
	};

	const getInitials = (name: string) => {
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	};

	const avatarColors = [
		'bg-emerald-100 text-emerald-700',
		'bg-emerald-200 text-emerald-800',
		'bg-teal-100 text-teal-700',
		'bg-green-100 text-green-700',
		'bg-emerald-50 text-emerald-600',
		'bg-teal-50 text-teal-600',
	];

	const getAvatarColor = (id: number) => avatarColors[id % avatarColors.length];

	// Filter, search, and sort logic
	const filteredAndSortedStudents = useMemo(() => {
		let filtered = students;

		// Apply search filter
		if (searchQuery) {
			filtered = filtered.filter(student =>
				student.student_name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		// Apply status filter
		if (statusFilter === 'graded') {
			filtered = filtered.filter(s => s.graded_today);
		} else if (statusFilter === 'pending') {
			filtered = filtered.filter(s => !s.graded_today);
		}

		// Apply sorting
		if (sortBy === 'name') {
			filtered = [...filtered].sort((a, b) => a.student_name.localeCompare(b.student_name));
		} else if (sortBy === 'recent') {
			filtered = [...filtered].sort((a, b) => {
				if (a.graded_today === b.graded_today) return 0;
				return a.graded_today ? 1 : -1; // Pending first
			});
		}

		return filtered;
	}, [students, searchQuery, statusFilter, sortBy]);

	// Pagination logic
	const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedStudents = filteredAndSortedStudents.slice(startIndex, startIndex + itemsPerPage);

	const gradedCount = students.filter(s => s.graded_today).length;
	const pendingCount = students.length - gradedCount;

	// Reset to page 1 if current page exceeds total (e.g., after filter change)
	if (currentPage > totalPages && totalPages > 0) {
		setCurrentPage(1);
	}

	return (
		<>
			<Card className="border shadow-sm">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<CardTitle className="text-lg font-semibold">Student Roster</CardTitle>
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="font-normal">
									{students.length} students
								</Badge>
								{pendingCount > 0 && (
									<Badge variant="outline" className="font-normal border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
										{pendingCount} pending
									</Badge>
								)}
							</div>
						</div>
						{totalPages > 1 && (
							<div className="text-sm text-muted-foreground">
								Page {currentPage} of {totalPages}
							</div>
						)}
					</div>

					{/* Search, Filter, and Sort Controls */}
					<div className="flex flex-col sm:flex-row gap-3">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search students..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-9 pr-9"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									<X className="h-4 w-4" />
								</button>
							)}
						</div>

						{/* Filter by Status */}
						<Select value={statusFilter} onValueChange={(value: 'all' | 'graded' | 'pending') => setStatusFilter(value)}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="pending">Pending</SelectItem>
								<SelectItem value="graded">Graded</SelectItem>
							</SelectContent>
						</Select>

						{/* Sort By */}
						<Select value={sortBy} onValueChange={(value: 'name' | 'recent') => setSortBy(value)}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Sort" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="name">Name (A-Z)</SelectItem>
								<SelectItem value="recent">Pending First</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>

				<CardContent className="space-y-3">
					{/* Empty State */}
					{students.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-12 text-center">
							<div className="p-4 rounded-full bg-muted/50 mb-4">
								<Users className="h-8 w-8 text-muted-foreground" />
							</div>
							<h3 className="font-semibold text-lg mb-1">No students in this class</h3>
							<p className="text-muted-foreground text-sm">
								Students will appear here once they are enrolled.
							</p>
						</div>
					) : (
						paginatedStudents.map((student) => (
							<div
								key={student.id}
								className={cn(
									"flex items-center justify-between p-5 rounded-2xl border transition-all duration-200",
									student.graded_today
										? "bg-muted/30 border-transparent opacity-75"
										: "bg-card hover:border-emerald-200 hover:shadow-md"
								)}
							>
								<div className="flex items-center gap-5">
									<Avatar className="h-14 w-14 border-2 border-background shadow-md">
										<AvatarFallback className={cn("font-bold text-base", getAvatarColor(student.id))}>
											{getInitials(student.student_name)}
										</AvatarFallback>
									</Avatar>

									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<h3 className={cn(
												"font-semibold text-lg",
												student.graded_today ? "text-muted-foreground" : "text-foreground"
											)}>
												{student.student_name}
											</h3>
											<span className="text-xs text-muted-foreground">
												({student.parent_name})
											</span>
										</div>
										<div className="flex items-center gap-2">
											<Badge
												variant="outline"
												className={cn(
													"text-xs font-medium px-2 py-0",
													student.status === 'present'
														? 'border-emerald-200 bg-emerald-50 text-emerald-700'
														: 'border-slate-200 bg-slate-50 text-slate-600'
												)}
											>
												{student.status === 'present' ? 'Present' : 'Absent'}
											</Badge>
											<span className="text-xs text-muted-foreground">
												Last report {student.last_report ? formatDistanceToNow(new Date(student.last_report), { addSuffix: true }) : 'Never'}
											</span>
										</div>
									</div>
								</div>

								{student.graded_today ? (
									<div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
										<CheckCircle2 className="h-4 w-4" />
										<span className="text-sm font-medium">Completed</span>
									</div>
								) : (
									<Button
										size="lg"
										onClick={() => handleGradeClick(student)}
										className="gap-2 px-6"
									>
										<Users className="h-5 w-5" />
										Grade Student
									</Button>
								)}
							</div>
						))
					)}

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between pt-4 border-t">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
								disabled={currentPage === 1}
								className="gap-1"
							>
								<ChevronLeft className="h-4 w-4" />
								Previous
							</Button>

							<div className="flex items-center gap-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
									<Button
										key={page}
										variant={currentPage === page ? "default" : "ghost"}
										size="sm"
										onClick={() => setCurrentPage(page)}
										className="w-8 h-8 p-0"
									>
										{page}
									</Button>
								))}
							</div>

							<Button
								variant="outline"
								size="sm"
								onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
								disabled={currentPage === totalPages}
								className="gap-1"
							>
								Next
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</CardContent>
			</Card>

			{selectedStudent && (
				<GradingWizard
					student={selectedStudent}
					open={wizardOpen}
					onOpenChange={setWizardOpen}
					onSuccess={handleGradingComplete}
				/>
			)}
		</>
	);
}
