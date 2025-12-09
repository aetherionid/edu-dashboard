// API Client for n8n webhooks
// API Client for n8n webhooks
const API_BASE = process.env.NEXT_PUBLIC_N8N_BASE_URL || 'https://n8n.aetherion.services/webhook/aetherion';

// Helper for dynamic dates
const getRelativeDate = (hoursAgo: number) => {
	const date = new Date();
	date.setHours(date.getHours() - hoursAgo);
	return date.toISOString();
};

export const api = {
	sales: {
		getMetrics: async () => {
			const res = await fetch(`${API_BASE}/metrics`);
			if (!res.ok) throw new Error('Failed to fetch metrics');

			const text = await res.text();
			if (!text) return null;

			try {
				const data = JSON.parse(text);
				// n8n returns an array, take the first item
				return Array.isArray(data) ? data[0] : data;
			} catch (e) {
				console.warn('Failed to parse metrics JSON:', e);
				return null;
			}
		},

		getLeads: async () => {
			// Status filtering is currently handled in the SQL query for 'hot,warm,escalated'
			const res = await fetch(`${API_BASE}/leads`);
			if (!res.ok) throw new Error('Failed to fetch leads');

			const text = await res.text();
			if (!text) return [];

			try {
				const data = JSON.parse(text);
				return Array.isArray(data) ? data : [];
			} catch (e) {
				console.warn('Failed to parse leads JSON:', e);
				return [];
			}
		},

		getChatTranscript: async (phone: string) => {
			// Clean phone number (remove +)
			const cleanPhone = phone.replace('+', '');
			const res = await fetch(`${API_BASE}/chat-transcript?phone=${cleanPhone}`);
			if (!res.ok) throw new Error('Failed to fetch chat transcript');

			// Handle potential empty response (e.g., if no chat history found)
			const text = await res.text();
			if (!text) return [];

			try {
				const data = JSON.parse(text);
				return Array.isArray(data) ? data : [];
			} catch (e) {
				console.warn('Failed to parse chat transcript JSON:', e);
				return [];
			}
		},

		createLeads: async (leads: Array<{ phone_number: string; full_name?: string; remarks?: string }>) => {
			// Get current date in YYYY-MM-DD format
			const currentDate = new Date().toISOString().split('T')[0];

			const res = await fetch(`${API_BASE}/add-leads`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					leads: leads.map(lead => ({
						phone_number: lead.phone_number,
						full_name: lead.full_name || '',
						remarks: lead.remarks || '',
						lead_status: 'New',
						created_at: currentDate,
						needs_reprocess: true,
						lead_source: 'Manual Dashboard Entry'
					}))
				})
			});
			if (!res.ok) throw new Error('Failed to create leads');

			const text = await res.text();
			if (!text) return null;

			try {
				const result = JSON.parse(text);
				return Array.isArray(result) ? result : [result];
			} catch (e) {
				console.warn('Failed to parse create leads JSON:', e);
				return null;
			}
		},

		updateLeadStatus: async (leadId: number, status: string) => {
			const res = await fetch(`${API_BASE}/update-status`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					lead_id: leadId,
					status: status
				})
			});
			if (!res.ok) throw new Error('Failed to update status');

			const text = await res.text();
			if (!text) return null;

			try {
				return JSON.parse(text);
			} catch (e) {
				console.warn('Failed to parse update status JSON:', e);
				return null;
			}
		}
	},

	teacher: {
		getClassStats: async () => {
			const res = await fetch(`${API_BASE}/class-stats`);
			if (!res.ok) throw new Error('Failed to fetch class stats');

			const text = await res.text();
			if (!text) return null;

			try {
				return JSON.parse(text);
			} catch (e) {
				console.warn('Failed to parse class stats JSON:', e);
				return null;
			}
		},

		getStudents: async () => {
			const res = await fetch(`${API_BASE}/students`);
			if (!res.ok) throw new Error('Failed to fetch students');

			const text = await res.text();
			if (!text) return [];

			try {
				const data = JSON.parse(text);
				return Array.isArray(data) ? data : [];
			} catch (e) {
				console.warn('Failed to parse students JSON:', e);
				return [];
			}
		},

		getSyllabus: async (classId?: number) => {
			const url = classId
				? `${API_BASE}/syllabus?class_id=${classId}`
				: `${API_BASE}/syllabus`;
			const res = await fetch(url);
			if (!res.ok) throw new Error('Failed to fetch syllabus');

			const text = await res.text();
			if (!text) return [];

			try {
				const data = JSON.parse(text);
				return Array.isArray(data) ? data : [];
			} catch (e) {
				console.warn('Failed to parse syllabus JSON:', e);
				return [];
			}
		},

		generateDraft: async (data: {
			student_name: string;
			topic: string;
			score: number;
			attendance: boolean;
			class_activity?: string;
			teacher_notes?: string;
		}) => {
			const res = await fetch(`${API_BASE}/generate-draft`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!res.ok) throw new Error('Failed to generate draft');

			const text = await res.text();
			if (!text) return null;

			try {
				const result = JSON.parse(text);
				return Array.isArray(result) ? result[0] : result;
			} catch (e) {
				console.warn('Failed to parse generate draft JSON:', e);
				return null;
			}
		},

		sendReport: async (data: {
			student_id: number;
			parent_phone: string;
			topic: string;
			score: number;
			final_message: string;
			graded_by: string;
		}) => {
			const res = await fetch(`${API_BASE}/send-report`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});

			if (!res.ok) throw new Error('Failed to send report');
			const result = await res.json();
			return Array.isArray(result) ? result[0] : result;
		}
	}
};

// ============================================================
// COMPREHENSIVE MOCK DATA FOR PRODUCTION DEMO
// ============================================================

export type Student = {
	id: number;
	class_id?: number;
	student_name: string;
	parent_name: string;
	parent_phone: string;
	status: 'present' | 'absent';
	last_report: string;
	graded_today: boolean;
};

export type ClassData = {
	id: string;
	name: string;
	students: Student[];
	stats: {
		class_name: string;
		total_students: number;
		graded_today: number;
		pending: number;
	};
};

// Mock students per class
const classStudents: Record<string, Student[]> = {
	'primary-a': [
		{ id: 1, student_name: 'Kenzo Pratama', parent_name: 'Pak Hendra', parent_phone: '+6281234567001', status: 'present', last_report: getRelativeDate(26), graded_today: false },
		{ id: 2, student_name: 'Aisha Zahra', parent_name: 'Bu Rina', parent_phone: '+6281234567002', status: 'present', last_report: getRelativeDate(2), graded_today: true },
		{ id: 3, student_name: 'Michael Tan', parent_name: 'Mrs. Tan', parent_phone: '+6281234567003', status: 'present', last_report: getRelativeDate(50), graded_today: false },
		{ id: 4, student_name: 'Putri Ramadhani', parent_name: 'Bu Dewi', parent_phone: '+6281234567004', status: 'absent', last_report: getRelativeDate(28), graded_today: false },
		{ id: 5, student_name: 'Raffi Ahmad', parent_name: 'Pak Ahmad', parent_phone: '+6281234567005', status: 'present', last_report: getRelativeDate(75), graded_today: false },
		{ id: 6, student_name: 'Michelle Lee', parent_name: 'Mrs. Lee', parent_phone: '+6281234567006', status: 'present', last_report: getRelativeDate(3), graded_today: true },
		{ id: 7, student_name: 'Budi Santoso', parent_name: 'Pak Santoso', parent_phone: '+6281234567007', status: 'present', last_report: getRelativeDate(30), graded_today: false },
		{ id: 8, student_name: 'Clara Wijaya', parent_name: 'Bu Indah', parent_phone: '+6281234567008', status: 'present', last_report: getRelativeDate(48), graded_today: false },
		{ id: 9, student_name: 'Daniel Kosasih', parent_name: 'Pak Kosasih', parent_phone: '+6281234567009', status: 'present', last_report: getRelativeDate(24), graded_today: false },
		{ id: 10, student_name: 'Fiona Chen', parent_name: 'Mrs. Chen', parent_phone: '+6281234567010', status: 'absent', last_report: getRelativeDate(72), graded_today: false },
		{ id: 11, student_name: 'George Lim', parent_name: 'Mr. Lim', parent_phone: '+6281234567011', status: 'present', last_report: getRelativeDate(5), graded_today: true },
		{ id: 12, student_name: 'Hana Putri', parent_name: 'Bu Sari', parent_phone: '+6281234567012', status: 'present', last_report: getRelativeDate(52), graded_today: false },
	],
	'primary-b': [
		{ id: 101, student_name: 'Kevin Hartono', parent_name: 'Pak Hartono', parent_phone: '+6281234567101', status: 'present', last_report: getRelativeDate(20), graded_today: false },
		{ id: 102, student_name: 'Lisa Gunawan', parent_name: 'Bu Gunawan', parent_phone: '+6281234567102', status: 'present', last_report: getRelativeDate(4), graded_today: true },
		{ id: 103, student_name: 'Mario Subekti', parent_name: 'Pak Subekti', parent_phone: '+6281234567103', status: 'present', last_report: getRelativeDate(45), graded_today: false },
		{ id: 104, student_name: 'Nabila Rahman', parent_name: 'Bu Rahman', parent_phone: '+6281234567104', status: 'present', last_report: getRelativeDate(22), graded_today: false },
		{ id: 105, student_name: 'Oscar Tanjung', parent_name: 'Pak Tanjung', parent_phone: '+6281234567105', status: 'absent', last_report: getRelativeDate(68), graded_today: false },
		{ id: 106, student_name: 'Patricia Lau', parent_name: 'Mrs. Lau', parent_phone: '+6281234567106', status: 'present', last_report: getRelativeDate(6), graded_today: true },
		{ id: 107, student_name: 'Quincy Halim', parent_name: 'Pak Halim', parent_phone: '+6281234567107', status: 'present', last_report: getRelativeDate(35), graded_today: false },
		{ id: 108, student_name: 'Rachel Teo', parent_name: 'Mrs. Teo', parent_phone: '+6281234567108', status: 'present', last_report: getRelativeDate(18), graded_today: false },
	],
	'toefl-prep': [
		{ id: 201, student_name: 'Steven Wijaya', parent_name: 'Pak Wijaya', parent_phone: '+6281234567201', status: 'present', last_report: getRelativeDate(12), graded_today: false },
		{ id: 202, student_name: 'Tania Kusuma', parent_name: 'Bu Kusuma', parent_phone: '+6281234567202', status: 'present', last_report: getRelativeDate(8), graded_today: true },
		{ id: 203, student_name: 'Umar Fadil', parent_name: 'Pak Fadil', parent_phone: '+6281234567203', status: 'present', last_report: getRelativeDate(36), graded_today: false },
		{ id: 204, student_name: 'Vina Anggraeni', parent_name: 'Bu Anggraeni', parent_phone: '+6281234567204', status: 'present', last_report: getRelativeDate(15), graded_today: false },
		{ id: 205, student_name: 'William Chandra', parent_name: 'Pak Chandra', parent_phone: '+6281234567205', status: 'present', last_report: getRelativeDate(42), graded_today: false },
		{ id: 206, student_name: 'Xena Sutanto', parent_name: 'Bu Sutanto', parent_phone: '+6281234567206', status: 'absent', last_report: getRelativeDate(60), graded_today: false },
	],
	'private-c': [
		{ id: 301, student_name: 'Candra Putra', parent_name: 'Pak Putra', parent_phone: '+6281234567301', status: 'present', last_report: getRelativeDate(10), graded_today: false },
		{ id: 302, student_name: 'Dina Permata', parent_name: 'Bu Permata', parent_phone: '+6281234567302', status: 'present', last_report: getRelativeDate(5), graded_today: true },
		{ id: 303, student_name: 'Erik Saputra', parent_name: 'Pak Saputra', parent_phone: '+6281234567303', status: 'present', last_report: getRelativeDate(28), graded_today: false },
	],
};

// Generate class stats from students
const generateClassStats = (classId: string, className: string) => {
	const students = classStudents[classId] || [];
	const gradedToday = students.filter(s => s.graded_today).length;
	return {
		class_name: className,
		total_students: students.length,
		graded_today: gradedToday,
		pending: students.length - gradedToday
	};
};

export const mockClasses: Record<string, ClassData> = {
	'primary-a': {
		id: 'primary-a',
		name: 'Primary A - English Foundations',
		students: classStudents['primary-a'],
		stats: generateClassStats('primary-a', 'Primary A - English Foundations')
	},
	'primary-b': {
		id: 'primary-b',
		name: 'Primary B - Advanced Grammar',
		students: classStudents['primary-b'],
		stats: generateClassStats('primary-b', 'Primary B - Advanced Grammar')
	},
	'toefl-prep': {
		id: 'toefl-prep',
		name: 'TOEFL Prep - Weekend',
		students: classStudents['toefl-prep'],
		stats: generateClassStats('toefl-prep', 'TOEFL Prep - Weekend')
	},
	'private-c': {
		id: 'private-c',
		name: 'Private - Candra & Friends',
		students: classStudents['private-c'],
		stats: generateClassStats('private-c', 'Private - Candra & Friends')
	},
};

// Legacy mockData export for backward compatibility
export const mockData = {
	sales: {
		metrics: {
			total_leads: 147,
			action_required: 12,
			hot_pipeline: 38,
			valid_invalid_ratio: '83%'
		},

		trendData: [
			{ week: 'Week 1', leads: 45 },
			{ week: 'Week 2', leads: 62 },
			{ week: 'Week 3', leads: 98 },
			{ week: 'Week 4', leads: 147 }
		],

		leads: [
			{
				id: 1,
				full_name: 'Mrs. Indah Wijaya',
				phone_number: '+6281234567890',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(2),
				ai_summary: 'Asking for 2 kids discount. Very interested in weekend classes. Wants to start this Saturday.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Halo, saya mau tanya program untuk anak umur 6 tahun', time: getRelativeDate(48) },
					{ role: 'agent' as const, message: 'Halo Bu Indah! Terima kasih sudah menghubungi Aetherion. Untuk usia 6 tahun, kami rekomendasikan program Primary A.', time: getRelativeDate(47) },
				]
			},
			{
				id: 2,
				full_name: 'Budi Santoso',
				phone_number: '+6285678901234',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(5),
				ai_summary: 'Payment failed twice. Needs help with bank transfer manually. URGENT - escalate to finance.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Pembayaran saya gagal terus', time: getRelativeDate(8) },
					{ role: 'agent' as const, message: 'Mohon maaf atas ketidaknyamanannya Pak.', time: getRelativeDate(7) },
				]
			},
			{
				id: 3,
				full_name: 'Dr. Rina Kusuma',
				phone_number: '+6287890123456',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(24),
				ai_summary: 'Asked about comparison with Kumon. Sent brochure. Following up in 2 days.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Bedanya sama Kumon apa ya?', time: getRelativeDate(48) },
					{ role: 'agent' as const, message: 'Hai Dr. Rina! Fokus kami adalah English communication skills, bukan drilling worksheet. Class size max 6 anak.', time: getRelativeDate(47) },
					{ role: 'customer' as const, message: 'Ok kirim brochure aja dulu', time: getRelativeDate(24) },
				]
			},
			{
				id: 4,
				full_name: "Pak Hendra (Kevin's Dad)",
				phone_number: '+628111222333',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(1),
				ai_summary: 'Confirmed trial class for Kevin. Needs location map. Ready to enroll after trial.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Kevin mau ikut trial class', time: getRelativeDate(12) },
					{ role: 'agent' as const, message: 'Siap Pak Hendra! Trial class tersedia Sabtu jam 10:00 atau 14:00.', time: getRelativeDate(11) },
					{ role: 'customer' as const, message: 'Jam 10 aja. Lokasinya dimana?', time: getRelativeDate(2) },
					{ role: 'agent' as const, message: 'Baik, sudah saya booking Sabtu jam 10:00. Lokasi di Jl. Sudirman No. 45!', time: getRelativeDate(1) },
				]
			},
			{
				id: 5,
				full_name: 'Siti Nurhaliza',
				phone_number: '+628999888777',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(48),
				ai_summary: 'Interested but price concern. Suggest early bird promo or payment plan.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Harganya agak mahal ya', time: getRelativeDate(72) },
					{ role: 'agent' as const, message: 'Harga kami premium karena kualitas pengajar. Ada promo Early Bird 20% off minggu ini!', time: getRelativeDate(70) },
					{ role: 'customer' as const, message: 'Hmm saya pikir2 dulu', time: getRelativeDate(48) },
				]
			},
			// Additional leads for pagination testing
			{
				id: 6,
				full_name: 'Ahmad Fauzi',
				phone_number: '+628123456001',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(3),
				ai_summary: 'Looking for TOEFL prep class. Wants to start next month.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Ada kelas TOEFL preparation?', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Ada Pak Ahmad! TOEFL Prep class setiap weekend. Target score berapa?', time: getRelativeDate(4) },
					{ role: 'customer' as const, message: 'Target 550, buat apply kampus luar', time: getRelativeDate(3) },
				]
			},
			{
				id: 7,
				full_name: 'Maria Gonzales',
				phone_number: '+628123456002',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(12),
				ai_summary: 'Inquired about class schedule. Prefers weekend morning slots.',
				chat_transcript: []
			},
			{
				id: 8,
				full_name: 'Pak Joko Widodo',
				phone_number: '+628123456003',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(4),
				ai_summary: 'VIP referral from existing parent. Wants private class for 3 children.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Saya dapat rekomendasi dari Bu Indah. Mau daftarkan 3 anak.', time: getRelativeDate(6) },
					{ role: 'agent' as const, message: 'Terima kasih Pak! Untuk 3 anak ada family discount 25%. Mau private atau group?', time: getRelativeDate(5) },
					{ role: 'customer' as const, message: 'Private saja, schedule flexible', time: getRelativeDate(4) },
				]
			},
			{
				id: 9,
				full_name: 'Susan Chen',
				phone_number: '+628123456004',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(6),
				ai_summary: 'Complaint about teacher change. Requesting callback from manager.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Kenapa teacher anak saya diganti? Sudah cocok sama Ms. Anna!', time: getRelativeDate(8) },
					{ role: 'agent' as const, message: 'Mohon maaf Bu, Ms. Anna sedang cuti. Ms. Sarah yang menggantikan juga sangat qualified.', time: getRelativeDate(7) },
					{ role: 'customer' as const, message: 'Tidak terima. Mau bicara dengan manager!', time: getRelativeDate(6) },
				]
			},
			{
				id: 10,
				full_name: 'Dewi Lestari',
				phone_number: '+628123456005',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(18),
				ai_summary: 'Comparing with EF and Wall Street. Need competitive analysis.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Bedanya sama EF gimana?', time: getRelativeDate(20) },
					{ role: 'agent' as const, message: 'Class size kami max 6 anak, EF bisa 15+. Lebih personal!', time: getRelativeDate(18) },
				]
			},
			{
				id: 11,
				full_name: 'Robert Tanaka',
				phone_number: '+628123456006',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(7),
				ai_summary: 'Ready to pay. Just need bank account details for transfer.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau transfer sekarang, rekening apa?', time: getRelativeDate(8) },
					{ role: 'agent' as const, message: 'BCA 123456789 a.n. Aetherion. Kirim bukti transfer ya!', time: getRelativeDate(7) },
				]
			},
			{
				id: 12,
				full_name: 'Anita Susanti',
				phone_number: '+628123456007',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(30),
				ai_summary: 'Asked about sibling discount. Sent pricing package.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Kalau 2 anak ada diskon?', time: getRelativeDate(14) },
					{ role: 'agent' as const, message: 'Ada! Sibling discount 15%. Sudah saya kirim ke WA.', time: getRelativeDate(13) },
				]
			},
			{
				id: 13,
				full_name: 'Pak Surya Atmaja',
				phone_number: '+628123456008',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(8),
				ai_summary: 'Corporate inquiry for 10 employees. High value potential.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Kami butuh training English untuk 10 karyawan.', time: getRelativeDate(10) },
					{ role: 'agent' as const, message: 'Tentu Pak! Kami ada program corporate training. Bisa atur jadwal fleksibel.', time: getRelativeDate(9) },
				]
			},
			{
				id: 14,
				full_name: 'Linda Hartono',
				phone_number: '+628123456009',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(2),
				ai_summary: 'Scheduling conflict. Third reschedule request. Need priority handling.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Saya mau reschedule lagi. Kali ini harus bisa!', time: getRelativeDate(3) },
					{ role: 'agent' as const, message: 'Baik Bu Linda, saya prioritaskan untuk cari slot terbaik.', time: getRelativeDate(2) },
				]
			},
			{
				id: 15,
				full_name: 'Bu Kartini',
				phone_number: '+628123456010',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(36),
				ai_summary: 'Interested in summer camp program. Wants more info.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 16,
				full_name: 'James Wong',
				phone_number: '+628123456011',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(9),
				ai_summary: 'Returning customer. Previous student now wants advanced class.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 17,
				full_name: 'Ratna Sari',
				phone_number: '+628123456012',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(42),
				ai_summary: 'School partnership inquiry. Principal referral.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 18,
				full_name: 'Pak Bambang',
				phone_number: '+628123456013',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(10),
				ai_summary: 'Wants trial before committing. Scheduled for next Saturday.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Bisa trial dulu ga?', time: getRelativeDate(10) },
					{ role: 'agent' as const, message: 'Bisa! Sabtu depan jam 10 ada slot kosong. Mau?', time: getRelativeDate(9) },
				]
			},
			{
				id: 19,
				full_name: 'Christine Lee',
				phone_number: '+628123456014',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(1),
				ai_summary: 'Quality concern. Needs immediate attention from manager.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Kenapa progress anak saya lambat?', time: getRelativeDate(2) },
					{ role: 'agent' as const, message: 'Mohon maaf, akan saya eskalasi ke Academic Manager.', time: getRelativeDate(1) },
				]
			},
			{
				id: 20,
				full_name: 'Eko Prasetyo',
				phone_number: '+628123456015',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(54),
				ai_summary: 'Price negotiation. Asked for sibling discount.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 21,
				full_name: 'Maya Angelica',
				phone_number: '+628123456016',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(11),
				ai_summary: 'Instagram DM inquiry. Saw our reel. Very engaged.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 22,
				full_name: 'Pak Sugiarto',
				phone_number: '+628123456017',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(60),
				ai_summary: 'Asked about curriculum. Wants to see syllabus first.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 23,
				full_name: 'Novi Handayani',
				phone_number: '+628123456018',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(13),
				ai_summary: 'Referral from Mrs. Indah. Twins enrollment inquiry.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 24,
				full_name: 'David Kurniawan',
				phone_number: '+628123456019',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(66),
				ai_summary: 'Cold follow up needed. Last message 2+ days ago.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 25,
				full_name: 'Bu Megawati',
				phone_number: '+628123456020',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(3),
				ai_summary: 'Refund request. Need manager approval.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 26,
				full_name: 'Tommy Soeharto',
				phone_number: '+628123456021',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(14),
				ai_summary: 'Premium package interest. Budget not a concern.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 27,
				full_name: 'Rina Marlina',
				phone_number: '+628123456022',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(72),
				ai_summary: 'Information seeker. Needs more nurturing.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 28,
				full_name: 'Pak Antonius',
				phone_number: '+628123456023',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(15),
				ai_summary: 'Booking confirmed. Payment pending confirmation.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 29,
				full_name: 'Sandy Wijaya',
				phone_number: '+628123456024',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(78),
				ai_summary: 'Re-engagement opportunity. Former interested lead.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 30,
				full_name: 'Bu Fatimah',
				phone_number: '+628123456025',
				lead_status: 'Hot',
				last_contacted: getRelativeDate(16),
				ai_summary: 'Group enrollment. 4 friends want to join together.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 31,
				full_name: 'Michael Jordan',
				phone_number: '+628123456026',
				lead_status: 'Escalated',
				last_contacted: getRelativeDate(4),
				ai_summary: 'Contract issue. Legal review needed before re-engage.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			},
			{
				id: 32,
				full_name: 'Yuni Shara',
				phone_number: '+628123456027',
				lead_status: 'Warm',
				last_contacted: getRelativeDate(84),
				ai_summary: 'Seasonal inquiry. Interested for next semester.',
				chat_transcript: [
					{ role: 'customer' as const, message: 'Mau tanya-tanya dulu', time: getRelativeDate(5) },
					{ role: 'agent' as const, message: 'Silakan, ada yang bisa dibantu?', time: getRelativeDate(4) },
				]
			}
		]
	},

	teacher: {
		classStats: mockClasses['primary-a'].stats,
		students: mockClasses['primary-a'].students
	}
};
