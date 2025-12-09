'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { AlertCircle, CheckCircle2, FileText, Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type WizardState = 'input' | 'loading' | 'review' | 'success';

interface GradingWizardProps {
	student: {
		id: number;
		student_name: string;
		status: 'present' | 'absent';
		parent_phone: string;
		class_id?: number;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
}

export function GradingWizard({ student, open, onOpenChange, onSuccess }: GradingWizardProps) {
	const [state, setState] = useState<WizardState>('input');
	const [score, setScore] = useState(3);
	const [attendance, setAttendance] = useState(true);
	const [draftMessage, setDraftMessage] = useState('');
	const [topic, setTopic] = useState('');
	const [classActivity, setClassActivity] = useState('');
	const [teacherNotes, setTeacherNotes] = useState('');
	const [syllabusTopics, setSyllabusTopics] = useState<{ week: number; topic: string }[]>([]);

	// Reset state when modal opens/closes
	useEffect(() => {
		if (open) {
			// Fetch syllabus when modal opens
			const fetchSyllabus = async () => {
				try {
					const data = await api.teacher.getSyllabus(student.class_id);
					const topics = (Array.isArray(data) ? data : []).map((item: { week: number; topic: string }) => ({
						week: item.week,
						topic: item.topic
					}));
					setSyllabusTopics(topics);
					if (topics.length > 0) {
						setTopic(topics[0].topic);
					}
				} catch (error) {
					console.error('Failed to fetch syllabus:', error);
				}
			};
			fetchSyllabus();
		} else {
			// Reset state when closing - use RAF to avoid setState in effect warning
			requestAnimationFrame(() => {
				setState('input');
				setScore(3);
				setAttendance(student.status === 'present');
				setDraftMessage('');
				setTopic('');
				setClassActivity('');
				setTeacherNotes('');
			});
		}
	}, [open, student.status]);

	const scoreOptions = [
		{ value: 1, label: 'Needs Help' },
		{ value: 3, label: 'Good Progress' },
		{ value: 5, label: 'Excellent' }
	];

	const handleGenerateDraft = async () => {
		if (!topic) {
			toast.error('Please select a topic');
			return;
		}
		setState('loading');

		try {
			await new Promise(resolve => setTimeout(resolve, 1500));

			const result = await api.teacher.generateDraft({
				student_name: student.student_name,
				topic,
				score: score,
				attendance,
				class_activity: classActivity,
				teacher_notes: teacherNotes
			});

			let message = result.draft_message || '';
			message = message
				.replace(/\{\{\s*\$json\.body\.student_name\s*\}\}/g, student.student_name)
				.replace(/\{\{\s*\$json\.body\.score\s*\}\}/g, score.toString())
				.replace(/\{\{\s*\$json\.body\.topic\s*\}\}/g, topic);

			setDraftMessage(message);
			setState('review');
		} catch (error) {
			toast.error('Failed to generate draft');
			setState('input');
			console.error(error);
		}
	};

	const handleSendReport = async () => {
		try {
			await api.teacher.sendReport({
				student_id: student.id,
				parent_phone: student.parent_phone,
				topic,
				score: score,
				final_message: draftMessage,
				graded_by: 'Daniel Bowler'
			});

			setState('success');
			toast.success('Report sent successfully');

			setTimeout(() => {
				onOpenChange(false);
				setState('input');
				setScore(3);
				setAttendance(true);
				setDraftMessage('');
				onSuccess?.();
			}, 2000);
		} catch (error) {
			toast.error('Failed to send report');
			console.error(error);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader className="space-y-1.5">
					<DialogTitle className="text-lg font-semibold">
						Create Progress Report: {student.student_name}
					</DialogTitle>
					<DialogDescription className="text-sm">
						{state === 'input' && 'Set attendance and performance score to generate feedback'}
						{state === 'loading' && 'Generating personalized feedback...'}
						{state === 'review' && 'Review and edit the message before sending'}
						{state === 'success' && 'Report successfully delivered'}
					</DialogDescription>
				</DialogHeader>

				{state === 'input' && (
					<div className="space-y-5 py-2">
						{/* Lesson Topic - Full Width */}
						<div className="space-y-2">
							<Label htmlFor="topic" className="text-sm font-medium">
								Lesson Topic
							</Label>
							<Select value={topic} onValueChange={setTopic}>
								<SelectTrigger
									id="topic"
									className="h-10 hover:bg-accent transition-colors cursor-pointer focus:ring-2 focus:ring-ring focus:ring-offset-2"
								>
									<SelectValue placeholder="Select..." />
								</SelectTrigger>
								<SelectContent>
									{syllabusTopics.map((item, index) => (
										<SelectItem
											key={`${item.week}-${index}`}
											value={item.topic}
											className="text-sm cursor-pointer"
										>
											Week {item.week}: {item.topic}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Class Activity */}
						<div className="space-y-2">
							<Label htmlFor="classActivity" className="text-sm font-medium">
								Class Activity <span className="text-muted-foreground font-normal">(optional)</span>
							</Label>
							<Input
								id="classActivity"
								value={classActivity}
								onChange={(e) => setClassActivity(e.target.value)}
								placeholder="e.g. Flashcard memory game, Building a cardboard rocket"
								className="h-10"
							/>
						</div>

						{/* Teacher Notes */}
						<div className="space-y-2">
							<Label htmlFor="teacherNotes" className="text-sm font-medium">
								Teacher Notes <span className="text-muted-foreground font-normal">(optional)</span>
							</Label>
							<Textarea
								id="teacherNotes"
								value={teacherNotes}
								onChange={(e) => setTeacherNotes(e.target.value)}
								placeholder="e.g. Forgot some planet names, used future tense correctly"
								rows={2}
								className="resize-none text-sm"
							/>
						</div>

						{/* Attendance - Full Width */}
						<div className="space-y-2">
							<Label className="text-sm font-medium">
								Attendance
							</Label>
							<div className="flex items-center justify-between h-10 px-3 bg-muted rounded-md border">
								<span className="text-sm font-medium">Present</span>
								<Switch
									checked={attendance}
									onCheckedChange={setAttendance}
								/>
							</div>
						</div>

						{/* Performance Level */}
						<div className="space-y-2.5">
							<Label className="text-sm font-medium">Performance Level</Label>
							<div className="grid grid-cols-3 gap-3">
								{scoreOptions.map((option) => (
									<button
										key={option.value}
										type="button"
										onClick={() => setScore(option.value)}
										className={`
											relative px-3 py-3 text-center rounded-lg border-2 transition-all cursor-pointer
											${score === option.value
												? 'bg-primary text-primary-foreground border-primary font-semibold shadow-md scale-105'
												: 'bg-background hover:bg-accent hover:border-primary/30 border-border font-normal hover:scale-102'
											}
										`}
									>
										<div className="text-lg font-bold leading-none mb-1">{option.value}</div>
										<div className="text-xs leading-tight">{option.label}</div>
									</button>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="flex-1 hover:bg-accent"
							>
								Cancel
							</Button>
							<Button
								type="button"
								onClick={handleGenerateDraft}
								className="flex-1"
							>
								<FileText className="h-4 w-4 mr-2" />
								Generate Report
							</Button>
						</div>
					</div>
				)}

				{state === 'loading' && (
					<div className="py-16 flex flex-col items-center justify-center">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-3" />
						<p className="text-sm text-muted-foreground">Generating feedback...</p>
					</div>
				)}

				{state === 'review' && (
					<div className="space-y-4 py-2">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="message" className="text-sm font-medium">
									Message Preview
								</Label>
								<span className="text-xs text-muted-foreground">
									{draftMessage.length} characters
								</span>
							</div>
							<Textarea
								id="message"
								value={draftMessage}
								onChange={(e) => setDraftMessage(e.target.value)}
								rows={9}
								className="resize-none text-sm leading-relaxed"
							/>
							<div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-md border">
								<AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
								<p className="leading-relaxed">
									This message will be sent via WhatsApp. You can edit before sending.
								</p>
							</div>
						</div>

						<div className="flex gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={() => setState('input')}
								className="flex-1"
							>
								Back
							</Button>
							<Button
								type="button"
								onClick={handleSendReport}
								className="flex-1"
							>
								<Send className="h-4 w-4 mr-2" />
								Send to Parent
							</Button>
						</div>
					</div>
				)}

				{state === 'success' && (
					<div className="py-16 flex flex-col items-center justify-center">
						<div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
							<CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
						</div>
						<p className="text-base font-medium mb-1">Report Sent</p>
						<p className="text-sm text-muted-foreground">WhatsApp message delivered</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
