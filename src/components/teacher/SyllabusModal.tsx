'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Circle, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface SyllabusObjective {
	id: number;
	week: number;
	topic: string;
	learningObjectives: string[];
	completed: boolean;
	feedbackTemplates: {
		score: number;
		label: string;
		template: string;
	}[];
}

interface SyllabusModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SyllabusModal({ open, onOpenChange }: SyllabusModalProps) {
	const [syllabusData, setSyllabusData] = useState<SyllabusObjective[]>([]);
	const [loading, setLoading] = useState(false);
	const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

	useEffect(() => {
		if (open) {
			fetchSyllabus();
		}
	}, [open]);

	const fetchSyllabus = async () => {
		setLoading(true);
		try {
			const data = await api.teacher.getSyllabus();
			// Map API response (snake_case) to component type (camelCase)
			const formatted: SyllabusObjective[] = (Array.isArray(data) ? data : []).map((item: any) => ({
				id: item.id,
				week: item.week,
				topic: item.topic,
				learningObjectives: item.learning_objectives || [],
				completed: item.completed,
				feedbackTemplates: item.feedback_templates || []
			}));
			// Sort by week just in case
			formatted.sort((a, b) => a.week - b.week);
			setSyllabusData(formatted);
		} catch (error) {
			console.error('Failed to fetch syllabus:', error);
			toast.error('Failed to load syllabus');
		} finally {
			setLoading(false);
		}
	};

	const completedCount = syllabusData.filter(s => s.completed).length;
	const currentWeek = syllabusData.find(s => !s.completed)?.week || syllabusData.length;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
				<DialogHeader className="pb-4 border-b">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-emerald-500/10">
							<BookOpen className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<DialogTitle className="text-xl">Course Syllabus</DialogTitle>
							<DialogDescription>
								Primary A - English Foundations • {completedCount}/{syllabusData.length} weeks completed
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto py-4 space-y-3 max-h-[500px]">
					{loading ? (
						<div className="text-center py-8 text-muted-foreground">Loading syllabus...</div>
					) : (
						syllabusData.map((item) => {
							const isExpanded = expandedWeek === item.id;
							const isCurrent = item.week === currentWeek && !item.completed;

							return (
								<div
									key={item.id}
									className={cn(
										"rounded-xl border transition-all",
										item.completed
											? "bg-muted/30 border-transparent"
											: isCurrent
												? "bg-emerald-500/5 border-emerald-500/20 ring-1 ring-emerald-500/20"
												: "bg-card border-border"
									)}
								>
									{/* Header - Always visible */}
									<div
										className="flex items-start gap-3 p-4 cursor-pointer"
										onClick={() => setExpandedWeek(isExpanded ? null : item.id)}
									>
										<div className={cn(
											"mt-0.5 p-1 rounded-full",
											item.completed ? "bg-emerald-500" : "bg-muted"
										)}>
											{item.completed ? (
												<CheckCircle2 className="h-4 w-4 text-white" />
											) : (
												<Circle className="h-4 w-4 text-muted-foreground" />
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<span className="text-xs font-medium text-muted-foreground">
													Week {item.week}
												</span>
												{isCurrent && (
													<Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700 border-emerald-200">
														Current
													</Badge>
												)}
											</div>
											<h4 className={cn(
												"font-semibold",
												item.completed && "text-muted-foreground"
											)}>
												{item.topic}
											</h4>
											<ul className="mt-2 space-y-1">
												{item.learningObjectives.map((obj, idx) => (
													<li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
														<span className="text-emerald-500 mt-1">•</span>
														{obj}
													</li>
												))}
											</ul>
										</div>
										<Button variant="ghost" size="sm" className="shrink-0">
											{isExpanded ? (
												<ChevronUp className="h-4 w-4" />
											) : (
												<ChevronDown className="h-4 w-4" />
											)}
										</Button>
									</div>

									{/* Templates - Collapsible */}
									{isExpanded && (
										<div className="px-4 pb-4 pt-2 border-t border-dashed space-y-2">
											<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
												Feedback Templates
											</p>
											{item.feedbackTemplates.map((template) => (
												<div
													key={template.score}
													className="p-3 rounded-lg bg-muted/50"
												>
													<div className="flex items-center gap-2 mb-1">
														<Badge
															variant="outline"
															className={cn(
																"text-xs",
																template.score === 1 && "bg-rose-50 text-rose-700 border-rose-200",
																template.score === 3 && "bg-amber-50 text-amber-700 border-amber-200",
																template.score === 5 && "bg-emerald-50 text-emerald-700 border-emerald-200"
															)}
														>
															Score {template.score}: {template.label}
														</Badge>
													</div>
													<div className="flex items-start gap-2">
														<MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
														<p className="text-sm text-muted-foreground italic">
															"{template.template}"
														</p>
													</div>
												</div>
											))}
										</div>
									)}
								</div>
							);
						})
					)}
				</div>

				<div className="border-t pt-4 flex justify-end">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
