'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QuickAddModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onLeadAdded: (lead: { phone_number: string; full_name?: string }) => void;
}

export function QuickAddModal({ open, onOpenChange, onLeadAdded }: QuickAddModalProps) {
	const [phone, setPhone] = useState('');
	const [name, setName] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!phone.trim()) {
			toast.error('Phone number is required');
			return;
		}

		setIsLoading(true);

		// Simulate API delay
		await new Promise(resolve => setTimeout(resolve, 600));

		onLeadAdded({
			phone_number: phone,
			full_name: name || undefined
		});

		toast.success('Lead added successfully!', {
			description: `${name || phone} has been added to the pipeline.`
		});

		setPhone('');
		setName('');
		setIsLoading(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-lg bg-primary/10">
							<UserPlus className="h-5 w-5 text-primary" />
						</div>
						<div>
							<DialogTitle>Add New Lead</DialogTitle>
							<DialogDescription>
								Manually add a lead to the sales pipeline.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="phone">
							Phone Number <span className="text-destructive">*</span>
						</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+62 812 3456 7890"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							autoFocus
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">
							Name <span className="text-muted-foreground text-xs">(optional)</span>
						</Label>
						<Input
							id="name"
							type="text"
							placeholder="e.g., Mrs. Indah"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<DialogFooter className="gap-2 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Adding...
								</>
							) : (
								'Add Lead'
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
