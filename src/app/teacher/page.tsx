'use client';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { ClassHeader } from '@/components/teacher/ClassHeader';
import { ScheduleStrip } from '@/components/teacher/ScheduleStrip';
import { StatsRow } from '@/components/teacher/StatsRow';
import { StudentRoster } from '@/components/teacher/StudentRoster';
import { SyllabusModal } from '@/components/teacher/SyllabusModal';
import { api, Student } from '@/lib/api';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type ClassStat = {
	id: number; // changed from class_id to id because n8n returns c.id alias
	class_id?: number; // fallback
	class_name: string;
	total_students: number;
	graded_today: number;
	pending: number;
	name?: string; // fallback if mapped
};

export default function TeacherPage() {
	const [selectedClassId, setSelectedClassId] = useState<string>('');
	const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
	const [allStudents, setAllStudents] = useState<Student[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [syllabusOpen, setSyllabusOpen] = useState(false);
	const [loading, setLoading] = useState(true);

	const [stats, setStats] = useState({
		class_name: '',
		total_students: 0,
		graded_today: 0,
		pending: 0
	});

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [statsData, studentsData] = await Promise.all([
					api.teacher.getClassStats(),
					api.teacher.getStudents()
				]);

				// Map class stats to classes list
				// Handle both `id` and `class_id` depending on n8n response alias
				// My n8n query: SELECT c.id as class_id, ... but I think api.ts uses .json() which returns array of objects
				// Let's inspect the n8n query alias: SELECT c.id as class_id ...
				// So the key in JSON will be `class_id`.

				// Wait, the new n8n query I wrote: SELECT c.id as class_id ...
				// But wait, the Update status response aliases might differ.
				// Let's assume the keys match the SQL columns/aliases.

				const validClasses = (Array.isArray(statsData) ? statsData : []).map((c: any) => ({
					id: c.class_id || c.id,
					name: c.class_name
				}));

				setClasses(validClasses as any);

				if (validClasses.length > 0 && !selectedClassId) {
					setSelectedClassId(validClasses[0].id.toString());
				}

				setAllStudents(Array.isArray(studentsData) ? studentsData : []);
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error);
				toast.error('Failed to load dashboard data');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [selectedClassId]);

	// Filter students and update stats when class changes
	useEffect(() => {
		if (!selectedClassId) return;

		const classIdNum = parseInt(selectedClassId);
		const classStudents = allStudents.filter(s =>
			// Check both class_id types just in case
			Number(s.class_id) === classIdNum
		); // api.ts defines Student.class_id ? No, types need update if using class_id

		// Wait, api.ts Student type doesn't have class_id?
		// I need to update Student type in api.ts too OR cast it here.
		// The API response definitely has class_id based on SQL.

		setStudents(classStudents as any);
		updateStats(classStudents as any);
	}, [selectedClassId, allStudents]);

	const updateStats = useCallback((studentList: any[]) => {
		const gradedCount = studentList.filter(s => s.graded_today).length;
		const currentClass = classes.find(c => c.id.toString() === selectedClassId);

		setStats({
			class_name: currentClass?.name || 'Loading...',
			total_students: studentList.length,
			graded_today: gradedCount,
			pending: studentList.length - gradedCount
		});
	}, [selectedClassId, classes]);

	const handleGradingSuccess = useCallback((studentId: number) => {
		// Optimistic update
		setAllStudents(prev => prev.map(s =>
			s.id === studentId
				? { ...s, graded_today: true, last_report: new Date().toISOString() }
				: s
		));
	}, []);

	if (loading && classes.length === 0) {
		return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
	}

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader
				title="Teacher Dashboard"
				description="Grade students and send personalized AI reports to parents"
			/>

			<div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
				{/* Compact Header Bar */}
				<ClassHeader
					selectedClassId={selectedClassId}
					onClassChange={setSelectedClassId}
					onViewSyllabus={() => setSyllabusOpen(true)}
					classes={classes}
				/>

				{/* Stats Row */}
				<StatsRow stats={stats} />

				{/* Student Roster - Full Width */}
				<StudentRoster
					students={students}
					onGradingSuccess={handleGradingSuccess}
				/>

				{/* Schedule Strip */}
				<ScheduleStrip />
			</div>

			{/* Syllabus Modal */}
			<SyllabusModal
				open={syllabusOpen}
				onOpenChange={setSyllabusOpen}
			/>
		</div>
	);
}
