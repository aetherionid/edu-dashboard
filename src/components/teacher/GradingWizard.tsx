'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
	const [syllabusTopics, setSyllabusTopics] = useState<{ week: number; topic: string }[]>([]);

	useEffect(() => {
		if (open) {
			setState('input');
			setScore(3);
			setAttendance(true);
			setDraftMessage('');

			const fetchSyllabus = async () => {
				try {
					const data = await api.teacher.getSyllabus();
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
		}
	}, [open]);

	const scoreLabels = ['Needs Support', 'Developing', 'Proficient', 'Advanced', 'Exceptional'];
	const scoreColors = [
		'bg-red-50 hover:bg-red-100 border-red-200 text-red-900 dark:bg-red-950/50 dark:hover:bg-red-950 dark:border-red-800 dark:text-red-100',
		'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900 dark:bg-orange-950/50 dark:hover:bg-orange-950 dark:border-orange-800 dark:text-orange-100',
		'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:hover:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
		'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:hover:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-100',
		'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900 dark:bg-purple-950/50 dark:hover:bg-purple-950 dark:border-purple-800 dark:text-purple-100',
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
				attendance
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
				parent_phone: '+6281234567890',
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
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle className="text-xl">
						Create Progress Report: {student.student_name}
					</DialogTitle>
				</DialogHeader>

				{state === 'input' && (
					<div className="space-y-6 py-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="topic" className="text-sm font-medium">
									Lesson Topic
								</Label>
								<Select value={topic} onValueChange={setTopic}>
									<SelectTrigger id="topic">
										<SelectValue placeholder="Select topic..." />
									</SelectTrigger>
									<SelectContent>
										{syllabusTopics.map((item) => (
											<SelectItem key={item.week} value={item.topic}>
												Week {item.week}: {item.topic}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="attendance" className="text-sm font-medium">
									Attendance
								</Label>
								<div className="flex items-center h-10 px-3 bg-muted rounded-md">
									<span className="text-sm mr-3">Present</span>
									<Switch
										id="attendance"
										checked={attendance}
										onCheckedChange={setAttendance}
									/>
								</div>
							</div>
						</div>

						<div className="space-y-3">
							<Label className="text-sm font-medium">Performance Level</Label>
							<div className="grid grid-cols-5 gap-2">
								{[1, 2, 3, 4, 5].map((value) => (
									<button
										key={value}
										onClick={() => setScore(value)}
										className={`
											px-3 py-2.5 text-sm font-medium rounded-md border transition-colors
											${score === value
												? scoreColors[value - 1] + ' ring-2 ring-offset-2 ring-offset-background ring-primary/20'
												: 'bg-background hover:bg-muted border-border'
											}
										`}
									>
										<div className="font-semibold mb-0.5">{value}</div>
										<div className="text-xs opacity-80">{scoreLabels[value - 1]}</div>
									</button>
								))}
							</div>
							<p className="text-xs text-muted-foreground">
								Select a performance level to generate appropriate feedback
							</p>
						</div>

						<div className="flex gap-2 pt-2">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
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
					<div className="py-12 flex flex-col items-center justify-center">
						<Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
						<p className="text-sm text-muted-foreground">Generating feedback...</p>
					</div>
				)}

				{state === 'review' && (
					<div className="space-y-4 py-4">
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
								rows={10}
								className="resize-none font-sans"
							/>
							<div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
								<AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
								<p>This message will be sent via WhatsApp to the parent. You can edit it before sending.</p>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								variant="outline"
								onClick={() => setState('input')}
								className="flex-1"
							>
								Back
							</Button>
							<Button
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
					<div className="py-12 flex flex-col items-center justify-center">
						<div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
							<CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-500" />
						</div>
						<p className="text-lg font-medium mb-1">Report Sent</p>
						<p className="text-sm text-muted-foreground">WhatsApp message delivered</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
