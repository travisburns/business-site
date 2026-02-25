'use client'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useLeads } from '../hooks/useLeads'
import { formatDate, formatDateTime, formatPhoneNumber, formatCurrency, getStatusColor, getPriorityColor } from '../lib/formatters'
import type { Lead } from '../lib/types'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'not-interested', label: 'Not Interested' },
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function AdminDashboard() {
  const { isAuthenticated, isLoading: authLoading, user, login, logout } = useAuth()
  const { leads, stats, isLoading: leadsLoading, updateLead, deleteLead, refreshLeads } = useLeads(isAuthenticated)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filterStatus !== 'all' && lead.status !== filterStatus) return false
      if (filterPriority !== 'all' && lead.priority !== filterPriority) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          lead.fullName.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.includes(q) ||
          lead.projectType.toLowerCase().includes(q) ||
          lead.location.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [leads, filterStatus, filterPriority, searchQuery])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    const success = await login({ username, password })
    if (!success) {
      setLoginError('Invalid username or password')
    }
  }

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    await updateLead(leadId, { status: newStatus })
    if (selectedLead?.leadId === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus })
    }
  }

  const handlePriorityChange = async (leadId: number, newPriority: string) => {
    await updateLead(leadId, { priority: newPriority })
    if (selectedLead?.leadId === leadId) {
      setSelectedLead({ ...selectedLead, priority: newPriority })
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedLead) return
    await updateLead(selectedLead.leadId, { contractorNotes: notesValue } as Partial<Lead>)
    setSelectedLead({ ...selectedLead, contractorNotes: notesValue })
    setEditingNotes(false)
  }

  const handleDeleteLead = async (leadId: number) => {
    await deleteLead(leadId)
    if (selectedLead?.leadId === leadId) {
      setSelectedLead(null)
    }
    setDeleteConfirm(null)
  }

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setEditingNotes(false)
    setNotesValue(lead.contractorNotes || '')
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-white/20 border-t-[#d4662a] rounded-full animate-spin mb-4" />
          <p className="text-white/70 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)' }}>
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="bg-white shadow-2xl overflow-hidden" style={{ borderRadius: '10px' }}>
            {/* Card header */}
            <div className="px-8 pt-10 pb-6 text-center">
              <h1 className="text-2xl font-bold" style={{ color: '#2c3e50' }}>
                Halleman Construction <span style={{ color: '#d4662a', fontWeight: 400, fontSize: '0.85rem' }}>LLC</span>
              </h1>
              <p className="text-sm mt-2" style={{ color: '#7f8c8d' }}>Admin Dashboard</p>
            </div>

            <div className="px-8 pb-10">
              {loginError && (
                <div className="mb-5 px-4 py-3 text-sm font-medium" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '5px' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2c3e50' }}>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 border transition-all"
                    style={{ borderColor: '#e1e8ed', borderRadius: '5px', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#d4662a'; e.target.style.boxShadow = '0 0 0 3px rgba(212,102,42,0.1)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e1e8ed'; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#2c3e50' }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border transition-all"
                    style={{ borderColor: '#e1e8ed', borderRadius: '5px', outline: 'none' }}
                    onFocus={(e) => { e.target.style.borderColor = '#d4662a'; e.target.style.boxShadow = '0 0 0 3px rgba(212,102,42,0.1)' }}
                    onBlur={(e) => { e.target.style.borderColor = '#e1e8ed'; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full font-semibold text-white py-3 transition-all hover:translate-y-[-2px]"
                  style={{ background: '#d4662a', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#b85521')}
                  onMouseOut={(e) => (e.currentTarget.style.background = '#d4662a')}
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">Halleman Construction LLC &middot; Eugene, OR</p>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen" style={{ background: '#f8f9fa' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex justify-between items-center" style={{ padding: '1rem 0' }}>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">
                Halleman Construction <span style={{ color: '#d4662a', fontWeight: 400, fontSize: '0.8rem' }}>LLC</span>
              </h1>
              <span className="hidden sm:inline-block text-xs font-medium px-2.5 py-0.5" style={{ background: 'rgba(212,102,42,0.2)', color: '#d4662a', borderRadius: '3px' }}>
                Admin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-white/60">{user?.fullName}</span>
              <button
                onClick={logout}
                className="text-sm font-medium px-4 py-2 transition-all"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              label="Total Leads"
              value={stats.totalLeads}
              icon={<IconUsers />}
              color="#2c3e50"
              bgColor="rgba(44,62,80,0.08)"
            />
            <StatsCard
              label="New Leads"
              value={stats.newLeads}
              icon={<IconInbox />}
              color="#3498db"
              bgColor="rgba(52,152,219,0.08)"
            />
            <StatsCard
              label="Won"
              value={stats.wonLeads}
              icon={<IconCheck />}
              color="#27ae60"
              bgColor="rgba(39,174,96,0.08)"
            />
            <StatsCard
              label="Conversion"
              value={`${stats.conversionRate.toFixed(1)}%`}
              icon={<IconTrend />}
              color="#d4662a"
              bgColor="rgba(212,102,42,0.08)"
            />
          </div>
        )}

        {/* Secondary stats row */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white px-5 py-4 flex items-center justify-between" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <span className="text-sm" style={{ color: '#7f8c8d' }}>Contacted</span>
              <span className="font-bold" style={{ color: '#2c3e50' }}>{stats.contactedLeads}</span>
            </div>
            <div className="bg-white px-5 py-4 flex items-center justify-between" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <span className="text-sm" style={{ color: '#7f8c8d' }}>Quoted</span>
              <span className="font-bold" style={{ color: '#2c3e50' }}>{stats.quotedLeads}</span>
            </div>
            <div className="bg-white px-5 py-4 flex items-center justify-between" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <span className="text-sm" style={{ color: '#7f8c8d' }}>Lost</span>
              <span className="font-bold" style={{ color: '#2c3e50' }}>{stats.lostLeads}</span>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="bg-white mb-6" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7f8c8d' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search leads by name, email, phone, project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border transition-all"
                  style={{ borderColor: '#e1e8ed', borderRadius: '5px', outline: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = '#d4662a'; e.target.style.boxShadow = '0 0 0 3px rgba(212,102,42,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e1e8ed'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 text-sm border"
                style={{ borderColor: '#e1e8ed', borderRadius: '5px', color: '#2c3e50', outline: 'none', minWidth: '140px' }}
              >
                <option value="all">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              {/* Priority filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2.5 text-sm border"
                style={{ borderColor: '#e1e8ed', borderRadius: '5px', color: '#2c3e50', outline: 'none', minWidth: '140px' }}
              >
                <option value="all">All Priorities</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>

              {/* Refresh */}
              <button
                onClick={refreshLeads}
                className="px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2"
                style={{ background: '#2c3e50', color: '#fff', borderRadius: '5px', border: 'none', cursor: 'pointer' }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#34495e')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#2c3e50')}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            {/* Active filters indicator */}
            {(filterStatus !== 'all' || filterPriority !== 'all' || searchQuery) && (
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #f0f0f0' }}>
                <span className="text-xs" style={{ color: '#7f8c8d' }}>Showing {filteredLeads.length} of {leads.length} leads</span>
                <button
                  onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setSearchQuery('') }}
                  className="text-xs font-medium ml-auto transition-colors"
                  style={{ color: '#d4662a', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Leads Section */}
        <div className="flex gap-6">
          {/* Leads Table */}
          <div className={`${selectedLead ? 'hidden lg:block lg:flex-1' : 'flex-1'}`}>
            <div className="bg-white overflow-hidden" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <h2 className="font-bold" style={{ color: '#2c3e50', fontSize: '1.1rem' }}>Leads</h2>
                <span className="text-xs font-medium px-2.5 py-1" style={{ background: '#f8f9fa', color: '#7f8c8d', borderRadius: '20px' }}>
                  {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
                </span>
              </div>

              {leadsLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-block w-8 h-8 border-3 border-gray-200 border-t-[#d4662a] rounded-full animate-spin mb-3" style={{ borderWidth: '3px' }} />
                  <p className="text-sm" style={{ color: '#7f8c8d' }}>Loading leads...</p>
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mb-3" style={{ color: '#e1e8ed' }}>
                    <svg className="mx-auto" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="font-medium" style={{ color: '#2c3e50' }}>
                    {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? 'No matching leads' : 'No leads yet'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: '#7f8c8d' }}>
                    {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' ? 'Try adjusting your filters' : 'Leads from the website will appear here'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ background: '#f8f9fa' }}>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>Lead</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: '#7f8c8d' }}>Project</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#7f8c8d' }}>Budget</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>Status</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: '#7f8c8d' }}>Priority</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider hidden xl:table-cell" style={{ color: '#7f8c8d' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.leadId}
                          onClick={() => openLeadDetail(lead)}
                          className="transition-colors"
                          style={{
                            borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer',
                            background: selectedLead?.leadId === lead.leadId ? 'rgba(212,102,42,0.04)' : 'transparent',
                          }}
                          onMouseOver={(e) => { if (selectedLead?.leadId !== lead.leadId) e.currentTarget.style.background = '#f8f9fa' }}
                          onMouseOut={(e) => { if (selectedLead?.leadId !== lead.leadId) e.currentTarget.style.background = 'transparent' }}
                        >
                          <td className="px-5 py-4">
                            <div className="font-medium text-sm" style={{ color: '#2c3e50' }}>{lead.fullName}</div>
                            <div className="text-xs mt-0.5" style={{ color: '#7f8c8d' }}>{lead.location}</div>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <div className="text-sm" style={{ color: '#2c3e50' }}>{lead.projectType}</div>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <div className="text-sm" style={{ color: '#2c3e50' }}>{lead.budgetRange}</div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-block text-xs font-medium px-2.5 py-1 ${getStatusColor(lead.status)}`} style={{ borderRadius: '20px' }}>
                              {STATUS_OPTIONS.find(s => s.value === lead.status)?.label || lead.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <span className={`inline-block text-xs font-medium px-2.5 py-1 ${getPriorityColor(lead.priority)}`} style={{ borderRadius: '20px' }}>
                              {PRIORITY_OPTIONS.find(p => p.value === lead.priority)?.label || lead.priority}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden xl:table-cell">
                            <div className="text-xs" style={{ color: '#7f8c8d' }}>{formatDate(lead.createdAt)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Lead Detail Panel */}
          {selectedLead && (
            <div className="flex-1 lg:flex-none lg:w-[420px]">
              <div className="bg-white sticky top-4" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
                {/* Detail header */}
                <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <h3 className="font-bold" style={{ color: '#2c3e50' }}>Lead Details</h3>
                  <button
                    onClick={() => setSelectedLead(null)}
                    className="p-1 transition-colors"
                    style={{ color: '#7f8c8d', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#2c3e50')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#7f8c8d')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="p-5 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {/* Name & Contact */}
                  <div>
                    <h4 className="text-lg font-bold" style={{ color: '#2c3e50' }}>{selectedLead.fullName}</h4>
                    <div className="mt-2 space-y-1.5">
                      <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-sm transition-colors hover:underline" style={{ color: '#d4662a' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {formatPhoneNumber(selectedLead.phone)}
                      </a>
                      <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-sm transition-colors hover:underline" style={{ color: '#d4662a' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        {selectedLead.email}
                      </a>
                    </div>
                    {selectedLead.preferredContactMethod && (
                      <p className="text-xs mt-2" style={{ color: '#7f8c8d' }}>
                        Prefers: {selectedLead.preferredContactMethod}
                      </p>
                    )}
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Project Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Project Type" value={selectedLead.projectType} />
                    <DetailField label="Location" value={selectedLead.location} />
                    <DetailField label="Budget Range" value={selectedLead.budgetRange} />
                    <DetailField label="Timeline" value={selectedLead.timeline || 'Not specified'} />
                  </div>

                  {selectedLead.estimatedCostLow && selectedLead.estimatedCostHigh && (
                    <div className="px-4 py-3" style={{ background: 'rgba(39,174,96,0.06)', borderRadius: '5px', border: '1px solid rgba(39,174,96,0.15)' }}>
                      <p className="text-xs font-medium" style={{ color: '#27ae60' }}>Estimated Cost</p>
                      <p className="font-bold mt-0.5" style={{ color: '#27ae60' }}>
                        {formatCurrency(selectedLead.estimatedCostLow)} &ndash; {formatCurrency(selectedLead.estimatedCostHigh)}
                      </p>
                    </div>
                  )}

                  {selectedLead.projectDescription && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7f8c8d' }}>Description</p>
                      <p className="text-sm" style={{ color: '#2c3e50', lineHeight: '1.6' }}>{selectedLead.projectDescription}</p>
                    </div>
                  )}

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Status & Priority Controls */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7f8c8d' }}>Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleStatusChange(selectedLead.leadId, e.target.value)}
                        className="w-full px-3 py-2 text-sm border"
                        style={{ borderColor: '#e1e8ed', borderRadius: '5px', color: '#2c3e50', outline: 'none' }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#7f8c8d' }}>Priority</label>
                      <select
                        value={selectedLead.priority}
                        onChange={(e) => handlePriorityChange(selectedLead.leadId, e.target.value)}
                        className="w-full px-3 py-2 text-sm border"
                        style={{ borderColor: '#e1e8ed', borderRadius: '5px', color: '#2c3e50', outline: 'none' }}
                      >
                        {PRIORITY_OPTIONS.map((p) => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Contractor Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>Notes</label>
                      {!editingNotes && (
                        <button
                          onClick={() => { setEditingNotes(true); setNotesValue(selectedLead.contractorNotes || '') }}
                          className="text-xs font-medium transition-colors"
                          style={{ color: '#d4662a', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          {selectedLead.contractorNotes ? 'Edit' : 'Add note'}
                        </button>
                      )}
                    </div>
                    {editingNotes ? (
                      <div>
                        <textarea
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 text-sm border resize-none"
                          style={{ borderColor: '#e1e8ed', borderRadius: '5px', outline: 'none' }}
                          onFocus={(e) => { e.target.style.borderColor = '#d4662a'; e.target.style.boxShadow = '0 0 0 3px rgba(212,102,42,0.1)' }}
                          onBlur={(e) => { e.target.style.borderColor = '#e1e8ed'; e.target.style.boxShadow = 'none' }}
                          placeholder="Add private notes about this lead..."
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={handleSaveNotes}
                            className="text-xs font-medium px-3 py-1.5 text-white transition-colors"
                            style={{ background: '#d4662a', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
                            onMouseOver={(e) => (e.currentTarget.style.background = '#b85521')}
                            onMouseOut={(e) => (e.currentTarget.style.background = '#d4662a')}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNotes(false)}
                            className="text-xs font-medium px-3 py-1.5 transition-colors"
                            style={{ color: '#7f8c8d', background: 'none', border: '1px solid #e1e8ed', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm" style={{ color: selectedLead.contractorNotes ? '#2c3e50' : '#bdc3c7', lineHeight: '1.6' }}>
                        {selectedLead.contractorNotes || 'No notes yet'}
                      </p>
                    )}
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4">
                    <DetailField label="Submitted" value={formatDate(selectedLead.createdAt)} />
                    <DetailField label="Last Contacted" value={selectedLead.lastContactedAt ? formatDateTime(selectedLead.lastContactedAt) : 'Never'} />
                  </div>

                  {/* Delete action */}
                  <div className="pt-2">
                    {deleteConfirm === selectedLead.leadId ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#e74c3c' }}>Delete this lead?</span>
                        <button
                          onClick={() => handleDeleteLead(selectedLead.leadId)}
                          className="text-xs font-medium px-3 py-1.5 text-white"
                          style={{ background: '#e74c3c', borderRadius: '3px', border: 'none', cursor: 'pointer' }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs font-medium px-3 py-1.5"
                          style={{ color: '#7f8c8d', background: 'none', border: '1px solid #e1e8ed', borderRadius: '3px', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(selectedLead.leadId)}
                        className="text-xs transition-colors"
                        style={{ color: '#bdc3c7', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseOver={(e) => (e.currentTarget.style.color = '#e74c3c')}
                        onMouseOut={(e) => (e.currentTarget.style.color = '#bdc3c7')}
                      >
                        Delete lead
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// --- Sub-components ---

function StatsCard({ label, value, icon, color, bgColor }: {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white p-5 flex items-center gap-4" style={{ borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      <div className="w-11 h-11 flex items-center justify-center flex-shrink-0" style={{ background: bgColor, borderRadius: '8px', color }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>{label}</p>
        <p className="text-2xl font-bold mt-0.5" style={{ color }}>{value}</p>
      </div>
    </div>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#7f8c8d' }}>{label}</p>
      <p className="text-sm font-medium mt-0.5" style={{ color: '#2c3e50' }}>{value}</p>
    </div>
  )
}

// --- SVG Icons ---

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconInbox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function IconTrend() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  )
}
