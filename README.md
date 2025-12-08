# Aetherion Dashboard

Internal dashboards for Sales and Teacher teams at Poly English.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - automatically redirects to `/sales`

## 📊 Features

### Sales Dashboard (`/sales`)
- **Manual Lead Input**: Create leads manually via phone number input
- **Metrics Grid**: 4 KPI cards (Total Leads, Action Required, Hot Pipeline, Valid Rate)
- **Growth Graph**: Line chart showing lead growth trend (mocked data)
- **Action Table**: List of Hot/Warm/Escalated leads with AI summaries

### Teacher Dashboard (`/teacher`)
- **Class Header**: Class info and daily stats (Students, Graded, Pending)
- **Student Roster**: List of students with grade buttons
- **Grading Wizard**: 4-step dialog for grading students
  - Step 1: Input (slider for score 1-5, attendance switch)
  - Step 2: Loading (AI generating draft)
  - Step 3: Review (editable textarea with AI draft)
  - Step 4: Success (confirmation + auto-close)

## 🏗️ Architecture

```
Frontend (Next.js 14)
    ↓ HTTP Requests
n8n Webhooks (Backend API)
    ↓ SQL Queries
Supabase PostgreSQL
```

## 🔌 API Integration

Currently using **mock data** for demo. To connect to real n8n backend:

1. Create `.env.local`:
```env
NEXT_PUBLIC_N8N_BASE_URL=https://your-n8n-instance.com/webhook
```

2. Implement n8n workflows per `/docs/n8n_api_endpoints.md`

3. Mock data will automatically be replaced with real API calls

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── sales/page.tsx          # Sales dashboard page
│   │   ├── teacher/page.tsx        # Teacher dashboard page
│   │   └── layout.tsx              # Root layout with sidebar
│   ├── components/
│   │   ├── sales/
│   │   │   ├── MetricsGrid.tsx     # 4 KPI cards
│   │   │   ├── GrowthGraph.tsx     # Line chart
│   │   │   ├── ManualLeadInput.tsx # Phone input form
│   │   │   └── ActionTable.tsx     # Leads table
│   │   ├── teacher/
│   │   │   ├── ClassHeader.tsx     # Class stats header
│   │   │   ├── StudentRoster.tsx   # Student list
│   │   │   └── GradingWizard.tsx   # Multi-step grading dialog
│   │   ├── layout/
│   │   │   └── Sidebar.tsx         # Navigation sidebar
│   │   └── ui/                     # Shadcn UI components
│   └── lib/
│       ├── api.ts                  # API client + mock data
│       └── utils.ts                # Utility functions
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Shadcn UI
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Utils**: date-fns

## 🔧 Development

### Install dependencies
```bash
npm install
```

### Run dev server
```bash
npm run dev
```

### Build for production
```bash
npm run build
npm start
```

## 📝 Next Steps

1. **Create n8n workflows** (8 endpoints - see `/docs/n8n_api_endpoints.md`)
2. **Set up Supabase tables** (run SQL scripts in `/sql/`)
3. **Update environment variables** with real n8n webhook URL
4. **Test end-to-end flow** with real data
5. **Deploy** to production

## 🎯 Demo Checklist

- [ ] Set `NEXT_PUBLIC_N8N_BASE_URL` in `.env.local`
- [ ] Create n8n workflows for all 8 API endpoints
- [ ] Seed Supabase with demo data (students, syllabus templates)
- [ ] Test manual lead creation → appears in table
- [ ] Test grading flow → WhatsApp sent to parent
- [ ] Prepare demo script

## 📱 WhatsApp Integration

Teacher grading sends WhatsApp via n8n workflow. For demo:
- Parent phone must text "Hi" 24 hours before demo
- n8n reuses WhatsApp node from LAT Mark III workflow

## 🐛 Troubleshooting

**Error: Cannot find module**
```bash
npm install
```

**Graph not showing**
- Check console for Recharts errors
- Ensure mock data format is correct

**API calls failing**
- Verify `NEXT_PUBLIC_N8N_BASE_URL` is set
- Check n8n workflows are active
- Test endpoints with curl first

## 📄 License

Internal tool for Poly English - Not for public distribution
