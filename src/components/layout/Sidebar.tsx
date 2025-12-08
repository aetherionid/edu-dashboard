'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { BarChart3, ChevronUp, GraduationCap, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const { user, logout } = useAuth();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		requestAnimationFrame(() => setMounted(true));
	}, []);

	const navItems = [
		{ href: '/sales', label: 'Sales', icon: BarChart3 },
		{ href: '/teacher', label: 'Teacher', icon: GraduationCap },
	];

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	const handleProfile = () => {
		router.push('/profile');
	};

	// Hide sidebar on login page
	if (pathname === '/login') {
		return null;
	}

	return (
		<aside className="w-64 border-r bg-card flex flex-col relative z-50 shrink-0">
			{/* Logo */}
			<div className="p-4 border-b bg-card">
				<Link href="/" className="flex items-center gap-2">
					<div className="relative h-8 w-8">
						<Image
							src="/logo.png"
							alt="Aetherion"
							fill
							className="object-contain"
							priority
						/>
					</div>
					<div>
						<h1 className="font-bold text-lg">Aetherion</h1>
						<p className="text-xs text-muted-foreground">DASHBOARD</p>
					</div>
				</Link>
			</div>

			{/* Navigation */}
			<nav className="flex-1 p-3 space-y-1">
				{navItems.map(item => {
					const Icon = item.icon;
					const isActive = pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
								isActive
									? 'bg-primary text-primary-foreground'
									: 'hover:bg-accent'
							)}
						>
							<Icon className="h-4 w-4" />
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Profile */}
			<div className="p-3 border-t">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left border cursor-pointer">
							<div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
								{getInitials(user?.name || 'User')}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
								<p className="text-xs text-muted-foreground capitalize">{user?.role || 'User'}</p>
							</div>
							<ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" side="top" className="w-48 mb-2">
						<DropdownMenuItem className="cursor-pointer" onClick={handleProfile}>
							<User className="mr-2 h-4 w-4" />
							Profile
						</DropdownMenuItem>
						<DropdownMenuItem className="cursor-pointer" onClick={handleProfile}>
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
						<DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</aside>
	);
}
