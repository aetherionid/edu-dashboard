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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const navItems = [
		{ href: '/sales', label: 'Sales', icon: BarChart3 },
		{ href: '/teacher', label: 'Teacher', icon: GraduationCap }
	];

	const handleLogout = () => {
		toast.success('Logged out');
		setTimeout(() => router.push('/login'), 500);
	};

	if (pathname === '/login') return null;

	return (
		<div className="w-60 border-r bg-gradient-to-b from-slate-900 to-slate-950 h-screen p-4 flex flex-col sticky top-0 z-50 relative">
			{/* Logo */}
			<div className="mb-8 flex items-center gap-3 px-2">
				<div className="bg-slate-800 p-1.5 rounded-xl shadow-lg border border-slate-700">
					<Image src="/logo.png" alt="Aetherion" width={32} height={32} className="h-8 w-8" />
				</div>
				<div>
					<span className="font-bold text-white text-lg">Aetherion</span>
					<p className="text-[10px] text-slate-500 uppercase tracking-wider">Dashboard</p>
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
								'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
								isActive
									? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/20'
									: 'text-slate-400 hover:text-white hover:bg-white/5 hover:scale-[1.02] hover:translate-x-0.5'
							)}
						>
							<Icon className="h-4 w-4" />
							<span className="font-medium">{item.label}</span>
						</Link>
					);
				})}
			</nav>

			{/* Profile */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/10 cursor-pointer">
						<div className="h-9 w-9 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-xs font-bold text-white shadow">
							JD
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">John Doe</p>
							<p className="text-xs text-slate-500">Admin</p>
						</div>
						<ChevronUp className="h-4 w-4 text-slate-500" />
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
