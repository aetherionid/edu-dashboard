'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { useState } from 'react';
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

interface ActionTableProps {
	leads: Lead[];
}

export function ActionTable({ leads }: ActionTableProps) {
	const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
	const [chatOpen, setChatOpen] = useState(false);

	const handleChatClick = (lead: Lead) => {
		setSelectedLead(lead);
		setChatOpen(true);
	};

	const getStatusConfig = (status: string) => {
		switch (status) {
			case 'Hot':
				return {
					variant: 'default' as const,
					className: 'bg-emerald-500 hover:bg-emerald-600 text-white'
				};
			case 'Escalated':
				return {
					variant: 'destructive' as const,
					className: ''
				};
			case 'Warm':
				return {
					variant: 'secondary' as const,
					className: 'bg-orange-500 hover:bg-orange-600 text-white'
				};
			default:
				return {
					variant: 'secondary' as const,
					className: ''
				};
		}
	};

	const getAvatarColor = (name: string) => {
		const colors = [
			'bg-emerald-600',
			'bg-blue-600',
			'bg-indigo-600',
			'bg-orange-600',
			'bg-pink-600',
		];
		const index = name.charCodeAt(0) % colors.length;
		return colors[index];
	};

	return (
		<>
			<Card className="flex flex-col h-full overflow-hidden">
				<CardHeader className="pb-3 border-b">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
								<AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold">Priority Actions</CardTitle>
								<p className="text-sm text-muted-foreground">{leads.length} leads need attention</p>
							</div>
						</div>
					</div>
				</CardHeader>

				<CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
					<div className="divide-y">
						{leads.map((lead) => {
							const status = getStatusConfig(lead.lead_status);
							return (
								<div
									key={lead.id}
									className="flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors cursor-pointer"
								>
									{/* Avatar */}
									<div className={`h-12 w-12 rounded-full ${getAvatarColor(lead.full_name)} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
										{lead.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
									</div>

									{/* Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold text-sm">{lead.full_name}</span>
											<Badge
												variant={status.variant}
												className={cn("text-[10px]", status.className)}
											>
												{lead.lead_status}
											</Badge>
										</div>
										<p className="text-xs text-muted-foreground mb-1">
											{lead.phone_number} • {formatDistanceToNow(new Date(lead.last_contacted), { addSuffix: true })}
										</p>
										<p className="text-xs text-muted-foreground/80 line-clamp-1 italic">
											&ldquo;{lead.ai_summary}&rdquo;
										</p>
									</div>

									{/* Action */}
									<Button
										size="sm"
										onClick={() => handleChatClick(lead)}
										variant="default"
									>
										<MessageSquare className="h-4 w-4 mr-1" />
										Chat
									</Button>
								</div>
							);
						})}
					</div>
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
