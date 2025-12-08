'use client';

import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
	const { user, logout } = useAuth();
	const [name, setName] = useState(user?.name || '');
	const [email, setEmail] = useState(user?.email || '');

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const handleSave = () => {
		// In real app, would call API to update profile
		toast.success('Profile updated', {
			description: 'Your profile has been saved successfully'
		});
	};

	return (
		<div className="p-6 space-y-6">
			<DashboardHeader title="Profile" description="Manage your account settings" />

			<div className="max-w-2xl space-y-6">
				{/* Profile Card */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16">
								<AvatarFallback className="bg-primary text-primary-foreground text-lg">
									{getInitials(user?.name || '')}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle>{user?.name}</CardTitle>
								<CardDescription className="capitalize">{user?.role} Account</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Name Field */}
						<div className="space-y-2">
							<Label htmlFor="name">
								<User className="h-4 w-4 inline mr-2" />
								Full Name
							</Label>
							<Input
								id="name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
							/>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<Label htmlFor="email">
								<Mail className="h-4 w-4 inline mr-2" />
								Email Address
							</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="your@email.com"
								disabled
							/>
							<p className="text-xs text-muted-foreground">Email cannot be changed</p>
						</div>

						{/* Role (Read-only) */}
						<div className="space-y-2">
							<Label>Role</Label>
							<Input
								value={user?.role || ''}
								disabled
								className="capitalize"
							/>
						</div>

						{/* Save Button */}
						<div className="flex gap-3 pt-4">
							<Button onClick={handleSave} className="flex-1">
								Save Changes
							</Button>
							<Button variant="outline" onClick={() => {
								setName(user?.name || '');
								setEmail(user?.email || '');
							}}>
								Reset
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Danger Zone */}
				<Card className="border-destructive/50">
					<CardHeader>
						<CardTitle className="text-destructive">Danger Zone</CardTitle>
						<CardDescription>
							Irreversible actions
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="destructive"
							onClick={logout}
							className="gap-2"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
