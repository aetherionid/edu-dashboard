'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Sparkles, Zap } from 'lucide-react';
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
				return { bg: 'bg-gradient-to-r from-emerald-500 to-green-500', text: 'text-white', ring: 'ring-emerald-500/30' };
			case 'Escalated':
				return { bg: 'bg-gradient-to-r from-rose-500 to-pink-500', text: 'text-white', ring: 'ring-rose-500/30' };
			case 'Warm':
				return { bg: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'text-white', ring: 'ring-amber-500/30' };
			default:
				return { bg: 'bg-slate-500', text: 'text-white', ring: 'ring-slate-500/30' };
		}
	};

	const getAvatarGradient = (name: string) => {
		const gradients = [
			'from-emerald-500 to-green-600',
			'from-blue-500 to-indigo-500',
			'from-emerald-500 to-green-500',
			'from-orange-500 to-rose-500',
			'from-pink-500 to-fuchsia-500',
		];
		const index = name.charCodeAt(0) % gradients.length;
		return gradients[index];
	};

	return (
		<>
			<Card className="flex flex-col h-full overflow-hidden">
				<CardHeader className="pb-3 border-b border-slate-200 dark:border-slate-800">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
								<Zap className="h-5 w-5 text-white" />
							</div>
							<div>
								<CardTitle className="text-lg font-bold">Priority Actions</CardTitle>
								<p className="text-sm text-muted-foreground">{leads.length} leads need attention</p>
							</div>
						</div>
						<Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
					</div>
				</CardHeader>

				<CardContent className="flex-1 overflow-y-auto p-0 min-h-0">
					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						{leads.map((lead) => {
							const status = getStatusConfig(lead.lead_status);
							return (
								<div
									key={lead.id}
									className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
								>
									{/* Avatar */}
									<div className={`h-12 w-12 rounded-full bg-gradient-to-br ${getAvatarGradient(lead.full_name)} flex items-center justify-center text-sm font-bold text-white shadow-lg shrink-0`}>
										{lead.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
									</div>

									{/* Info */}
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-semibold text-sm">{lead.full_name}</span>
											<span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", status.bg, status.text)}>
												{lead.lead_status}
											</span>
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
										className="shrink-0 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-105 hover:shadow-xl"
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
