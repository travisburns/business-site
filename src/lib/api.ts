const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7280/api";
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token");
}
async function tryRefresh(): Promise<boolean> {
  const refresh = localStorage.getItem("admin_refresh");
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    localStorage.setItem("admin_refresh", data.refreshToken);
    return true;
  } catch {
    return false;
  }
}
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers["Authorization"] = `Bearer ${getToken()}`;
      const retry = await fetch(`${API_URL}${path}`, { ...options, headers });
      if (!retry.ok) throw new Error(`API error: ${retry.status}`);
      const text = await retry.text();
      return text ? JSON.parse(text) : ({} as T);
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh");
    localStorage.removeItem("admin_user");
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `API error: ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}
// ── Auth ──────────────────────────────────────────────
export async function login(email: string, password: string) {
  const data = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_refresh", data.refreshToken);
  localStorage.setItem(
    "admin_user",
    JSON.stringify({ email: data.email, fullName: data.fullName })
  );
  return data;
}
export function logout() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_refresh");
  localStorage.removeItem("admin_user");
  window.location.href = "/admin/login";
}
export function getStoredUser(): { email: string; fullName: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("admin_user");
  return raw ? JSON.parse(raw) : null;
}
export function isAuthenticated(): boolean {
  return !!getToken();
}
// ── Contacts (public submit + admin reads) ────────────
export async function submitContact(data: CreateContactPayload) {
  return apiFetch<{ message: string; id: number }>("/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function getContacts(page = 1, pageSize = 25, unreadOnly?: boolean) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (unreadOnly) params.set("unreadOnly", "true");
  return apiFetch<Paginated<ContactSubmission>>(`/contact?${params}`);
}
export async function markContactRead(id: number) {
  return apiFetch<{ message: string }>(`/contact/${id}/read`, { method: "PUT" });
}
export async function deleteContact(id: number) {
  return apiFetch<{ message: string }>(`/contact/${id}`, { method: "DELETE" });
}
// ── Leads (admin only) ───────────────────────────────
export async function getLeads(page = 1, pageSize = 25, status?: number, service?: string) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status !== undefined) params.set("status", String(status));
  if (service) params.set("service", service);
  return apiFetch<Paginated<Lead>>(`/lead?${params}`);
}
export async function createLead(data: CreateLeadPayload) {
  return apiFetch<Lead>("/lead", { method: "POST", body: JSON.stringify(data) });
}
export async function updateLead(id: number, data: UpdateLeadPayload) {
  return apiFetch<Lead>(`/lead/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteLead(id: number) {
  return apiFetch<{ message: string }>(`/lead/${id}`, { method: "DELETE" });
}
export async function exportLeads(status?: number) {
  const token = getToken();
  const params = new URLSearchParams();
  if (status !== undefined) params.set("status", String(status));
  const res = await fetch(`${API_URL}/lead/export?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
// ── Audits ────────────────────────────────────────────
export async function getAudits(page = 1, pageSize = 25, status?: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status !== undefined) params.set("status", String(status));
  return apiFetch<Paginated<AuditRequest>>(`/audit?${params}`);
}
export async function updateAudit(id: number, data: { status?: number; notes?: string }) {
  return apiFetch<AuditRequest>(`/audit/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
// ── Analytics ─────────────────────────────────────────
export async function getAnalyticsSummary(from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return apiFetch<Record<string, number>>(`/analytics/summary?${params}`);
}
// ── Template Analytics ───────────────────────────────
function analyticsParams(from?: string, to?: string): URLSearchParams {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return params;
}
export async function getTemplateAnalyticsSummary(from?: string, to?: string) {
  return apiFetch<TemplateAnalyticsSummary>(`/analytics/templates/summary?${analyticsParams(from, to)}`);
}
export async function getTemplatePerformance(from?: string, to?: string, channel?: string, category?: string, sortBy?: string, desc = true) {
  const params = analyticsParams(from, to);
  if (channel) params.set("channel", channel);
  if (category) params.set("category", category);
  if (sortBy) params.set("sortBy", sortBy);
  params.set("desc", String(desc));
  return apiFetch<TemplatePerformance[]>(`/analytics/templates?${params}`);
}
export async function getChannelPerformance(from?: string, to?: string) {
  return apiFetch<ChannelPerformance[]>(`/analytics/templates/by-channel?${analyticsParams(from, to)}`);
}
export async function getCategoryPerformance(from?: string, to?: string) {
  return apiFetch<CategoryPerformance[]>(`/analytics/templates/by-category?${analyticsParams(from, to)}`);
}
export async function getSequencePerformance(from?: string, to?: string) {
  return apiFetch<SequenceStepPerformance[]>(`/analytics/templates/sequence?${analyticsParams(from, to)}`);
}
export async function getTemplateComparison(from?: string, to?: string, category?: string) {
  const params = analyticsParams(from, to);
  if (category) params.set("category", category);
  return apiFetch<TemplateComparison[]>(`/analytics/templates/compare?${params}`);
}
// ── Prospects (admin CRM) ─────────────────────────────
export async function getProspects(
  page = 1,
  pageSize = 25,
  filters?: { status?: number; needsFollowUp?: boolean; search?: string }
) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filters?.status !== undefined) params.set("status", String(filters.status));
  if (filters?.needsFollowUp) params.set("needsFollowUp", "true");
  if (filters?.search) params.set("search", filters.search);
  return apiFetch<Paginated<Prospect>>(`/prospect?${params}`);
}
export async function getProspect(id: number) {
  return apiFetch<Prospect>(`/prospect/${id}`);
}
export async function createProspect(data: CreateProspectPayload) {
  return apiFetch<Prospect>("/prospect", { method: "POST", body: JSON.stringify(data) });
}
export async function updateProspect(id: number, data: UpdateProspectPayload) {
  return apiFetch<Prospect>(`/prospect/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteProspect(id: number) {
  return apiFetch<{ message: string }>(`/prospect/${id}`, { method: "DELETE" });
}
export async function logOutreach(prospectId: number, data: LogOutreachPayload) {
  return apiFetch<OutreachActivity>(`/prospect/${prospectId}/outreach`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function updateOutreach(activityId: number, data: { responseStatus: number; notes?: string }) {
  return apiFetch<OutreachActivity>(`/prospect/outreach/${activityId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
export async function getTemplateSuggestions(prospectId: number) {
  return apiFetch<TemplateSuggestion[]>(`/prospect/${prospectId}/suggestions`);
}
export async function getProspectStats() {
  return apiFetch<ProspectStats>("/prospect/stats");
}
export async function exportProspects(status?: number) {
  const token = getToken();
  const params = new URLSearchParams();
  if (status !== undefined) params.set("status", String(status));
  const res = await fetch(`${API_URL}/prospect/export?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
// ── Client Onboarding ────────────────────────────────
export async function submitOnboarding(data: CreateOnboardingPayload) {
  return apiFetch<{ message: string; id: number }>("/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function uploadOnboardingFiles(onboardingId: number, files: File[], category: "photos" | "logo") {
  const token = getToken();
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  formData.append("category", category);
  const res = await fetch(`${API_URL}/onboarding/${onboardingId}/files`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error("File upload failed");
  const text = await res.text();
  return text ? JSON.parse(text) : {};
}
export async function getOnboardings(page = 1, pageSize = 25, status?: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status !== undefined) params.set("status", String(status));
  return apiFetch<Paginated<ClientOnboarding>>(`/onboarding?${params}`);
}
export async function getOnboarding(id: number) {
  return apiFetch<ClientOnboarding>(`/onboarding/${id}`);
}
export async function updateOnboarding(id: number, data: UpdateOnboardingPayload) {
  return apiFetch<ClientOnboarding>(`/onboarding/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
// ── Follow-up Sequences ──────────────────────────────
export async function getFollowUpQueue(
  page = 1,
  pageSize = 50,
  filter?: "overdue" | "today" | "upcoming" | "all"
) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (filter) params.set("filter", filter);
  return apiFetch<Paginated<FollowUpStep>>(`/sequence/queue?${params}`);
}
export async function getFollowUpQueueStats() {
  return apiFetch<FollowUpQueueStats>("/sequence/queue/stats");
}
export async function getProspectSequence(prospectId: number) {
  return apiFetch<FollowUpStep[]>(`/sequence/prospect/${prospectId}`);
}
export async function completeFollowUpStep(stepId: number, data: CompleteFollowUpPayload) {
  return apiFetch<{ step: FollowUpStep; activity: OutreachActivity }>(`/sequence/${stepId}/complete`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export async function skipFollowUpStep(stepId: number) {
  return apiFetch<FollowUpStep>(`/sequence/${stepId}/skip`, { method: "POST" });
}
export async function cancelProspectSequence(prospectId: number) {
  return apiFetch<{ message: string; cancelled: number }>(`/sequence/prospect/${prospectId}/cancel`, { method: "POST" });
}
export async function createProspectSequence(prospectId: number, channel: number = 0) {
  return apiFetch<FollowUpStep[]>(`/sequence/prospect/${prospectId}/create`, {
    method: "POST",
    body: JSON.stringify({ channel }),
  });
}
// ── Templates ─────────────────────────────────────────
export async function getTemplates(channel?: string, category?: string) {
  const params = new URLSearchParams();
  if (channel) params.set("channel", channel);
  if (category) params.set("category", category);
  return apiFetch<TemplateGroup[]>(`/prospect/templates?${params}`);
}
export async function getTemplate(templateId: string) {
  return apiFetch<OutreachTemplate>(`/prospect/templates/${templateId}`);
}
export async function previewTemplate(prospectId: number, templateId: string) {
  return apiFetch<TemplatePreview>(`/prospect/${prospectId}/preview/${templateId}`);
}
// ── Enum helpers ──────────────────────────────────────
// .NET serializes enums as integers by default
export const LEAD_STATUSES = ["New", "Contacted", "Quoted", "Won", "Lost"] as const;
export const AUDIT_STATUSES = ["Pending", "In Progress", "Completed", "Sent"] as const;
export const PROSPECT_STATUSES = ["Researched", "Contacted", "Engaged", "Converted", "Not Interested", "Unresponsive"] as const;
export const WEBSITE_STATUSES = ["No Website", "Outdated", "Not Ranking", "No Lead Capture", "Decent"] as const;
export const SERVICE_TYPES = ["Kitchen/Bath", "Deck/Fence", "General Contractor", "Handyman", "Foundation/Emergency", "Other"] as const;
export const LEAD_GEN_METHODS = ["Unknown", "None", "Word of Mouth", "HomeAdvisor/Angi", "Facebook Ads", "Google Ads", "Other"] as const;
export const OUTREACH_CHANNELS = ["Email", "LinkedIn", "LinkedIn InMail", "Phone"] as const;
export const RESPONSE_STATUSES = ["No Response", "Positive", "Negative", "Question", "Unsubscribed"] as const;
export const FOLLOWUP_STEP_STATUSES = ["Scheduled", "Due", "Completed", "Skipped", "Cancelled"] as const;
export const ONBOARDING_STATUSES = ["Submitted", "In Review", "In Progress", "Completed"] as const;
export const DELIVERY_STATUSES = ["Not Started", "Foundation", "Website Build", "SEO & Backlinks", "Lead Capture", "Launch", "Post-Launch", "Completed"] as const;
export const ROI_REPORT_STATUSES = ["Draft", "Finalized", "Sent"] as const;
export function leadStatusLabel(s: number): string {
  return LEAD_STATUSES[s] || "Unknown";
}
export function auditStatusLabel(s: number): string {
  return AUDIT_STATUSES[s] || "Unknown";
}
export function prospectStatusLabel(s: number): string { return PROSPECT_STATUSES[s] || "Unknown"; }
export function websiteStatusLabel(s: number): string { return WEBSITE_STATUSES[s] || "Unknown"; }
export function serviceTypeLabel(s: number): string { return SERVICE_TYPES[s] || "Unknown"; }
export function leadGenLabel(s: number): string { return LEAD_GEN_METHODS[s] || "Unknown"; }
export function channelLabel(s: number): string { return OUTREACH_CHANNELS[s] || "Unknown"; }
export function responseStatusLabel(s: number): string { return RESPONSE_STATUSES[s] || "Unknown"; }
export function followUpStepStatusLabel(s: number): string { return FOLLOWUP_STEP_STATUSES[s] || "Unknown"; }
export function onboardingStatusLabel(s: number): string { return ONBOARDING_STATUSES[s] || "Unknown"; }
export function deliveryStatusLabel(s: number): string { return DELIVERY_STATUSES[s] || "Unknown"; }
export function roiReportStatusLabel(s: number): string { return ROI_REPORT_STATUSES[s] || "Unknown"; }
// ── Types ─────────────────────────────────────────────
interface LoginResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  email: string;
  fullName: string;
}
interface Paginated<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  service?: string;
  message?: string;
  wantAudit: boolean;
  isRead: boolean;
  createdAt: string;
  leadId?: number;
}
export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  service?: string;
  notes?: string;
  status: number;
  estimatedValue?: number;
  createdAt: string;
  updatedAt: string;
  contactSubmissionId?: number;
}
export interface AuditRequest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  currentWebsiteUrl?: string;
  notes?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  service?: string;
  message?: string;
  wantAudit: boolean;
}
export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  service?: string;
  notes?: string;
  estimatedValue?: number;
  contactSubmissionId?: number;
}
export interface UpdateLeadPayload {
  status?: number;
  notes?: string;
  estimatedValue?: number;
}
export interface Prospect {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  companyName: string;
  city?: string;
  websiteUrl?: string;
  websiteStatus: number;
  serviceType: number;
  googleRankingPage?: number;
  isMobileFriendly: boolean;
  hasLeadCapture: boolean;
  currentLeadGen: number;
  source?: string;
  status: number;
  outreachStage: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  outreachActivities: OutreachActivity[];
}
export interface OutreachActivity {
  id: number;
  prospectId: number;
  channel: number;
  templateCategory?: string;
  templateName?: string;
  subject?: string;
  responseStatus: number;
  notes?: string;
  sentAt: string;
  respondedAt?: string;
}
export interface TemplateSuggestion {
  channel: string;
  category: string;
  templateName: string;
  templateId: string;
  reason: string;
  priority: number;
}
export interface ProspectStats {
  totalProspects: number;
  byStatus: Record<string, number>;
  totalOutreach: number;
  byChannel: Record<string, number>;
  responseRate: number;
  positiveRate: number;
  needsFollowUp: number;
  topTemplates: { template: string; sent: number; responses: number; positive: number; responseRate: number }[];
}
export interface CreateProspectPayload {
  name: string;
  email?: string;
  phone?: string;
  companyName: string;
  city?: string;
  websiteUrl?: string;
  websiteStatus: number;
  serviceType: number;
  googleRankingPage?: number;
  isMobileFriendly: boolean;
  hasLeadCapture: boolean;
  currentLeadGen: number;
  source?: string;
  notes?: string;
}
export interface UpdateProspectPayload {
  status?: number;
  notes?: string;
}
export interface LogOutreachPayload {
  channel: number;
  templateCategory?: string;
  templateName?: string;
  subject?: string;
  notes?: string;
}
export interface OutreachTemplate {
  id: string;
  channel: string;
  category: string;
  name: string;
  subject?: string;
  body: string;
  placeholders: string[];
  sortOrder: number;
}
export interface TemplateGroup {
  channel: string;
  category: string;
  templates: {
    id: string;
    name: string;
    subject?: string;
    sortOrder: number;
    bodyPreview: string;
  }[];
}
export interface TemplatePreview {
  templateId: string;
  templateName: string;
  channel: string;
  subject?: string;
  body: string;
  prospectName: string;
  companyName: string;
}
// ── Template Analytics Types ─────────────────────────
export interface TemplateAnalyticsSummary {
  totalTemplatesUsed: number;
  totalSent: number;
  totalReplies: number;
  overallReplyRate: number;
  overallPositiveRate: number;
  totalConversions: number;
  overallConversionRate: number;
  bestTemplate?: string;
  bestTemplateReplyRate: number;
  worstTemplate?: string;
  worstTemplateReplyRate: number;
}
export interface TemplatePerformance {
  templateName: string;
  channel: string;
  category: string;
  timesSent: number;
  replies: number;
  positiveReplies: number;
  negativeReplies: number;
  questions: number;
  replyRate: number;
  positiveRate: number;
  conversions: number;
  conversionRate: number;
}
export interface ChannelPerformance {
  channel: string;
  totalSent: number;
  replies: number;
  positiveReplies: number;
  replyRate: number;
  positiveRate: number;
  conversions: number;
  conversionRate: number;
  uniqueProspects: number;
}
export interface CategoryPerformance {
  category: string;
  totalSent: number;
  replies: number;
  positiveReplies: number;
  replyRate: number;
  positiveRate: number;
  conversions: number;
  uniqueTemplates: number;
}
export interface SequenceStepPerformance {
  stepNumber: number;
  stepLabel: string;
  totalSent: number;
  replies: number;
  positiveReplies: number;
  replyRate: number;
  positiveRate: number;
  emailPerformance?: ChannelPerformance;
  linkedInPerformance?: ChannelPerformance;
}
export interface TemplateComparison {
  templateName: string;
  channel: string;
  timesSent: number;
  replies: number;
  replyRate: number;
  positiveReplies: number;
  positiveRate: number;
  conversions: number;
  conversionRate: number;
}
// ── Follow-up Sequence Types ─────────────────────────
export interface FollowUpStep {
  id: number;
  prospectId: number;
  prospectName: string;
  companyName: string;
  email?: string;
  phone?: string;
  stepNumber: number;
  stepLabel: string;
  scheduledDate: string;
  status: number;
  channel: number;
  suggestedTemplateName?: string;
  notes?: string;
  completedActivityId?: number;
  createdAt: string;
  completedAt?: string;
  isOverdue: boolean;
  daysUntilDue: number;
}
export interface FollowUpQueueStats {
  overdueCount: number;
  dueTodayCount: number;
  upcomingCount: number;
  totalScheduled: number;
  completedThisWeek: number;
  skippedThisWeek: number;
}
export interface CompleteFollowUpPayload {
  channel?: number;
  templateCategory?: string;
  templateName?: string;
  subject?: string;
  notes?: string;
}
// ── Client Onboarding Types ──────────────────────────
export interface ClientOnboarding {
  id: number;
  leadId?: number;
  prospectId?: number;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  services: string;
  serviceCities: string;
  businessDescription?: string;
  googleBusinessUrl?: string;
  existingWebsiteUrl?: string;
  socialMediaUrls?: string;
  preferredColors?: string;
  stylePreference?: string;
  specialRequests?: string;
  logoFileUrls?: string;
  photoFileUrls?: string;
  status: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateOnboardingPayload {
  leadId?: number;
  prospectId?: number;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  services: string;
  serviceCities: string;
  businessDescription?: string;
  googleBusinessUrl?: string;
  existingWebsiteUrl?: string;
  socialMediaUrls?: string;
  preferredColors?: string;
  stylePreference?: string;
  specialRequests?: string;
}
export interface UpdateOnboardingPayload {
  status?: number;
  adminNotes?: string;
}
// ── Client Delivery Pipeline ────────────────────────
export async function getDeliveryProjects(page = 1, pageSize = 25, status?: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status !== undefined) params.set("status", String(status));
  return apiFetch<Paginated<DeliveryProject>>(`/delivery?${params}`);
}
export async function getDeliveryProject(id: number) {
  return apiFetch<DeliveryProject>(`/delivery/${id}`);
}
export async function createDeliveryProject(data: CreateDeliveryProjectPayload) {
  return apiFetch<DeliveryProject>("/delivery", { method: "POST", body: JSON.stringify(data) });
}
export async function updateDeliveryProject(id: number, data: UpdateDeliveryProjectPayload) {
  return apiFetch<DeliveryProject>(`/delivery/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteDeliveryProject(id: number) {
  return apiFetch<{ message: string }>(`/delivery/${id}`, { method: "DELETE" });
}
export async function toggleDeliveryTask(projectId: number, taskId: number, data: UpdateDeliveryTaskPayload) {
  return apiFetch<DeliveryTask>(`/delivery/${projectId}/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function addDeliveryTask(projectId: number, data: CreateDeliveryTaskPayload) {
  return apiFetch<DeliveryTask>(`/delivery/${projectId}/tasks`, { method: "POST", body: JSON.stringify(data) });
}
export async function deleteDeliveryTask(projectId: number, taskId: number) {
  return apiFetch<{ message: string }>(`/delivery/${projectId}/tasks/${taskId}`, { method: "DELETE" });
}
// ── Delivery Pipeline Types ─────────────────────────
export interface DeliveryProject {
  id: number;
  clientName: string;
  businessName: string;
  contactEmail?: string;
  contactPhone?: string;
  onboardingId?: number;
  status: number;
  domainName?: string;
  hostingProvider?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tasks: DeliveryTask[];
  totalTasks: number;
  completedTasks: number;
  currentStage: number;
}
export interface DeliveryTask {
  id: number;
  deliveryProjectId: number;
  stage: number;
  stageName: string;
  taskName: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  sortOrder: number;
  createdAt: string;
}
export interface CreateDeliveryProjectPayload {
  clientName: string;
  businessName: string;
  contactEmail?: string;
  contactPhone?: string;
  onboardingId?: number;
  domainName?: string;
  hostingProvider?: string;
  notes?: string;
}
export interface UpdateDeliveryProjectPayload {
  status?: number;
  domainName?: string;
  hostingProvider?: string;
  notes?: string;
}
export interface UpdateDeliveryTaskPayload {
  isCompleted?: boolean;
  notes?: string;
}
export interface CreateDeliveryTaskPayload {
  stage: number;
  taskName: string;
  notes?: string;
}
// ── Client ROI Reports ──────────────────────────────
export async function getRoiReports(page = 1, pageSize = 25, status?: number) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
  if (status !== undefined) params.set("status", String(status));
  return apiFetch<Paginated<RoiReport>>(`/roi-reports?${params}`);
}
export async function getRoiReport(id: number) {
  return apiFetch<RoiReport>(`/roi-reports/${id}`);
}
export async function createRoiReport(data: CreateRoiReportPayload) {
  return apiFetch<RoiReport>("/roi-reports", { method: "POST", body: JSON.stringify(data) });
}
export async function updateRoiReport(id: number, data: UpdateRoiReportPayload) {
  return apiFetch<RoiReport>(`/roi-reports/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export async function deleteRoiReport(id: number) {
  return apiFetch<{ message: string }>(`/roi-reports/${id}`, { method: "DELETE" });
}
// ── ROI Report Types ────────────────────────────────
export interface RoiReport {
  id: number;
  deliveryProjectId?: number;
  clientName: string;
  businessName: string;
  contactEmail?: string;
  reportPeriod: string;
  reportDate: string;
  status: number;
  searchImpressions: number;
  searchClicks: number;
  clickThroughRate: number;
  topKeywords: string;
  totalVisitors: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  topPages: string;
  bounceRate: number;
  gbpViews: number;
  gbpSearches: number;
  gbpCalls: number;
  gbpDirectionRequests: number;
  gbpWebsiteClicks: number;
  formSubmissions: number;
  phoneCallLeads: number;
  totalLeads: number;
  keywordRankings: string;
  serviceCost: number;
  avgJobSize: number;
  estimatedPipelineValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateRoiReportPayload {
  clientName: string;
  businessName: string;
  contactEmail?: string;
  deliveryProjectId?: number;
  reportPeriod: string;
  reportDate: string;
}
export interface UpdateRoiReportPayload {
  status?: number;
  reportPeriod?: string;
  reportDate?: string;
  contactEmail?: string;
  searchImpressions?: number;
  searchClicks?: number;
  clickThroughRate?: number;
  topKeywords?: string;
  totalVisitors?: number;
  uniqueVisitors?: number;
  avgSessionDuration?: number;
  topPages?: string;
  bounceRate?: number;
  gbpViews?: number;
  gbpSearches?: number;
  gbpCalls?: number;
  gbpDirectionRequests?: number;
  gbpWebsiteClicks?: number;
  formSubmissions?: number;
  phoneCallLeads?: number;
  totalLeads?: number;
  keywordRankings?: string;
  serviceCost?: number;
  avgJobSize?: number;
  estimatedPipelineValue?: number;
  notes?: string;
}