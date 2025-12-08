'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ManualLeadInputProps {
	onLeadAdded: (lead: { phone_number: string; full_name?: string }) => void;
}

export function ManualLeadInput({ onLeadAdded }: ManualLeadInputProps) {
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
		await new Promise(resolve => setTimeout(resolve, 800));

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
		<Card className="border shadow-sm h-full">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<UserPlus className="h-4 w-4 text-primary" />
					</div>
					<div>
						<CardTitle className="text-base font-semibold">Quick Add</CardTitle>
						<CardDescription className="text-xs">Add new lead manually</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="space-y-1.5">
						<Label htmlFor="phone" className="text-xs font-medium">
							Phone <span className="text-destructive">*</span>
						</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+62 812 3456 7890"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="h-9 text-sm"
						/>
					</div>

					<div className="space-y-1.5">
						<Label htmlFor="name" className="text-xs font-medium">
							Name
						</Label>
						<Input
							id="name"
							type="text"
							placeholder="e.g., Mrs. Indah"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="h-9 text-sm"
						/>
					</div>

					<Button
						type="submit"
						className="w-full h-9 gap-2 text-sm"
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Adding...
							</>
						) : (
							<>
								<Plus className="h-4 w-4" />
								Add Lead
							</>
						)}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
