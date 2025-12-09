'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { Loader2, Plus, Users, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface LeadEntry {
	id: string;
	phone: string;
	name: string;
	remarks: string;
}

interface QuickAddModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onLeadAdded: () => void;
}

export function QuickAddModal({ open, onOpenChange, onLeadAdded }: QuickAddModalProps) {
	const [leads, setLeads] = useState<LeadEntry[]>([
		{ id: crypto.randomUUID(), phone: '', name: '', remarks: '' }
	]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddLead = () => {
		setLeads([...leads, { id: crypto.randomUUID(), phone: '', name: '', remarks: '' }]);
	};

	const handleRemoveLead = (id: string) => {
		if (leads.length === 1) {
			toast.error('At least one lead required');
			return;
		}
		setLeads(leads.filter(lead => lead.id !== id));
	};

	const handleUpdateLead = (id: string, field: keyof LeadEntry, value: string) => {
		setLeads(leads.map(lead =>
			lead.id === id ? { ...lead, [field]: value } : lead
		));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validLeads = leads.filter(lead => lead.phone.trim() !== '');

		if (validLeads.length === 0) {
			toast.error('Enter at least one phone number');
			return;
		}

		// Check duplicates
		const phones = validLeads.map(l => l.phone.trim());
		const duplicates = phones.filter((phone, index) => phones.indexOf(phone) !== index);
		if (duplicates.length > 0) {
			toast.error('Duplicate phone detected', {
				description: duplicates[0]
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Batch create all leads in a single API call
			await api.sales.createLeads(
				validLeads.map(lead => ({
					phone_number: lead.phone.trim(),
					full_name: lead.name.trim() || undefined,
					remarks: lead.remarks.trim() || undefined
				}))
			);

			toast.success(`${validLeads.length} lead(s) added`, {
				description: 'Successfully added to pipeline'
			});

			setLeads([{ id: crypto.randomUUID(), phone: '', name: '', remarks: '' }]);
			onLeadAdded();
			onOpenChange(false);
		} catch (error) {
			console.error('Error adding leads:', error);
			toast.error('Failed to add leads');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setLeads([{ id: crypto.randomUUID(), phone: '', name: '', remarks: '' }]);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
							<Users className="h-5 w-5 text-emerald-600" />
						</div>
						<div>
							<DialogTitle className="text-xl">Add Leads</DialogTitle>
							<DialogDescription>
								Add one or multiple leads to your pipeline
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
					{/* Scrollable leads container */}
					<div className="flex-1 overflow-y-auto pr-2 space-y-3 py-2">
						{leads.map((lead, index) => (
							<div
								key={lead.id}
								className="border rounded-xl p-4 bg-muted/30 hover:bg-muted/50 transition-colors relative"
							>
								{/* Remove button */}
								{leads.length > 1 && (
									<button
										type="button"
										onClick={() => handleRemoveLead(lead.id)}
										className="absolute top-3 right-3 h-6 w-6 rounded-full bg-background border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors"
										aria-label="Remove"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}

								{/* Lead number badge */}
								<div className="flex items-center gap-2 mb-4">
									<div className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
										{index + 1}
									</div>
									<span className="text-sm font-semibold text-muted-foreground">Lead Entry</span>
								</div>

								<div className="grid grid-cols-2 gap-3">
									{/* Phone */}
									<div className="space-y-1.5">
										<Label htmlFor={`phone-${lead.id}`} className="text-xs font-medium">
											Phone Number <span className="text-destructive">*</span>
										</Label>
										<Input
											id={`phone-${lead.id}`}
											type="tel"
											placeholder="+62 812 3456 7890"
											value={lead.phone}
											onChange={(e) => handleUpdateLead(lead.id, 'phone', e.target.value)}
											className="h-9"
											required
										/>
									</div>

									{/* Name */}
									<div className="space-y-1.5">
										<Label htmlFor={`name-${lead.id}`} className="text-xs font-medium">
											Full Name <span className="text-xs text-muted-foreground">(Optional)</span>
										</Label>
										<Input
											id={`name-${lead.id}`}
											placeholder="John Doe"
											value={lead.name}
											onChange={(e) => handleUpdateLead(lead.id, 'name', e.target.value)}
											className="h-9"
										/>
									</div>
								</div>

								{/* Remarks */}
								<div className="space-y-1.5 mt-3">
									<Label htmlFor={`remarks-${lead.id}`} className="text-xs font-medium">
										Remarks <span className="text-xs text-muted-foreground">(Optional)</span>
									</Label>
									<Textarea
										id={`remarks-${lead.id}`}
										placeholder="Additional notes or context..."
										value={lead.remarks}
										onChange={(e) => handleUpdateLead(lead.id, 'remarks', e.target.value)}
										className="resize-none h-16 text-sm"
									/>
								</div>
							</div>
						))}
					</div>

					{/* Fixed bottom section */}
					<div className="pt-4 border-t space-y-3 mt-2">
						{/* Add Another Button */}
						<Button
							type="button"
							variant="outline"
							onClick={handleAddLead}
							className="w-full border-dashed"
							disabled={isSubmitting}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Another Lead
						</Button>

						{/* Action Buttons */}
						<div className="flex gap-2">
							<Button
								type="button"
								variant="outline"
								onClick={handleCancel}
								disabled={isSubmitting}
								className="flex-1"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={isSubmitting}
								className="flex-1"
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Adding...
									</>
								) : (
									<>
										<Users className="mr-2 h-4 w-4" />
										Add {leads.filter(l => l.phone.trim()).length || 0} Lead{leads.filter(l => l.phone.trim()).length !== 1 ? 's' : ''}
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
