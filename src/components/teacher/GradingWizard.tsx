'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { CheckCircle, Loader2, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
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
	const [score, setScore] = useState([3]);
	const [attendance, setAttendance] = useState(true);
	const [draftMessage, setDraftMessage] = useState('');
	const topic = 'Present Simple & Verbs'; // Hardcoded per requirements

	const getScoreLabel = (value: number) => {
		switch (value) {
			case 1: return 'Needs Help';
			case 2: return 'Improving';
			case 3: return 'Good Progress';
			case 4: return 'Very Good';
			case 5: return 'Excellent';
			default: return 'Good Progress';
		}
	};

	const handleGenerateDraft = async () => {
		setState('loading');

		try {
			// Simulate loading for demo effect
			await new Promise(resolve => setTimeout(resolve, 1500));

			const result = await api.teacher.generateDraft({
				student_name: student.student_name,
				topic,
				score: score[0],
				attendance
			});

			setDraftMessage(result.draft_message);
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
				parent_phone: '+6281234567890', // Mock for demo
				topic,
				score: score[0],
				final_message: draftMessage,
				graded_by: 'Ms. Sarah'
			});

			setState('success');
			toast.success('Report sent successfully!');

			// Auto-close and reset after 2 seconds
			setTimeout(() => {
				onOpenChange(false);
				setState('input');
				setScore([3]);
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
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Grade {student.student_name}</DialogTitle>
					<DialogDescription>
						{state === 'input' && 'Set attendance and performance score'}
						{state === 'loading' && 'Generating personalized feedback...'}
						{state === 'review' && 'Review and edit the message before sending'}
						{state === 'success' && 'Report sent successfully!'}
					</DialogDescription>
				</DialogHeader>

				{state === 'input' && (
					<div className="space-y-6 py-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Topic</Label>
							<div className="p-3 bg-muted rounded-lg text-sm">
								{topic}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="attendance">Attendance</Label>
							<Switch
								id="attendance"
								checked={attendance}
								onCheckedChange={setAttendance}
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Label>Performance Score</Label>
								<span className="text-sm font-medium">{getScoreLabel(score[0])}</span>
							</div>
							<Slider
								value={score}
								onValueChange={setScore}
								min={1}
								max={5}
								step={1}
								className="w-full"
							/>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>1</span>
								<span>2</span>
								<span>3</span>
								<span>4</span>
								<span>5</span>
							</div>
						</div>

						<Button onClick={handleGenerateDraft} className="w-full">
							<Sparkles className="h-4 w-4 mr-2" />
							Draft Report with AI
						</Button>
					</div>
				)}

				{state === 'loading' && (
					<div className="py-12 flex flex-col items-center justify-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">Analyzing syllabus and drafting feedback...</p>
					</div>
				)}

				{state === 'review' && (
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Message Preview</Label>
							<Textarea
								value={draftMessage}
								onChange={(e) => setDraftMessage(e.target.value)}
								rows={6}
								className="resize-none"
							/>
							<p className="text-xs text-muted-foreground">
								Feel free to edit the message before sending
							</p>
						</div>

						<Button onClick={handleSendReport} className="w-full">
							<Send className="h-4 w-4 mr-2" />
							Send to Parent
						</Button>
					</div>
				)}

				{state === 'success' && (
					<div className="py-12 flex flex-col items-center justify-center space-y-4">
						<div className="rounded-full bg-green-100 p-3">
							<CheckCircle className="h-12 w-12 text-green-600" />
						</div>
						<p className="text-lg font-medium">Report Sent!</p>
						<p className="text-sm text-muted-foreground">WhatsApp message delivered to parent</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
