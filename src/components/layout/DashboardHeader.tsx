'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Bell, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface DashboardHeaderProps {
	title: string;
	description: string;
	action?: React.ReactNode;
}

const notifications = [
	{ id: 1, title: 'New lead from WhatsApp', time: '2 min ago', unread: true },
	{ id: 2, title: 'Budi Santoso - payment escalated', time: '1 hour ago', unread: true },
	{ id: 3, title: 'Report sent to Mrs. Indah', time: '3 hours ago', unread: false },
];

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
	const { theme, setTheme } = useTheme();
	const mounted = true;

	const unreadCount = notifications.filter(n => n.unread).length;

	return (
		<div className="border-b bg-background sticky top-0 z-20">
			<div className="max-w-7xl mx-auto px-6 py-4">
				<div className="flex items-center justify-between gap-4">
					{/* Left: Title */}
					<div className="min-w-0">
						<h1 className="text-lg font-semibold">{title}</h1>
						<p className="text-sm text-muted-foreground">{description}</p>
					</div>

					{/* Right: Actions */}
					<div className="flex items-center gap-1">
						{/* Search */}
						<div className="relative hidden md:block">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search..."
								className="pl-9 w-52 h-9"
							/>
						</div>

						{/* Notifications */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="relative">
									<Bell className="h-4 w-4" />
									{unreadCount > 0 && (
										<span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
											{unreadCount}
										</span>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-72">
								<div className="px-3 py-2 border-b">
									<p className="font-medium text-sm">Notifications</p>
								</div>
								{notifications.map(notif => (
									<DropdownMenuItem key={notif.id} className="flex items-start gap-3 p-3 cursor-pointer">
										{notif.unread && (
											<span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
										)}
										<div className={notif.unread ? '' : 'ml-5'}>
											<p className="text-sm">{notif.title}</p>
											<p className="text-xs text-muted-foreground">{notif.time}</p>
										</div>
									</DropdownMenuItem>
								))}
								<div className="px-3 py-2 border-t">
									<Button
										variant="ghost"
										size="sm"
										className="w-full text-xs h-8"
										onClick={() => toast.info('Notifications center coming soon')}
									>
										View all
									</Button>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Theme Toggle */}
						{mounted && (
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							>
								{theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
							</Button>
						)}

						{/* Primary Action */}
						{action}
					</div>
				</div>
			</div>
		</div>
	);
}
