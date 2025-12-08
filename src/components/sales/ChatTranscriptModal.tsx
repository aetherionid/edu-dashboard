'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Bot, Loader2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatMessage {
	role: 'customer' | 'agent';
	message: string;
	time: string;
}

interface ChatTranscriptModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	leadName: string;
	phoneNumber: string;
	// transcript prop is no longer needed as primary source, but keeping optional for backward compat if needed
	transcript?: ChatMessage[];
}

export function ChatTranscriptModal({
	open,
	onOpenChange,
	leadName,
	phoneNumber,
	transcript: initialTranscript = []
}: ChatTranscriptModalProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(initialTranscript);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (open && phoneNumber) {
			const fetchTranscript = async () => {
				setLoading(true);
				try {
					const data = await api.sales.getChatTranscript(phoneNumber);
					// Adapt the specific message format if necessary, assuming API returns { role, message, time }
					// If API returns raw n8n format (just text or diverse JSON), we might need parsing.
					// For now, assuming the API returns array of ChatMessage matches the type.
					// Based on seed: message is JSONB {"type": "human/ai", "content": "..."}
					// Based on api.ts: returns Array

					// We need to map the DB structure (if it's raw) to UI structure
					// DB: { type: "human" | "ai", content: "..." }
					// UI: { role: "customer" | "agent", message: "...", time: "..." }

					// Checking typical n8n response from my previous edit:
					// "={{ $items().map(i => i.json.message) }}" -> array of objects

					const formattedMessages = data.map((msg: any) => ({
						role: msg.type === 'human' ? 'customer' : 'agent',
						message: msg.content,
						time: new Date().toISOString() // API doesn't seem to return time in the map yet, or we need to fetch it.
						// defined in seed: created_at is in table, but n8n only selects 'message' column jsonb.
					}));
					setMessages(formattedMessages);
				} catch (error) {
					console.error('Failed to fetch transcript:', error);
				} finally {
					setLoading(false);
				}
			};

			fetchTranscript();
		}
	}, [open, phoneNumber]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
				<DialogHeader className="pb-4 border-b">
					<div className="flex items-center justify-between">
						<div>
							<DialogTitle>{leadName}</DialogTitle>
							<DialogDescription className="font-mono text-xs">
								{phoneNumber}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[300px]">
					{loading ? (
						<div className="flex h-full items-center justify-center">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : messages.length === 0 ? (
						<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
							No chat history found.
						</div>
					) : (
						messages.map((msg, idx) => (
							<div
								key={idx}
								className={cn(
									"flex gap-3",
									msg.role === 'agent' && "flex-row-reverse"
								)}
							>
								{/* Avatar */}
								<div className={cn(
									"h-8 w-8 rounded-full flex items-center justify-center shrink-0",
									msg.role === 'customer'
										? "bg-slate-100 text-slate-600"
										: "bg-primary/10 text-primary"
								)}>
									{msg.role === 'customer' ? (
										<User className="h-4 w-4" />
									) : (
										<Bot className="h-4 w-4" />
									)}
								</div>

								{/* Message Bubble */}
								<div className={cn(
									"max-w-[75%] rounded-2xl px-4 py-2",
									msg.role === 'customer'
										? "bg-muted rounded-tl-sm"
										: "bg-primary text-primary-foreground rounded-tr-sm"
								)}>
									<p className="text-sm">{msg.message}</p>
									{/* Time suppressed for now as API doesn't return it yet, or use generic fallback */}
								</div>
							</div>
						))
					)}
				</div>

				{/* Quick Reply Footer */}
				<div className="border-t pt-4">
					<p className="text-xs text-muted-foreground text-center">
						This is a read-only transcript. Use WhatsApp to continue the conversation.
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
