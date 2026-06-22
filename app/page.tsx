"use client";

import { useState, useEffect, useRef } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createStatus, setCreateStatus] = useState<TaskStatus>("TODO");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        if (!cancelled) setTasks(data);
      } catch {
        if (!cancelled) setError("Failed to load tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          status: createStatus,
        }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      setTitle("");
      setDescription("");
      setCreateStatus("TODO");
      await fetchTasks();
    } catch {
      setError("Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const setStatus = async (task: Task, newStatus: TaskStatus) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      await fetchTasks();
    } catch {
      setError("Failed to update task status");
    }
  };

  const saveEdit = async (id: number) => {
    if (!editTitle.trim()) return;
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title: editTitle.trim(),
          description: editDescription.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      setEditingId(null);
      await fetchTasks();
    } catch {
      setError("Failed to save changes");
    }
  };

  const deleteTask = async (id: number) => {
    setOpenMenuId(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to delete task");
      await fetchTasks();
    } catch {
      setError("Failed to delete task");
    }
  };

  return (
    <main className="flex flex-1 items-start justify-center pt-12">
      <div className="w-full max-w-2xl mx-auto p-6">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm">
          {/* Header */}
          <div className="px-5 pt-5 pb-3">
            <h1 className="text-xl font-semibold text-[var(--foreground)]">
              My Tasks
            </h1>
          </div>

          {error && (
            <div className="mx-5 mb-3 p-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-blue-400 hover:text-blue-600 font-bold"
              >
                &times;
              </button>
            </div>
          )}

          {/* Add Task */}
          <form onSubmit={createTask} className="px-5 pb-3">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating || !title.trim()}
                className="w-6 h-6 flex items-center justify-center rounded-full border-2 border-[var(--accent)] text-[var(--accent)] shrink-0 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
              >
                +
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task"
                className="flex-1 text-sm py-1.5 px-2 bg-transparent border-none outline-none placeholder:text-[var(--muted)] text-[var(--foreground)]"
              />
            </div>
            {title.trim() && (
              <div className="ml-9 mt-1 space-y-1">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add description"
                  rows={1}
                  className="w-full text-xs py-1 px-2 bg-transparent border-none outline-none placeholder:text-[var(--muted)] text-[var(--muted)] resize-none"
                />
                <select
                  value={createStatus}
                  onChange={(e) => setCreateStatus(e.target.value as TaskStatus)}
                  className="text-xs py-1 px-2 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>
            )}
          </form>

          <div className="border-t border-[var(--border)]" />

          {loading ? (
            <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-[var(--muted)]">
              No tasks yet. Add one above!
            </div>
          ) : (
            <div>
              {(["IN_PROGRESS", "TODO", "DONE"] as TaskStatus[]).map(
                (status) => {
                  const group = tasks.filter((t) => t.status === status);
                  if (group.length === 0) return null;
                  const label =
                    status === "IN_PROGRESS"
                      ? "In Progress"
                      : status === "TODO"
                        ? "To Do"
                        : "Done";
                  return (
                    <div key={status}>
                      <div className="px-5 pt-3 pb-1 text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
                        {label}
                      </div>
                      <ul>
                        {group.map((task) => (
                          <li key={task.id} className="group">
                            {editingId === task.id ? (
                              <div className="px-5 py-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-6 h-6 shrink-0" />
                                  <div className="flex-1 space-y-2">
                                    <input
                                      type="text"
                                      value={editTitle}
                                      onChange={(e) =>
                                        setEditTitle(e.target.value)
                                      }
                                      className="w-full text-sm py-1.5 px-2 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                    />
                                    <textarea
                                      value={editDescription}
                                      onChange={(e) =>
                                        setEditDescription(e.target.value)
                                      }
                                      rows={1}
                                      className="w-full text-xs py-1 px-2 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] resize-none"
                                    />
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => saveEdit(task.id)}
                                        className="px-3 py-1 bg-[var(--accent)] text-white rounded-full hover:bg-[var(--accent-hover)] text-xs transition-colors"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 text-xs transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                                {/* Circle checkbox */}
                                <button
                                  onClick={() =>
                                    setStatus(
                                      task,
                                      task.status === "DONE" ? "TODO" : "DONE",
                                    )
                                  }
                                  title={
                                    task.status === "DONE"
                                      ? "Mark as not done"
                                      : "Mark as done"
                                  }
                                  className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                                    task.status === "DONE"
                                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                                      : "border-slate-300 hover:border-[var(--accent)]"
                                  }`}
                                >
                                  {task.status === "DONE" && (
                                    <svg
                                      className="w-3 h-3"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M2 6l3 3 5-6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>

                                {/* Title + Description */}
                                <div className="flex-1 min-w-0">
                                  <h3
                                    className={`text-sm font-medium leading-snug ${task.status === "DONE" ? "line-through text-[var(--muted)]" : "text-[var(--foreground)]"}`}
                                  >
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-xs text-[var(--muted)] mt-0.5 truncate">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                {/* Status dropdown */}
                                <select
                                  value={task.status}
                                  onChange={(e) =>
                                    setStatus(task, e.target.value as TaskStatus)
                                  }
                                  className="text-xs py-1 px-1.5 border border-[var(--input-border)] rounded-lg bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] shrink-0 cursor-pointer"
                                >
                                  <option value="TODO">To Do</option>
                                  <option value="IN_PROGRESS">In Progress</option>
                                  <option value="DONE">Done</option>
                                </select>

                                {/* Three-dot menu */}
                                <div
                                  className="relative"
                                  ref={
                                    openMenuId === task.id ? menuRef : undefined
                                  }
                                >
                                  <button
                                    onClick={() =>
                                      setOpenMenuId(
                                        openMenuId === task.id ? null : task.id,
                                      )
                                    }
                                    title="More options"
                                    className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full text-slate-400 hover:text-[var(--foreground)] hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <circle cx="12" cy="5" r="1.5" />
                                      <circle cx="12" cy="12" r="1.5" />
                                      <circle cx="12" cy="19" r="1.5" />
                                    </svg>
                                  </button>
                                  {openMenuId === task.id && (
                                    <div className="absolute right-0 top-full mt-1 w-36 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg z-10 py-1">
                                      <button
                                        onClick={() => {
                                          setEditingId(task.id);
                                          setEditTitle(task.title);
                                          setEditDescription(
                                            task.description ?? "",
                                          );
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-[var(--foreground)] hover:bg-slate-50 transition-colors"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => deleteTask(task.id)}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
