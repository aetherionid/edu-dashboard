'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, MessageSquare, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChatTranscriptModal } from './ChatTranscriptModal';

interface ChatMessage {
	role: 'customer' | 'agent';
	message: string;
	time: string;
}

export interface Lead {
	id: number;
	full_name: string;
	phone_number: string;
	lead_status: string;
	last_contacted: string;
	ai_summary: string;
	chat_transcript?: ChatMessage[];
}

interface LeadsTableProps {
	leads: Lead[];
	onStatusChange?: (leadId: number, newStatus: string) => void;
}

export function LeadsTable({ leads, onStatusChange }: LeadsTableProps) {
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [chatOpen, setChatOpen] = useState(false);
	const [expandedSummary, setExpandedSummary] = useState<number | null>(null);
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Filter: Only show Hot, Warm, Escalated (hide Cold)
	const filteredLeads = useMemo(() => {
		return leads.filter(lead =>
			['Hot', 'Warm', 'Escalated'].includes(lead.lead_status)
		);
	}, [leads]);

	// Sort by last_contacted
	const sortedLeads = useMemo(() => {
		return [...filteredLeads].sort((a, b) => {
			const dateA = new Date(a.last_contacted).getTime();
			const dateB = new Date(b.last_contacted).getTime();
			return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
		});
	}, [filteredLeads, sortDirection]);

	// Pagination
	const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedLeads = sortedLeads.slice(startIndex, startIndex + itemsPerPage);

	// Reset to page 1 when leads change
	if (currentPage > totalPages && totalPages > 0) {
		setCurrentPage(1);
	}

	const handleRowClick = (lead: Lead) => {
		setSelectedLead(lead);
		setChatOpen(true);
	};

	const handleMessageClick = (e: React.MouseEvent, lead: Lead) => {
		e.stopPropagation();
		setSelectedLead(lead);
		setChatOpen(true);
	};

	const toggleSortDirection = () => {
		setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'Hot':
				return { bg: 'bg-emerald-500', text: 'text-white' };
			case 'Escalated':
				return { bg: 'bg-rose-500', text: 'text-white' };
			case 'Warm':
				return { bg: 'bg-amber-500', text: 'text-white' };
			default:
				return { bg: 'bg-slate-400', text: 'text-white' };
		}
	};

	return (
		<>
			<Card className="overflow-hidden">
				<CardHeader className="pb-4 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-emerald-500/10">
								<Users className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold">Leads Pipeline</CardTitle>
								<p className="text-sm text-muted-foreground">
									{sortedLeads.length} active leads (Hot, Warm, Escalated)
								</p>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b bg-muted/30">
									<th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-24">
										Status
									</th>
									<th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										Name
									</th>
									<th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
										Phone
									</th>
									<th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide max-w-xs">
										AI Summary
									</th>
									<th
										className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer hover:text-foreground transition-colors"
										onClick={toggleSortDirection}
									>
										<div className="flex items-center gap-1">
											Last Active
											{sortDirection === 'desc' ? (
												<ChevronDown className="h-3 w-3" />
											) : (
												<ChevronUp className="h-3 w-3" />
											)}
										</div>
									</th>
									<th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-28">
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{paginatedLeads.map((lead) => {
									const status = getStatusConfig(lead.lead_status);
									const isExpanded = expandedSummary === lead.id;

									return (
										<tr
											key={lead.id}
											onClick={() => handleRowClick(lead)}
											className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors group"
										>
											{/* Status - Dropdown Override */}
											<td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
												<Select
													value={lead.lead_status}
													onValueChange={(value) => {
														if (onStatusChange) {
															onStatusChange(lead.id, value);
														}
													}}
												>
													<SelectTrigger
														className={cn(
															"w-[120px] h-8 text-xs font-medium border-0 rounded-full",
															status.bg,
															status.text,
															"focus:ring-0 focus:ring-offset-0"
														)}
													>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="Hot">
															<span className="flex items-center gap-2">
																<span className="w-2 h-2 rounded-full bg-emerald-500" />
																Hot
															</span>
														</SelectItem>
														<SelectItem value="Warm">
															<span className="flex items-center gap-2">
																<span className="w-2 h-2 rounded-full bg-amber-500" />
																Warm
															</span>
														</SelectItem>
														<SelectItem value="Escalated">
															<span className="flex items-center gap-2">
																<span className="w-2 h-2 rounded-full bg-rose-500" />
																Escalated
															</span>
														</SelectItem>
														<SelectItem value="Cold">
															<span className="flex items-center gap-2">
																<span className="w-2 h-2 rounded-full bg-slate-400" />
																Cold
															</span>
														</SelectItem>
													</SelectContent>
												</Select>
											</td>

											{/* Name */}
											<td className="py-4 px-4">
												<span className="font-bold text-foreground">
													{lead.full_name}
												</span>
											</td>

											{/* Phone */}
											<td className="py-4 px-4">
												<span className="text-sm text-muted-foreground font-mono">
													{lead.phone_number}
												</span>
											</td>

											{/* AI Summary */}
											<td className="py-4 px-4 max-w-xs">
												<p
													className={cn(
														"text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors",
														!isExpanded && "line-clamp-1"
													)}
													onClick={(e) => {
														e.stopPropagation();
														setExpandedSummary(isExpanded ? null : lead.id);
													}}
													title="Click to expand"
												>
													{lead.ai_summary}
												</p>
											</td>

											{/* Last Active */}
											<td className="py-4 px-4">
												<span className="text-sm text-muted-foreground">
													{formatDistanceToNow(new Date(lead.last_contacted), { addSuffix: true })}
												</span>
											</td>

											{/* Action */}
											<td className="py-4 px-4 text-right">
												<Button
													size="sm"
													onClick={(e) => handleMessageClick(e, lead)}
													variant="default"
													className="gap-2"
												>
													<MessageSquare className="h-4 w-4" />
													Message
												</Button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						{sortedLeads.length === 0 && (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">No active leads found</p>
							</div>
						)}
					</div>

					{/* Pagination Controls */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t">
							<div className="text-sm text-muted-foreground">
								Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedLeads.length)} of {sortedLeads.length}
							</div>
							<div className="flex items-center gap-2">
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
									{Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
										let page: number;
										if (totalPages <= 5) {
											page = i + 1;
										} else if (currentPage <= 3) {
											page = i + 1;
										} else if (currentPage >= totalPages - 2) {
											page = totalPages - 4 + i;
										} else {
											page = currentPage - 2 + i;
										}
										return (
											<Button
												key={page}
												variant={currentPage === page ? "default" : "ghost"}
												size="sm"
												onClick={() => setCurrentPage(page)}
												className="w-8 h-8 p-0"
											>
												{page}
											</Button>
										);
									})}
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
						</div>
					)}
				</CardContent>
			</Card>

			{selectedLead && (
				<ChatTranscriptModal
					open={chatOpen}
					onOpenChange={setChatOpen}
					leadName={selectedLead.full_name}
					phoneNumber={selectedLead.phone_number}
					transcript={selectedLead.chat_transcript || []}
				/>
			)}
		</>
	);
}
