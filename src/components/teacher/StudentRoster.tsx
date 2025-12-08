'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import { GradingWizard } from './GradingWizard';

interface StudentRosterProps {
	students: Student[];
	onGradingSuccess: (studentId: number) => void;
}

export function StudentRoster({ students, onGradingSuccess }: StudentRosterProps) {
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [wizardOpen, setWizardOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

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

	// Pagination logic
	const totalPages = Math.ceil(students.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedStudents = students.slice(startIndex, startIndex + itemsPerPage);

	const gradedCount = students.filter(s => s.graded_today).length;
	const pendingCount = students.length - gradedCount;

	// Reset to page 1 if current page exceeds total (e.g., after class switch)
	if (currentPage > totalPages && totalPages > 0) {
		setCurrentPage(1);
	}

	return (
		<>
			<Card className="border shadow-sm">
				<CardHeader className="pb-4">
					<div className="flex items-center justify-between">
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
										: "bg-card hover:border-emerald-200 hover:shadow-md hover:scale-[1.01]"
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
									<div className="flex items-center gap-2 text-emerald-600 px-4 py-2 bg-emerald-50 rounded-lg">
										<CheckCircle2 className="h-4 w-4" />
										<span className="text-sm font-medium">Completed</span>
									</div>
								) : (
									<Button
										size="lg"
										onClick={() => handleGradeClick(student)}
										className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-500/25 gap-2 transition-all duration-200 hover:scale-105 hover:shadow-xl px-6"
									>
										<Sparkles className="h-5 w-5" />
										Grade with AI
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
