"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  getDeliveryProjects,
  getDeliveryProject,
  createDeliveryProject,
  updateDeliveryProject,
  deleteDeliveryProject,
  toggleDeliveryTask,
  addDeliveryTask,
  deleteDeliveryTask,
  createRoiReport,
  DELIVERY_STATUSES,
  type DeliveryProject,
  type DeliveryTask,
} from "@/lib/api";
import Link from "next/link";

type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

const STATUS_COLORS: Record<DeliveryStatus, string> = {
  "Not Started": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Foundation: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Website Build": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "SEO & Backlinks": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Lead Capture": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Launch: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "Post-Launch": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Completed: "bg-green-500/10 text-green-400 border-green-500/20",
};

const STAGE_META: { num: number; name: string; color: string; bg: string }[] = [
  { num: 1, name: "Foundation Setup", color: "text-blue-400", bg: "bg-blue-500" },
  { num: 2, name: "Website Build", color: "text-purple-400", bg: "bg-purple-500" },
  { num: 3, name: "SEO & Backlinks", color: "text-orange-400", bg: "bg-orange-500" },
  { num: 4, name: "Lead Capture Wiring", color: "text-cyan-400", bg: "bg-cyan-500" },
  { num: 5, name: "Launch & Verification", color: "text-yellow-400", bg: "bg-yellow-500" },
  { num: 6, name: "Post-Launch", color: "text-emerald-400", bg: "bg-emerald-500" },
];

// ─── Create Project Modal ───────────────────────────────────────────────────
function CreateProjectModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [domainName, setDomainName] = useState("");
  const [hostingProvider, setHostingProvider] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !businessName.trim()) return;
    setSaving(true);
    setError("");
    try {
      await createDeliveryProject({
        clientName: clientName.trim(),
        businessName: businessName.trim(),
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        domainName: domainName.trim() || undefined,
        hostingProvider: hostingProvider.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New Delivery Project</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground text-xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Client Name *</label>
              <input type="text" required value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Smith" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Business Name *</label>
              <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Smith Contracting" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Email</label>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="john@smith.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Phone</label>
              <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="(541) 555-0100" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Domain</label>
              <input type="text" value={domainName} onChange={(e) => setDomainName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="smithcontracting.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Hosting</label>
              <input type="text" value={hostingProvider} onChange={(e) => setHostingProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Vercel, Netlify, etc." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Any initial notes about this project..." />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-full border border-border text-sm text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200">
              {saving ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add Task Modal ─────────────────────────────────────────────────────────
function AddTaskModal({ stageNum, onClose, onAdded }: { stageNum: number; onClose: () => void; onAdded: (taskName: string) => void }) {
  const [taskName, setTaskName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!taskName.trim()) return;
    onAdded(taskName.trim());
    onClose();
  }

  const stageName = STAGE_META.find((s) => s.num === stageNum)?.name || `Stage ${stageNum}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-bold mb-4">Add Task to {stageName}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required value={taskName} onChange={(e) => setTaskName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Task name..." autoFocus />
          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 px-3 py-2 rounded-full border border-border text-xs text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-full text-xs font-medium transition-all duration-200">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Project Detail Modal ───────────────────────────────────────────────────
function ProjectDetail({ project: initial, onClose, onUpdated }: {
  project: DeliveryProject;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [project, setProject] = useState(initial);
  const [domainName, setDomainName] = useState(initial.domainName || "");
  const [hostingProvider, setHostingProvider] = useState(initial.hostingProvider || "");
  const [notes, setNotes] = useState(initial.notes || "");
  const [saving, setSaving] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(() => {
    // Auto-expand the current active stage
    const active = new Set<number>();
    for (const s of STAGE_META) {
      const stageTasks = initial.tasks.filter((t) => t.stage === s.num);
      const allDone = stageTasks.length > 0 && stageTasks.every((t) => t.isCompleted);
      if (!allDone && stageTasks.length > 0) {
        active.add(s.num);
        break;
      }
    }
    if (active.size === 0 && initial.tasks.length > 0) active.add(1);
    return active;
  });
  const [addTaskStage, setAddTaskStage] = useState<number | null>(null);
  const [taskNoteEditing, setTaskNoteEditing] = useState<number | null>(null);
  const [taskNoteValue, setTaskNoteValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  function toggleStage(num: number) {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  }

  async function handleToggleTask(task: DeliveryTask) {
    try {
      const updated = await toggleDeliveryTask(project.id, task.id, { isCompleted: !task.isCompleted });
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === task.id ? updated : t)),
        completedTasks: prev.completedTasks + (updated.isCompleted ? 1 : -1),
      }));
    } catch {
      alert("Failed to update task");
    }
  }

  async function handleSaveTaskNote(task: DeliveryTask) {
    try {
      const updated = await toggleDeliveryTask(project.id, task.id, { notes: taskNoteValue || undefined });
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === task.id ? updated : t)),
      }));
      setTaskNoteEditing(null);
    } catch {
      alert("Failed to save note");
    }
  }

  async function handleAddTask(taskName: string) {
    if (addTaskStage === null) return;
    try {
      const newTask = await addDeliveryTask(project.id, { stage: addTaskStage, taskName });
      setProject((prev) => ({
        ...prev,
        tasks: [...prev.tasks, newTask],
        totalTasks: prev.totalTasks + 1,
      }));
    } catch {
      alert("Failed to add task");
    }
  }

  async function handleDeleteTask(task: DeliveryTask) {
    try {
      await deleteDeliveryTask(project.id, task.id);
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== task.id),
        totalTasks: prev.totalTasks - 1,
        completedTasks: task.isCompleted ? prev.completedTasks - 1 : prev.completedTasks,
      }));
    } catch {
      alert("Failed to delete task");
    }
  }

  async function handleSaveProject() {
    setSaving(true);
    try {
      await updateDeliveryProject(project.id, {
        domainName: domainName.trim() || undefined,
        hostingProvider: hostingProvider.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onUpdated();
    } catch {
      alert("Failed to update project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteProject() {
    try {
      await deleteDeliveryProject(project.id);
      onUpdated();
      onClose();
    } catch {
      alert("Failed to delete project");
    }
  }

  async function handleGenerateReport() {
    setGeneratingReport(true);
    try {
      await createRoiReport({
        clientName: project.clientName,
        businessName: project.businessName,
        contactEmail: project.contactEmail || undefined,
        deliveryProjectId: project.id,
        reportPeriod: "30-Day Check",
        reportDate: new Date().toISOString().split("T")[0],
      });
      alert("ROI Report created! Go to Reports to fill in the data.");
      onUpdated();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create report");
    } finally {
      setGeneratingReport(false);
    }
  }

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.isCompleted).length;
  const pct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border rounded-t-2xl px-8 py-5 z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">{project.businessName}</h2>
              <p className="text-sm text-muted">{project.clientName}{project.contactEmail ? ` \u00b7 ${project.contactEmail}` : ""}</p>
            </div>
            <button onClick={onClose} className="text-muted hover:text-foreground text-xl ml-4">&times;</button>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted">{completedTasks} of {totalTasks} tasks</span>
              <span className={`font-bold ${pct === 100 ? "text-green-400" : "text-foreground"}`}>{pct}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Cross-stage link */}
          {project.onboardingId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Linked from:</span>
              <Link
                href="/admin/onboarding"
                className="text-xs text-primary hover:text-primary-light transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Onboarding #{project.onboardingId}
              </Link>
            </div>
          )}

          {/* Project Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Domain</label>
              <input type="text" value={domainName} onChange={(e) => setDomainName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="example.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Hosting</label>
              <input type="text" value={hostingProvider} onChange={(e) => setHostingProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Vercel, Netlify, etc." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1">Project Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Notes about this project..." />
          </div>
          <button onClick={handleSaveProject} disabled={saving}
            className="px-4 py-2 rounded-full bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-xs font-medium transition-all duration-200">
            {saving ? "Saving..." : "Save Project Info"}
          </button>

          <hr className="border-border" />

          {/* Stage Checklist */}
          <div className="space-y-3">
            {STAGE_META.map((stage) => {
              const stageTasks = project.tasks
                .filter((t) => t.stage === stage.num)
                .sort((a, b) => a.sortOrder - b.sortOrder);
              const stageCompleted = stageTasks.filter((t) => t.isCompleted).length;
              const stageTotal = stageTasks.length;
              const allDone = stageTotal > 0 && stageCompleted === stageTotal;
              const isExpanded = expandedStages.has(stage.num);

              return (
                <div key={stage.num} className="border border-border rounded-xl overflow-hidden">
                  {/* Stage Header */}
                  <button
                    onClick={() => toggleStage(stage.num)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      allDone ? "bg-green-500/20 text-green-400" : `${stage.bg}/20 ${stage.color}`
                    }`}>
                      {allDone ? "\u2713" : stage.num}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${allDone ? "text-green-400" : "text-foreground"}`}>
                          {stage.name}
                        </span>
                        <span className="text-xs text-muted">
                          {stageCompleted}/{stageTotal}
                        </span>
                      </div>
                      {stageTotal > 0 && (
                        <div className="w-full h-1 bg-border rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${allDone ? "bg-green-500" : stage.bg}`}
                            style={{ width: `${stageTotal > 0 ? (stageCompleted / stageTotal) * 100 : 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <svg className={`w-4 h-4 text-muted transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Tasks */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      {stageTasks.length === 0 ? (
                        <p className="px-5 py-3 text-xs text-muted">No tasks in this stage.</p>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {stageTasks.map((task) => (
                            <div key={task.id} className="flex items-start gap-3 px-5 py-3 group hover:bg-white/[0.02]">
                              <button
                                onClick={() => handleToggleTask(task)}
                                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                                  task.isCompleted
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "border-border hover:border-primary"
                                }`}
                              >
                                {task.isCompleted && (
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <span className={`text-sm ${task.isCompleted ? "text-muted line-through" : "text-foreground"}`}>
                                  {task.taskName}
                                </span>
                                {task.isCompleted && task.completedAt && (
                                  <span className="text-xs text-muted ml-2">
                                    {new Date(task.completedAt).toLocaleDateString()}
                                  </span>
                                )}
                                {/* Task note */}
                                {taskNoteEditing === task.id ? (
                                  <div className="mt-1 flex gap-2">
                                    <input type="text" value={taskNoteValue} onChange={(e) => setTaskNoteValue(e.target.value)}
                                      className="flex-1 px-2 py-1 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                                      placeholder="Add a note..." autoFocus
                                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveTaskNote(task); if (e.key === "Escape") setTaskNoteEditing(null); }} />
                                    <button onClick={() => handleSaveTaskNote(task)}
                                      className="px-2 py-1 rounded bg-primary text-white text-xs">Save</button>
                                    <button onClick={() => setTaskNoteEditing(null)}
                                      className="px-2 py-1 rounded border border-border text-xs text-muted">Cancel</button>
                                  </div>
                                ) : task.notes ? (
                                  <p className="text-xs text-muted mt-0.5 cursor-pointer hover:text-foreground"
                                    onClick={() => { setTaskNoteEditing(task.id); setTaskNoteValue(task.notes || ""); }}>
                                    {task.notes}
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => { setTaskNoteEditing(task.id); setTaskNoteValue(task.notes || ""); }}
                                  className="p-1 rounded text-muted hover:text-foreground" title="Add note">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task)}
                                  className="p-1 rounded text-muted hover:text-red-400" title="Remove task">
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {/* Add task button */}
                      <div className="px-5 py-2 border-t border-border/50">
                        <button
                          onClick={() => setAddTaskStage(stage.num)}
                          className="text-xs text-muted hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Add task
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Generate Report — available at any active stage */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <p className="text-xs text-blue-400 mb-2">Create an ROI report to track this client&apos;s performance metrics.</p>
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={generatingReport}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
            >
              {generatingReport ? "Creating Report..." : "Generate ROI Report"}
            </button>
          </div>

          <hr className="border-border" />

          {/* Danger zone */}
          <div>
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-red-400">Delete this project and all tasks? This cannot be undone.</span>
                <button onClick={handleDeleteProject}
                  className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-medium transition-colors">
                  Yes, Delete
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-muted hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)}
                className="text-xs text-muted hover:text-red-400 transition-colors">
                Delete Project
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Task Sub-modal */}
      {addTaskStage !== null && (
        <AddTaskModal
          stageNum={addTaskStage}
          onClose={() => setAddTaskStage(null)}
          onAdded={handleAddTask}
        />
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdminDeliveryPage() {
  const [projects, setProjects] = useState<DeliveryProject[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<DeliveryProject | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeliveryProjects(page, pageSize, filterStatus);
      setProjects(data.items);
      setTotal(data.total);
    } catch {
      console.error("Failed to load delivery projects");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filterStatus]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  async function handleSelectProject(p: DeliveryProject) {
    try {
      const full = await getDeliveryProject(p.id);
      setSelected(full);
    } catch {
      alert("Failed to load project details");
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  // Summary stats
  const activeCount = projects.filter((p) => p.status > 0 && p.status < 7).length;
  const completedCount = projects.filter((p) => p.status === 7).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Client Delivery</h1>
            <p className="text-sm text-muted mt-1">
              {total} project{total !== 1 ? "s" : ""}
              {activeCount > 0 && <span> &middot; {activeCount} active</span>}
              {completedCount > 0 && <span> &middot; {completedCount} completed</span>}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200"
          >
            + New Project
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setFilterStatus(undefined); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              filterStatus === undefined
                ? "bg-foreground/10 text-foreground border-foreground/20"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {DELIVERY_STATUSES.map((s, i) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(i); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                filterStatus === i
                  ? STATUS_COLORS[s]
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Project Cards */}
        {loading ? (
          <div className="p-12 text-center text-muted text-sm">Loading delivery projects...</div>
        ) : projects.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            <p className="text-muted text-sm">No delivery projects yet.</p>
            <p className="text-muted/60 text-xs mt-2">Create a new project when a client pays and you&apos;re ready to start building.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const pct = project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0;
              const statusLabel = DELIVERY_STATUSES[project.status] || "Unknown";
              const currentStageMeta = STAGE_META.find((s) => s.num === project.currentStage);

              return (
                <div
                  key={project.id}
                  onClick={() => handleSelectProject(project)}
                  className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{project.businessName}</h3>
                      <p className="text-xs text-muted">{project.clientName}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium border shrink-0 ${STATUS_COLORS[statusLabel as DeliveryStatus] || ""}`}>
                      {statusLabel}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted">{project.completedTasks}/{project.totalTasks} tasks</span>
                      <span className={`font-bold ${pct === 100 ? "text-green-400" : "text-foreground"}`}>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage indicators */}
                  <div className="flex gap-1">
                    {STAGE_META.map((stage) => {
                      const isActive = currentStageMeta?.num === stage.num;
                      const isPast = project.currentStage > stage.num;
                      return (
                        <div
                          key={stage.num}
                          className={`flex-1 h-1 rounded-full transition-all ${
                            isPast || (pct === 100) ? "bg-green-500" : isActive ? stage.bg : "bg-border"
                          }`}
                          title={stage.name}
                        />
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 text-[10px] text-muted">
                    {project.domainName && <span>{project.domainName}</span>}
                    <span className="ml-auto">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-xs text-muted">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">
                Previous
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchProjects}
        />
      )}
      {selected && (
        <ProjectDetail
          project={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { fetchProjects(); setSelected(null); }}
        />
      )}
    </div>
  );
}