'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
	email: string;
	name: string;
	role: 'sales' | 'teacher' | 'admin';
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded users for demo
const DEMO_USERS: Record<string, { password: string; user: User }> = {
	'demo@aetherion.id': {
		password: 'demo123',
		user: { email: 'demo@aetherion.id', name: 'Daniel Bowler', role: 'sales' }
	},
	'teacher@aetherion.id': {
		password: 'teacher123',
		user: { email: 'teacher@aetherion.id', name: 'Sarah Johnson', role: 'teacher' }
	}
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	const pathname = usePathname();

	// Load user from localStorage on mount
	useEffect(() => {
		requestAnimationFrame(() => {
			const storedUser = localStorage.getItem('user');
			if (storedUser) {
				setUser(JSON.parse(storedUser));
			}
			setIsLoading(false);
		});
	}, []);

	// Redirect logic
	useEffect(() => {
		if (!isLoading) {
			const isLoginPage = pathname === '/login';

			if (!user && !isLoginPage) {
				// Not logged in, redirect to login
				router.push('/login');
			} else if (user && isLoginPage) {
				// Logged in but on login page, redirect to dashboard
				const defaultRoute = user.role === 'teacher' ? '/teacher' : '/sales';
				router.push(defaultRoute);
			}
		}
	}, [user, pathname, isLoading, router]);

	const login = async (email: string, password: string): Promise<boolean> => {
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 800));

		const userConfig = DEMO_USERS[email];
		if (userConfig && userConfig.password === password) {
			setUser(userConfig.user);
			localStorage.setItem('user', JSON.stringify(userConfig.user));
			return true;
		}
		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('user');
		router.push('/login');
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
