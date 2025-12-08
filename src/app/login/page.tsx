'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [remember, setRemember] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !password) {
			setError('Please enter email and password');
			return;
		}

		setIsLoading(true);

		const success = await login(email, password);

		if (!success) {
			setError('Invalid credentials. Try demo@aetherion.id / demo123');
			setIsLoading(false);
		}
		// On success, AuthContext will handle redirect
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none" />

			<div className="relative w-full max-w-md">
				{/* Logo */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-3 mb-4">
						<div className="bg-slate-800 p-2 rounded-2xl shadow-lg border border-slate-700">
							<Image src="/logo.png" alt="Aetherion" width={40} height={40} className="h-10 w-10" />
						</div>
					</div>
					<h1 className="text-3xl font-bold text-white mb-2">Aetherion</h1>
					<p className="text-slate-400">Internal Dashboard</p>
				</div>

				{/* Login Card */}
				<Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
					<CardHeader className="text-center pb-2">
						<CardTitle className="text-xl text-white">Welcome back</CardTitle>
						<CardDescription className="text-slate-400">
							Sign in to access your dashboard
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							{error && (
								<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
									{error}
								</div>
							)}

							<div className="space-y-2">
								<Label htmlFor="email" className="text-slate-300">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="demo@aetherion.id"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-slate-300">Password</Label>
								<Input
									id="password"
									type="password"
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
								/>
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Checkbox
										id="remember"
										checked={remember}
										onCheckedChange={(checked) => setRemember(checked as boolean)}
										className="border-slate-600 data-[state=checked]:bg-emerald-600"
									/>
									<Label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
										Remember me
									</Label>
								</div>
								<button
									type="button"
									className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
									onClick={() => toast.info('Password reset coming soon', { description: 'Contact admin for help.' })}
								>
									Forgot password?
								</button>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-500/25"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Signing in...
									</>
								) : (
									'Sign in'
								)}
							</Button>

							{/* Demo Hint */}
							<div className="text-center pt-4 border-t border-slate-700">
								<p className="text-xs text-slate-500 mb-2">Demo credentials:</p>
								<code className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg text-slate-400">
									demo@aetherion.id / demo123
								</code>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* Footer */}
				<p className="text-center text-slate-500 text-xs mt-6">
					© 2025 Aetherion. All rights reserved.
				</p>
			</div>
		</div>
	);
}
