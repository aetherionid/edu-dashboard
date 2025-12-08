'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { BarChart3, ChevronUp, GraduationCap, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const mounted = true;

	const navItems = [
		{ href: '/sales', label: 'Sales', icon: BarChart3 },
		{ href: '/teacher', label: 'Teacher', icon: GraduationCap }
	];

	const handleLogout = () => {
		toast.success('Logged out');
		setTimeout(() => router.push('/login'), 500);
	};

	if (pathname === '/login') return null;

	// Generate initials from name
	const getInitials = (name: string) => {
		return name.split(' ').map(n => n[0]).join('').toUpperCase();
	};

	return (
		<div className="w-60 border-r bg-background h-screen p-4 flex flex-col sticky top-0 z-50">
			{/* Logo */}
			<div className="mb-8 flex items-center gap-3 px-2">
				<div className="bg-muted p-1.5 rounded-lg border">
					<Image src="/logo.png" alt="Aetherion" width={32} height={32} className="h-8 w-8" />
				</div>
				<div>
					<span className="font-bold text-foreground text-lg">Aetherion</span>
					<p className="text-[10px] text-muted-foreground uppercase tracking-wider">Dashboard</p>
				</div>
			</div>

			{/* Navigation */}
			<nav className="space-y-1 flex-1">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive = pathname?.startsWith(item.href);

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
								isActive
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:text-foreground hover:bg-accent'
							)}
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Profile */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-accent transition-colors text-left border cursor-pointer">
						<div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
							{getInitials('Daniel Bowler')}
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">Daniel Bowler</p>
							<p className="text-xs text-muted-foreground">Admin</p>
						</div>
						<ChevronUp className="h-4 w-4 text-muted-foreground" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" side="top" className="w-48 mb-2">
					<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info('Profile settings')}>
						<User className="mr-2 h-4 w-4" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem className="cursor-pointer" onClick={() => toast.info('Settings')}>
						<Settings className="mr-2 h-4 w-4" />
						Settings
					</DropdownMenuItem>
					{mounted && (
						<DropdownMenuItem className="cursor-pointer" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
							{theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
							{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
						<LogOut className="mr-2 h-4 w-4" />
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
