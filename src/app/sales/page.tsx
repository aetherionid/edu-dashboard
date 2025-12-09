'use client';

import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AIInsights } from '@/components/sales/AIInsights';
import { GrowthGraph } from '@/components/sales/GrowthGraph';
import { LeadsTable } from '@/components/sales/LeadsTable';
import { MetricsGrid } from '@/components/sales/MetricsGrid';
import { QuickAddModal } from '@/components/sales/QuickAddModal';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Lead = {
	id: number;
	full_name: string;
	phone_number: string;
	lead_status: string;
	last_contacted: string;
	ai_summary: string;
	chat_transcript?: { role: 'customer' | 'agent'; message: string; time: string }[];
};

type Metrics = {
	total_leads: number;
	action_required: number;
	hot_pipeline: number;
	valid_invalid_ratio: string;
};

export default function SalesPage() {
	const [leads, setLeads] = useState<Lead[]>([]);
	const [metrics, setMetrics] = useState<Metrics>({
		total_leads: 0,
		action_required: 0,
		hot_pipeline: 0,
		valid_invalid_ratio: '0%'
	});
	const [loading, setLoading] = useState(true);
	const [addModalOpen, setAddModalOpen] = useState(false);

	// Fetch data on mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [metricsData, leadsData] = await Promise.all([
					api.sales.getMetrics(),
					api.sales.getLeads()
				]);

				setMetrics({
					total_leads: Number(metricsData?.total_leads) || 0,
					action_required: Number(metricsData?.action_required) || 0,
					hot_pipeline: Number(metricsData?.hot_pipeline) || 0,
					valid_invalid_ratio: metricsData?.valid_rate || '0%'
				});

				setLeads(Array.isArray(leadsData) ? leadsData : []);
			} catch (error) {
				console.error('Failed to fetch sales data:', error);
				toast.error('Failed to load dashboard data');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleLeadAdded = useCallback(async () => {
		try {
			// Refetch data to get the latest leads and metrics
			const [metricsData, leadsData] = await Promise.all([
				api.sales.getMetrics(),
				api.sales.getLeads()
			]);

			setMetrics({
				total_leads: Number(metricsData?.total_leads) || 0,
				action_required: Number(metricsData?.action_required) || 0,
				hot_pipeline: Number(metricsData?.hot_pipeline) || 0,
				valid_invalid_ratio: metricsData?.valid_rate || '0%'
			});

			setLeads(Array.isArray(leadsData) ? leadsData : []);
		} catch (error) {
			console.error('Failed to refresh data:', error);
			toast.error('Failed to refresh dashboard');
		}
	}, []);

	const handleStatusChange = useCallback(async (leadId: number, newStatus: string) => {
		const lead = leads.find(l => l.id === leadId);
		if (!lead) return;

		const oldStatus = lead.lead_status;

		// Optimistic update
		setLeads(prev => prev.map(l =>
			l.id === leadId ? { ...l, lead_status: newStatus } : l
		));

		// Update metrics
		setMetrics(prev => {
			let hotChange = 0;
			if (oldStatus === 'Hot') hotChange -= 1;
			if (newStatus === 'Hot') hotChange += 1;

			return {
				...prev,
				hot_pipeline: prev.hot_pipeline + hotChange
			};
		});

		try {
			await api.sales.updateLeadStatus(leadId, newStatus);
		} catch (error) {
			console.error('Failed to update status:', error);
			toast.error('Failed to update status');
			// Revert on error
			setLeads(prev => prev.map(l =>
				l.id === leadId ? { ...l, lead_status: oldStatus } : l
			));
		}
	}, [leads]);

	if (loading) {
		return <div className="flex h-screen items-center justify-center">Loading dashboard...</div>;
	}

	return (
		<div className="min-h-screen bg-background">
			<DashboardHeader
				title="Sales Command Center"
				description="Monitor and manage your leads pipeline"
				action={
					<Button onClick={() => setAddModalOpen(true)} className="gap-2 shadow-sm">
						<Plus className="h-4 w-4" />
						Add Lead
					</Button>
				}
			/>

			<div className="max-w-7xl mx-auto px-8 py-6 space-y-6">
				{/* Metrics - Full Width Row */}
				<MetricsGrid metrics={metrics} />

				{/* Leads Table - Full Width */}
				<LeadsTable leads={leads} onStatusChange={handleStatusChange} />

				{/* Two Column Layout: Graph + AI Insights */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<GrowthGraph />
					<AIInsights />
				</div>
			</div>

			<QuickAddModal
				open={addModalOpen}
				onOpenChange={setAddModalOpen}
				onLeadAdded={handleLeadAdded}
			/>
		</div>
	);
}

