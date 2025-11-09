import React, { useState, useEffect, useCallback } from 'react';
import { Sunrise, LogOut, Download, Search, RefreshCw, FileDown, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { SERVER_URL } from './config';

type Page = 'home' | 'admin-login' | 'admin-dashboard' | string;

interface Props {
  setCurrentPage?: (p: Page) => void;
  setIsAdminAuthenticated?: (b: boolean) => void;
}

interface CaregiverApplication { 
  id: number; 
  full_name: string; 
  email: string; 
  phone: string; 
  position_desired: string; 
  submitted_at?: string | null; 
  status: 'pending' | 'approved' | 'rejected'; 
  [k: string]: any;
}

export default function AdminDashboard({ setCurrentPage, setIsAdminAuthenticated }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [applications, setApplications] = useState<CaregiverApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<CaregiverApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<CaregiverApplication | null>(null);

  const getToken = () => localStorage.getItem('adminToken');
  const authHeaders = () => {
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  };

  const clearAuthAndRedirect = useCallback((reason?: string) => {
    console.warn('Clearing admin auth:', reason);
    localStorage.removeItem('adminToken');
    if (typeof setIsAdminAuthenticated === 'function') setIsAdminAuthenticated(false);
    if (typeof setCurrentPage === 'function') setCurrentPage('login');
    setIsAdmin(false);
    setIsLoading(false);
  }, [setCurrentPage, setIsAdminAuthenticated]);

  const verifyAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = getToken();
    if (!token) { clearAuthAndRedirect('no token'); return; }
    try {
      const res = await fetch(`${SERVER_URL}/api/me`, { headers: authHeaders() });
      if (res.status === 401) { clearAuthAndRedirect('token invalid/expired'); return; }
      if (!res.ok) { setError('Failed to verify user'); setIsAdmin(false); setIsLoading(false); return; }
      const json = await res.json();
      if (json?.role === 'admin') {
        setIsAdmin(true);
        await fetchApplications();
      } else {
        clearAuthAndRedirect('not admin');
      }
    } catch (err) {
      console.error('verifyAdmin error', err);
      setError('Network error while verifying user');
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthAndRedirect]);

  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/applications`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { clearAuthAndRedirect('unauthorized when fetching apps'); return; }
      if (!res.ok) { setError('Failed to fetch applications'); return; }
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchApplications error', err);
      setError('Network error while loading applications');
    }
  }, [clearAuthAndRedirect]);

  useEffect(() => { verifyAdmin(); }, [verifyAdmin]);

  useEffect(() => {
    let list = applications.slice();
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(a => 
        (a.full_name || '').toLowerCase().includes(q) || 
        (a.email || '').toLowerCase().includes(q) || 
        (a.position_desired || '').toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter(a => a.status === statusFilter);
    setFilteredApplications(list);
  }, [applications, searchTerm, statusFilter]);

  const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/applications/${id}/status`, {
        method: 'POST', 
        headers: { ...authHeaders(), 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status })
      });
      if (res.status === 401 || res.status === 403) { clearAuthAndRedirect('unauthorized update'); return; }
      if (!res.ok) { 
        const b = await res.json().catch(() => null); 
        alert(b?.message || 'Failed to update status'); 
        return; 
      }
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status });
      }
    } catch (err) { 
      console.error(err); 
      alert('Network error'); 
    }
  };

  const generatePDF = (data: CaregiverApplication) => {
    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Caregiver Application — New Daybreak</title>
  <style>
    :root{
      --accent-blue:#2563eb;
      --accent-amber:#eab308;
      --muted:#64748b;
      --bg:#ffffff;
      --card:#f8fafc;
      --text:#1e293b;
      --radius:8px;
      --pad:14px;
      --max-width:900px;
    }
    @page{margin:0.65in}
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      font-family: Inter, 'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', Arial;
      margin:0; background:var(--bg); color:var(--text); line-height:1.45; -webkit-print-color-adjust:exact;
      padding:20px; display:flex; justify-content:center;
    }
    .sheet{width:100%; max-width:var(--max-width); background:#fff; border:1px solid #e6eef9; border-radius:10px; padding:20px; box-shadow:0 6px 22px rgba(16,24,40,0.04)}

    /* Header */
    .head{display:flex; gap:16px; align-items:center; margin-bottom:14px}
    .logo{width:72px;height:72px;flex:0 0 72px;border-radius:8px;overflow:hidden;border:2px solid rgba(37,99,235,0.14)}
    .logo img{width:100%;height:100%;object-fit:contain}
    .org{flex:1}
    .org h1{font-size:20px;margin:0;color:var(--accent-blue)}
    .org p{margin:2px 0 0;font-size:13px;color:var(--muted);font-weight:600}
    .meta{font-size:12px;text-align:right;color:var(--muted)}

    /* Title */
    .title{display:flex;justify-content:space-between;align-items:center;margin:12px 0 18px}
    .title h2{font-size:16px;text-transform:uppercase;letter-spacing:1px;color:var(--accent-blue);margin:0}
    .appid{font-size:12px;color:var(--muted)}

    /* Layout */
    .grid{display:grid;grid-template-columns:1fr 340px;gap:18px}
    @media (max-width:880px){.grid{grid-template-columns:1fr}}

    /* Left column */
    .primary .card{background:#fff;border:1px solid #eef2ff;padding:12px;border-radius:var(--radius);margin-bottom:12px}
    .applicant{background:linear-gradient(180deg,var(--accent-blue),#3b82f6);color:#fff;padding:14px;border-radius:var(--radius);margin-bottom:12px}
    .applicant h3{margin:0;font-size:18px}
    .applicant .role{font-size:12px;opacity:.95;margin-top:6px}
    .badge{display:inline-block;padding:6px 12px;border-radius:999px;font-size:11px;font-weight:700;margin-top:8px}
    .status-pending{background:#fff8dc;color:#92400e;border:1px solid #f59e0b}
    .status-approved{background:#e6ffef;color:#065f46;border:1px solid #10b981}
    .status-rejected{background:#fff0f0;color:#7f1d1d;border:1px solid #ef4444}

    .section-title{display:flex;align-items:center;gap:8px;margin-bottom:8px}
    .section-title h4{margin:0;font-size:13px;color:var(--accent-blue);text-transform:uppercase;letter-spacing:0.6px}
    .info-row{display:flex;gap:12px;padding:8px 0;border-top:1px dashed #f1f5f9}
    .info-row:first-of-type{border-top:0}
    .label{width:150px;font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase}
    .value{flex:1;font-size:13px}

    .chips{display:flex;flex-wrap:wrap;gap:8px}
    .chip{background:var(--card);border:1px solid #e6eef9;padding:8px 10px;border-radius:999px;font-size:12px}

    /* Right column (summary) */
    .aside .card{background:var(--card);border:1px solid #e2e8f0;padding:12px;border-radius:var(--radius);margin-bottom:12px}
    .contact-item{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .contact-item .i{width:36px;height:36px;border-radius:6px;background:linear-gradient(90deg,var(--accent-blue),#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700}
    .small{font-size:12px;color:var(--muted)}

    .certs{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
    .cert{background:#fff;border:1px solid #dbeafe;padding:8px;border-radius:6px;font-weight:700;text-align:center;font-size:12px;color:var(--accent-blue)}

    .skills{background:#f0fdfa;border:1px solid #86efac;padding:10px;border-radius:6px;font-size:13px;color:#065f46}

    .refs .ref{background:#fffdf5;border:1px solid #fde68a;padding:10px;border-radius:6px;margin-bottom:8px}
    .sig{border:1px dashed #cbd5e1;padding:12px;border-radius:6px;text-align:center}
    .sig .name{font-family:'Brush Script MT',cursive;font-size:20px;color:var(--accent-blue);font-weight:700}
    .footer{font-size:11px;color:var(--muted);text-align:center;margin-top:10px}

    /* Print tweaks */
    @media print{
      body{padding:0}
      .sheet{box-shadow:none;border:none;border-radius:0;margin:0}
      .grid{grid-template-columns:1fr 320px}
      .badge{page-break-inside:avoid}
    }
  </style>
</head>
<body>
  <div class="sheet" role="document">
    <div class="head">
      <div class="logo"><img src="https://rising-sun.org/wp-content/uploads/2025/07/fotrs-logo-transparent.webp" alt="New Daybreak logo"></div>
      <div class="org">
        <h1>New Daybreak</h1>
        <p>Home Support — Caregiver Application</p>
      </div>
      <div class="meta">
        <div class="appid">Application: #${data.id || '—'}</div>
        <div class="dates">Submitted: ${new Date(data.submitted_at).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'})}</div>
      </div>
    </div>

    <div class="title">
      <h2>Caregiver Candidate Summary</h2>
      <div class="appid small">Status: <span class="badge status-${data.status || 'pending'}">${(data.status || 'Pending').toUpperCase()}</span></div>
    </div>

    <div class="grid">
      <div class="primary">
        <div class="applicant">
          <h3>${data.full_name || 'Applicant Name'}</h3>
          <div class="role">${(data.position_desired || 'Caregiver').toUpperCase()}</div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Contact</h4></div>
          <div class="info-row"><div class="label">Phone</div><div class="value">${data.phone || '—'}</div></div>
          <div class="info-row"><div class="label">Email</div><div class="value">${data.email || '—'}</div></div>
          <div class="info-row"><div class="label">Address</div><div class="value">${data.address || '—'}</div></div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Education & Certifications</h4></div>
          <div class="info-row"><div class="label">Education</div><div class="value">${data.education_level === 'associate' ? 'Associate degree' : (data.education_level || '—')}</div></div>
          ${data.certifications && data.certifications.length ? `
            <div style="margin-top:10px" class="chips">${data.certifications.map(c=>`<span class="chip">${c}</span>`).join('')}</div>
          ` : ''}
        </div>

        <div class="card">
          <div class="section-title"><h4>Employment History</h4></div>
          ${ (data.employment_history && (data.employment_history.employer1?.name || data.employment_history.employer2?.name)) ? `
            ${ data.employment_history.employer1?.name && data.employment_history.employer1.name!=='NIL' ? `
              <div class="info-row"><div class="label">Employer</div><div class="value">${data.employment_history.employer1.name}</div></div>
              ${ data.employment_history.employer1.position ? `<div class="info-row"><div class="label">Position</div><div class="value">${data.employment_history.employer1.position}</div></div>` : '' }
              ${ data.employment_history.employer1.duration ? `<div class="info-row"><div class="label">Duration</div><div class="value">${data.employment_history.employer1.duration}</div></div>` : '' }
            ` : '' }

            ${ data.employment_history.employer2?.name && data.employment_history.employer2.name!=='NIL' ? `
              <div style="margin-top:8px;border-top:1px solid #f3f6fb;padding-top:8px">
                <div class="info-row"><div class="label">Employer</div><div class="value">${data.employment_history.employer2.name}</div></div>
                ${ data.employment_history.employer2.position ? `<div class="info-row"><div class="label">Position</div><div class="value">${data.employment_history.employer2.position}</div></div>` : '' }
                ${ data.employment_history.employer2.duration ? `<div class="info-row"><div class="label">Duration</div><div class="value">${data.employment_history.employer2.duration}</div></div>` : '' }
              </div>
            ` : '' }
          ` : `
            <div style="padding:8px 0;color:var(--muted);">No previous employment history provided.</div>
          ` }
        </div>

        <div class="card">
          <div class="section-title"><h4>Skills & Experience</h4></div>
          <div class="value" style="white-space:pre-wrap">${(data.skills_experience || '—')}</div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Qualifications</h4></div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
            <div class="chip">Over 18: ${data.is_over_18 ? 'Yes' : 'No'}</div>
            <div class="chip">Driver's License: ${data.has_drivers_license ? 'Yes' : 'No'}</div>
            <div class="chip">Reliable Transport: ${data.has_reliable_transport ? 'Yes' : 'No'}</div>
            <div class="chip">Can perform physical tasks: ${data.can_perform_physical_tasks ? 'Yes' : 'No'}</div>
          </div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Availability</h4></div>
          <div class="chips">${(data.days_hours_available || []).map(d=>`<span class="chip">${d}</span>`).join('')}</div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Emergency Contact</h4></div>
          <div class="info-row"><div class="label">Name</div><div class="value">${data.emergency_contact?.name || '—'}</div></div>
          <div class="info-row"><div class="label">Phone</div><div class="value">${data.emergency_contact?.phone || '—'}</div></div>
          <div class="info-row"><div class="label">Relationship</div><div class="value">${data.emergency_contact?.relationship || '—'}</div></div>
        </div>

      </div>

      <aside class="aside">
        <div class="card">
          <div class="section-title"><h4>Contact & Location</h4></div>
          <div class="contact-item"><div class="i">📞</div><div><div class="small">Phone</div><div class="value">${data.phone || '—'}</div></div></div>
          <div class="contact-item"><div class="i">✉️</div><div><div class="small">Email</div><div class="value">${data.email || '—'}</div></div></div>
          <div class="contact-item"><div class="i">📍</div><div><div class="small">City</div><div class="value">${data.city_state_zip || '—'}</div></div></div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Certifications</h4></div>
          <div class="certs">
            ${ (data.certifications && data.certifications.length) ? data.certifications.slice(0,4).map(c=>`<div class="cert">${c}</div>`).join('') : `<div style="grid-column:1/-1;color:var(--muted);">No certifications listed</div>` }
          </div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Key Skills</h4></div>
          <div class="skills">${(data.key_skills || data.skills_experience?.split('\n')?.slice(0,4).join(', ') || '—')}</div>
        </div>

        <div class="card refs">
          <div class="section-title"><h4>References</h4></div>
          <div class="ref">
            <div style="font-weight:700">${data.references?.reference1?.name || '—'}</div>
            <div class="small">${data.references?.reference1?.relationship || ''} • ${data.references?.reference1?.phone || ''}</div>
          </div>
          <div class="ref">
            <div style="font-weight:700">${data.references?.reference2?.name || '—'}</div>
            <div class="small">${data.references?.reference2?.relationship || ''} • ${data.references?.reference2?.phone || ''}</div>
          </div>
        </div>

        <div class="card">
          <div class="section-title"><h4>Signature</h4></div>
          <div class="sig">
            <div class="name">${data.signature || '—'}</div>
            <div class="small" style="margin-top:6px">Signed: ${new Date(data.submitted_at).toLocaleString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        </div>

      </aside>
    </div>

    <div class="footer"> <strong>New Daybreak Home Support</strong> — Confidential applicant record. Handle with care.</div>
  </div>
</body>
</html>
    `;

    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      };
    } else {
      alert('Please allow pop-ups to download the PDF');
    }
  };

  const downloadApp = async (id: number) => {
    try {
      const res = await fetch(`${SERVER_URL}/api/admin/applications/${id}/download`, { headers: authHeaders() });
      if (res.status === 401 || res.status === 403) { clearAuthAndRedirect('unauthorized download'); return; }
      if (!res.ok) { alert('Failed to download'); return; }
      
      const data = await res.json();
      
      // Generate PDF instead of JSON
      generatePDF(data);
    } catch (err) { 
      console.error(err); 
      alert('Network error while downloading'); 
    }
  };

  const exportCSV = () => {
    const rows = filteredApplications.map(a => [
      a.full_name,
      a.email,
      a.phone,
      a.position_desired,
      a.status,
      new Date(a.submitted_at || '').toLocaleString()
    ].map(x => `"${(x || '').toString().replace(/"/g, '""')}"`).join(','));
    
    const csv = ['Name,Email,Phone,Position,Status,Submitted'].concat(rows).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caregiver-applications_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    if (typeof setIsAdminAuthenticated === 'function') setIsAdminAuthenticated(false);
    if (typeof setCurrentPage === 'function') setCurrentPage('login');
    setIsAdmin(false);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    const icons = {
      pending: <Clock className="w-3.5 h-3.5" />,
      approved: <CheckCircle className="w-3.5 h-3.5" />,
      rejected: <XCircle className="w-3.5 h-3.5" />
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error || 'You are not authorized to access the admin dashboard.'}</p>
          <button 
            onClick={() => { 
              localStorage.removeItem('adminToken'); 
              if (typeof setCurrentPage === 'function') setCurrentPage('login'); 
            }} 
            className="w-full px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500 ">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2">
               <div>
  <img
    src="https://rising-sun.org/wp-content/uploads/2025/07/fotrs-logo-transparent.webp"
    alt="Caregiver with elderly client"
    className="w-[50px] h-auto object-contain block"
  />
</div>
              </div>
              <div>
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-yellow-500 text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-yellow-600">New Daybreak Home Support</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileDown className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search by name, email, or position..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={verifyAdmin}
                className="flex  border border-blue-300 items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                <RefreshCw className="w-4 h-4 " />
                <span className="hidden sm:inline ">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length ? (
                  filteredApplications.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-700 font-semibold text-sm">
                              {app.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                            <div className="text-sm text-gray-500">ID: #{app.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.email}</div>
                        <div className="text-sm text-gray-500">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.position_desired}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.submitted_at || '').toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'approved')}
                            disabled={app.status === 'approved'}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, 'rejected')}
                            disabled={app.status === 'rejected'}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => downloadApp(app.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Download PDF Resume"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileDown className="w-12 h-12 mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No applications found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </main>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedApp(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedApp.full_name}</h3>
                <p className="text-sm text-gray-500 mt-1">Application #{selectedApp.id}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Status</h4>
                {getStatusBadge(selectedApp.status)}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Email:</span> <span className="text-gray-900">{selectedApp.email}</span></p>
                  <p><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{selectedApp.phone}</span></p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Position Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Position Desired:</span> <span className="text-gray-900">{selectedApp.position_desired}</span></p>
                  <p><span className="text-gray-500">Submitted:</span> <span className="text-gray-900">
                    {new Date(selectedApp.submitted_at || '').toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span></p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    updateStatus(selectedApp.id, 'approved');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => {
                    updateStatus(selectedApp.id, 'rejected');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => downloadApp(selectedApp.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 