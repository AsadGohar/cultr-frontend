import { type ReactNode, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import {
  Button,
  Dropdown,
  Input,
  StatusChip,
  useToast,
} from "../components/cultre-ui";

type LifecycleType = "onboarding" | "offboarding" | "asset_assignment";
type TemplateStatus = "draft" | "active" | "archived";
type ProcessStatus = "not_started" | "in_progress" | "completed";
type TaskStatus = "pending" | "in_progress" | "completed";

export interface LifecycleTemplate {
  id: string;
  organizationId: string;
  type: LifecycleType;
  name: string;
  status: TemplateStatus;
}

export interface LifecycleTemplateTask {
  id: string;
  lifecycleTemplateId: string;
  name: string;
  roleId: string;
  dueOffset: number;
  dependsOnTaskId: string | null;
}

export interface LifecycleProcess {
  id: string;
  userId: string;
  templateId: string;
  status: ProcessStatus;
  startedOn: string;
  taskStatuses: Record<string, TaskStatus>;
}

type TaskDraft = Omit<LifecycleTemplateTask, "lifecycleTemplateId">;

const organizationId = "demo-organization";

const people = [
  { value: "user-daniel", label: "Daniel Yuen", description: "Product" },
  { value: "user-sophie", label: "Sophie Müller", description: "Design" },
  { value: "user-carlos", label: "Carlos Rivera", description: "Operations" },
  { value: "user-priya", label: "Priya Kapoor", description: "Finance" },
];

const roles = [
  { value: "role-employee", label: "Employee" },
  { value: "role-manager", label: "Manager" },
  { value: "role-people", label: "People team" },
  { value: "role-it", label: "IT administrator" },
  { value: "role-finance", label: "Finance" },
];

const initialTemplates: LifecycleTemplate[] = [
  {
    id: "template-onboarding",
    organizationId,
    type: "onboarding",
    name: "Standard employee onboarding",
    status: "active",
  },
  {
    id: "template-offboarding",
    organizationId,
    type: "offboarding",
    name: "Secure employee offboarding",
    status: "active",
  },
  {
    id: "template-contractor",
    organizationId,
    type: "onboarding",
    name: "Contractor onboarding",
    status: "draft",
  },
];

const initialTasks: LifecycleTemplateTask[] = [
  {
    id: "task-1",
    lifecycleTemplateId: "template-onboarding",
    name: "Collect employment documents",
    roleId: "role-people",
    dueOffset: -5,
    dependsOnTaskId: null,
  },
  {
    id: "task-2",
    lifecycleTemplateId: "template-onboarding",
    name: "Prepare laptop and accounts",
    roleId: "role-it",
    dueOffset: -2,
    dependsOnTaskId: "task-1",
  },
  {
    id: "task-3",
    lifecycleTemplateId: "template-onboarding",
    name: "Schedule manager welcome",
    roleId: "role-manager",
    dueOffset: 0,
    dependsOnTaskId: "task-2",
  },
  {
    id: "task-4",
    lifecycleTemplateId: "template-onboarding",
    name: "Complete first-week check-in",
    roleId: "role-people",
    dueOffset: 5,
    dependsOnTaskId: "task-3",
  },
  {
    id: "task-5",
    lifecycleTemplateId: "template-offboarding",
    name: "Confirm final working day",
    roleId: "role-people",
    dueOffset: -7,
    dependsOnTaskId: null,
  },
  {
    id: "task-6",
    lifecycleTemplateId: "template-offboarding",
    name: "Revoke system access",
    roleId: "role-it",
    dueOffset: 0,
    dependsOnTaskId: "task-5",
  },
  {
    id: "task-7",
    lifecycleTemplateId: "template-offboarding",
    name: "Recover company equipment",
    roleId: "role-manager",
    dueOffset: 0,
    dependsOnTaskId: "task-5",
  },
  {
    id: "task-8",
    lifecycleTemplateId: "template-offboarding",
    name: "Process final payment",
    roleId: "role-finance",
    dueOffset: 3,
    dependsOnTaskId: "task-6",
  },
  {
    id: "task-9",
    lifecycleTemplateId: "template-contractor",
    name: "Sign contractor agreement",
    roleId: "role-people",
    dueOffset: -3,
    dependsOnTaskId: null,
  },
  {
    id: "task-10",
    lifecycleTemplateId: "template-contractor",
    name: "Provision limited access",
    roleId: "role-it",
    dueOffset: -1,
    dependsOnTaskId: "task-9",
  },
];

const initialProcesses: LifecycleProcess[] = [
  {
    id: "process-1",
    userId: "user-daniel",
    templateId: "template-onboarding",
    status: "in_progress",
    startedOn: "2026-08-21",
    taskStatuses: {
      "task-1": "completed",
      "task-2": "completed",
      "task-3": "in_progress",
      "task-4": "pending",
    },
  },
  {
    id: "process-2",
    userId: "user-carlos",
    templateId: "template-offboarding",
    status: "in_progress",
    startedOn: "2026-08-23",
    taskStatuses: {
      "task-5": "completed",
      "task-6": "in_progress",
      "task-7": "pending",
      "task-8": "pending",
    },
  },
];

const roleLabel = (roleId: string) =>
  roles.find(role => role.value === roleId)?.label ?? roleId;

const personLabel = (userId: string) =>
  people.find(person => person.value === userId)?.label ?? userId;

const statusVariant = (status: TemplateStatus | ProcessStatus | TaskStatus) => {
  if (status === "active" || status === "completed") return "success" as const;
  if (status === "draft" || status === "in_progress") return "pending" as const;
  if (status === "archived") return "neutral" as const;
  return "neutral" as const;
};

const statusLabel = (status: string) => status.replaceAll("_", " ");

function Modal({
  open,
  title,
  description,
  onClose,
  children,
  wide = false,
  scrollBody = true,
  fillViewport = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
  scrollBody?: boolean;
  fillViewport?: boolean;
}) {
  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyOverscrollBehavior =
      document.body.style.overscrollBehavior;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.documentElement.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden overscroll-none px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label={`Close ${title} dialog`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="playbook-modal-title"
        className={`relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) shadow-2xl ${wide ? "max-w-[900px]" : "max-w-[600px]"} ${fillViewport ? "h-[92dvh]" : ""}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-(--color-line-light) px-6 py-5">
          <div>
            <h2
              id="playbook-modal-title"
              className="font-display text-xl font-700 text-(--color-ink)"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-[13px] text-(--color-sage-dim)">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-(--color-sage-dim) transition-colors hover:text-(--color-ink)"
            aria-label="Close dialog"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </header>
        <div
          className={`min-h-0 flex-1 ${scrollBody ? "touch-pan-y overflow-y-auto overscroll-contain" : "overflow-hidden"}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

function PlaybookEditor({
  open,
  template,
  tasks,
  onClose,
  onSave,
}: {
  open: boolean;
  template: LifecycleTemplate | null;
  tasks: LifecycleTemplateTask[];
  onClose: () => void;
  onSave: (template: LifecycleTemplate, tasks: LifecycleTemplateTask[]) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<LifecycleType>("onboarding");
  const [status, setStatus] = useState<TemplateStatus>("draft");
  const [taskDrafts, setTaskDrafts] = useState<TaskDraft[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(template?.name ?? "");
    setType(template?.type ?? "onboarding");
    setStatus(template?.status ?? "draft");
    setTaskDrafts(
      template
        ? tasks.map(({ lifecycleTemplateId: _templateId, ...task }) => task)
        : [
            {
              id: crypto.randomUUID(),
              name: "",
              roleId: "",
              dueOffset: 0,
              dependsOnTaskId: null,
            },
          ]
    );
  }, [open, tasks, template]);

  const addTask = () => {
    setTaskDrafts(current => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: "",
        roleId: "",
        dueOffset: 0,
        dependsOnTaskId: null,
      },
    ]);
  };

  const updateTask = (taskId: string, patch: Partial<TaskDraft>) => {
    setTaskDrafts(current =>
      current.map(task => (task.id === taskId ? { ...task, ...patch } : task))
    );
  };

  const removeTask = (taskId: string) => {
    setTaskDrafts(current =>
      current
        .filter(task => task.id !== taskId)
        .map(task =>
          task.dependsOnTaskId === taskId
            ? { ...task, dependsOnTaskId: null }
            : task
        )
    );
  };

  const save = () => {
    const templateId = template?.id ?? crypto.randomUUID();
    onSave(
      { id: templateId, organizationId, type, name: name.trim(), status },
      taskDrafts.map(task => ({
        ...task,
        name: task.name.trim(),
        lifecycleTemplateId: templateId,
      }))
    );
  };

  const valid =
    Boolean(name.trim()) &&
    taskDrafts.length > 0 &&
    taskDrafts.every(task => task.name.trim() && task.roleId);

  return (
    <Modal
      open={open}
      title={template ? "Edit playbook" : "Create playbook"}
      description="Define a reusable lifecycle template and the tasks it creates."
      onClose={onClose}
      wide
      scrollBody={false}
      fillViewport
    >
      <form
        className="flex h-full min-h-0 flex-col"
        onSubmit={event => {
          event.preventDefault();
          save();
        }}
      >
        <div className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              autoFocus
              required
              label="Playbook name"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g. Executive onboarding"
              className="md:col-span-1"
            />
            <Dropdown
              label="Lifecycle type"
              value={type}
              onChange={value => setType(value as LifecycleType)}
              options={[
                { value: "asset_assignment", label: "Asset assignment" },
                { value: "onboarding", label: "Onboarding" },
                { value: "offboarding", label: "Offboarding" },
              ]}
            />
            <Dropdown
              label="Status"
              value={status}
              onChange={value => setStatus(value as TemplateStatus)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "active", label: "Active" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>

          <section className="mt-6">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-display text-[15px] font-600 text-(--color-ink)">
                  Template tasks
                </h3>
                <p className="mt-1 text-[13px] text-(--color-sage-dim)">
                  Offsets are relative to the employee&apos;s lifecycle date.
                </p>
              </div>
              <button
                type="button"
                onClick={addTask}
                className="font-mono text-[11px] uppercase tracking-widest text-(--color-coral) hover:underline"
              >
                + Add task
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {taskDrafts.map((task, index) => {
                const dependencyOptions = taskDrafts
                  .slice(0, index)
                  .filter(candidate => candidate.name.trim())
                  .map(candidate => ({
                    value: candidate.id,
                    label: candidate.name,
                  }));
                return (
                  <div
                    key={task.id}
                    className="rounded-[9px] border border-(--color-line-light) bg-(--color-offwhite) p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                        Task {index + 1}
                      </span>
                      {taskDrafts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTask(task.id)}
                          className="font-mono text-[10px] uppercase tracking-widest text-(--color-coral) hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-[2fr_1.25fr_0.8fr_1.4fr]">
                      <Input
                        required
                        label="Task name"
                        value={task.name}
                        onChange={event =>
                          updateTask(task.id, { name: event.target.value })
                        }
                        placeholder="What needs to happen?"
                      />
                      <Dropdown
                        label="Owner role"
                        value={task.roleId}
                        onChange={value =>
                          updateTask(task.id, { roleId: value as string })
                        }
                        options={roles}
                        placeholder="Select role"
                      />
                      <Input
                        required
                        type="number"
                        label="Due offset"
                        value={task.dueOffset}
                        onChange={event =>
                          updateTask(task.id, {
                            dueOffset: Number(event.target.value),
                          })
                        }
                        hint="Days"
                      />
                      <Dropdown
                        label="Depends on"
                        value={task.dependsOnTaskId ?? ""}
                        onChange={value =>
                          updateTask(task.id, {
                            dependsOnTaskId: (value as string) || null,
                          })
                        }
                        options={[
                          { value: "", label: "No dependency" },
                          ...dependencyOptions,
                        ]}
                        disabled={index === 0}
                        placeholder="No dependency"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-(--color-line-light) bg-(--color-offwhite-raised) px-6 py-4 shadow-[0_-8px_24px_rgba(11,20,38,0.04)]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[6px] px-5 py-3 font-display text-[14px] font-600 text-(--color-sage-dim) hover:text-(--color-ink)"
          >
            Cancel
          </button>
          <Button type="submit" disabled={!valid}>
            {template ? "Save changes" : "Create playbook"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function StartProcessModal({
  template,
  taskCount,
  onClose,
  onStart,
}: {
  template: LifecycleTemplate | null;
  taskCount: number;
  onClose: () => void;
  onStart: (userId: string) => void;
}) {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (template) setUserId("");
  }, [template]);

  return (
    <Modal
      open={Boolean(template)}
      title="Start lifecycle process"
      description="Create an employee-specific instance from this playbook."
      onClose={onClose}
    >
      {template && (
        <form
          className="flex flex-col gap-5 p-6"
          onSubmit={event => {
            event.preventDefault();
            onStart(userId);
          }}
        >
          <div className="rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite) p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-[15px] font-600 text-(--color-ink)">
                  {template.name}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                  {statusLabel(template.type)} · {taskCount} tasks
                </p>
              </div>
              <StatusChip variant={statusVariant(template.status)}>
                {template.status}
              </StatusChip>
            </div>
          </div>
          <Dropdown
            label="Employee"
            value={userId}
            onChange={value => setUserId(value as string)}
            options={people}
            placeholder="Select an employee"
            searchable
          />
          <p className="text-[13px] leading-5 text-(--color-sage-dim)">
            Starting the process copies every template task into a trackable
            checklist for the selected employee.
          </p>
          <div className="flex justify-end gap-3 border-t border-(--color-line-light) pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[6px] px-5 py-3 font-display text-[14px] font-600 text-(--color-sage-dim) hover:text-(--color-ink)"
            >
              Cancel
            </button>
            <Button type="submit" disabled={!userId}>
              Start process
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function ProcessModal({
  process,
  template,
  tasks,
  onClose,
  onTaskChange,
}: {
  process: LifecycleProcess | null;
  template: LifecycleTemplate | null;
  tasks: LifecycleTemplateTask[];
  onClose: () => void;
  onTaskChange: (taskId: string, status: TaskStatus) => void;
}) {
  const completed = process
    ? tasks.filter(task => process.taskStatuses[task.id] === "completed").length
    : 0;

  return (
    <Modal
      open={Boolean(process && template)}
      title={process ? personLabel(process.userId) : "Lifecycle process"}
      description={template?.name}
      onClose={onClose}
    >
      {process && template && (
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                {statusLabel(template.type)} · Started {process.startedOn}
              </p>
              <p className="mt-1 text-[13px] text-(--color-ink)">
                {completed} of {tasks.length} tasks complete
              </p>
            </div>
            <StatusChip variant={statusVariant(process.status)}>
              {statusLabel(process.status)}
            </StatusChip>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-(--color-line-light)">
            <div
              className="h-full rounded-full bg-(--color-coral) transition-all"
              style={{
                width: `${tasks.length ? (completed / tasks.length) * 100 : 0}%`,
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            {tasks.map((task, index) => {
              const taskStatus = process.taskStatuses[task.id] ?? "pending";
              const dependency = tasks.find(
                item => item.id === task.dependsOnTaskId
              );
              return (
                <div
                  key={task.id}
                  className="rounded-[8px] border border-(--color-line-light) bg-(--color-offwhite) p-4"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onTaskChange(
                          task.id,
                          taskStatus === "completed" ? "pending" : "completed"
                        )
                      }
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${taskStatus === "completed" ? "border-(--color-sage) bg-(--color-sage)" : taskStatus === "in_progress" ? "border-(--color-coral)" : "border-(--color-line-light)"}`}
                      aria-label={`${taskStatus === "completed" ? "Reopen" : "Complete"} ${task.name}`}
                    >
                      {taskStatus === "completed" && (
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 10 10"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 5l2 2 4-4"
                            stroke="var(--color-navy)"
                            strokeWidth="1.5"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={`text-[14px] font-500 ${taskStatus === "completed" ? "text-(--color-sage-dim) line-through" : "text-(--color-ink)"}`}
                        >
                          {index + 1}. {task.name}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            onTaskChange(
                              task.id,
                              taskStatus === "in_progress"
                                ? "pending"
                                : "in_progress"
                            )
                          }
                          className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-(--color-coral) hover:underline"
                        >
                          {taskStatus === "in_progress" ? "Pause" : "Start"}
                        </button>
                      </div>
                      <p className="mt-1 font-mono text-[10px] text-(--color-sage-dim)">
                        {roleLabel(task.roleId)} ·{" "}
                        {task.dueOffset === 0
                          ? "Due on lifecycle date"
                          : `${Math.abs(task.dueOffset)} days ${task.dueOffset < 0 ? "before" : "after"}`}
                      </p>
                      {dependency && (
                        <p className="mt-1 text-[11px] text-(--color-sage-dim)">
                          Depends on: {dependency.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end border-t border-(--color-line-light) pt-5">
            <Button type="button" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function Playbooks() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState(initialTemplates);
  const [tasks, setTasks] = useState(initialTasks);
  const [processes, setProcesses] = useState(initialProcesses);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(
    null
  );
  const [startingTemplateId, setStartingTemplateId] = useState<string | null>(
    null
  );
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(
    null
  );

  const editingTemplate =
    templates.find(template => template.id === editingTemplateId) ?? null;
  const startingTemplate =
    templates.find(template => template.id === startingTemplateId) ?? null;
  const selectedProcess =
    processes.find(process => process.id === selectedProcessId) ?? null;
  const selectedProcessTemplate =
    templates.find(template => template.id === selectedProcess?.templateId) ??
    null;
  const selectedProcessTasks = tasks.filter(
    task => task.lifecycleTemplateId === selectedProcess?.templateId
  );

  const metrics = useMemo(
    () => [
      {
        label: "Total playbooks",
        value: templates.length,
        note: `${templates.filter(template => template.status === "active").length} active`,
      },
      {
        label: "Onboarding",
        value: templates.filter(template => template.type === "onboarding")
          .length,
        note: "Reusable templates",
      },
      {
        label: "Offboarding",
        value: templates.filter(template => template.type === "offboarding")
          .length,
        note: "Reusable templates",
      },
      {
        label: "Live processes",
        value: processes.filter(process => process.status === "in_progress")
          .length,
        note: "Employee lifecycles",
      },
    ],
    [processes, templates]
  );

  const openCreate = () => {
    setEditingTemplateId(null);
    setEditorOpen(true);
  };

  const savePlaybook = (
    template: LifecycleTemplate,
    templateTasks: LifecycleTemplateTask[]
  ) => {
    setTemplates(current =>
      current.some(item => item.id === template.id)
        ? current.map(item => (item.id === template.id ? template : item))
        : [...current, template]
    );
    setTasks(current => [
      ...current.filter(task => task.lifecycleTemplateId !== template.id),
      ...templateTasks,
    ]);
    setEditorOpen(false);
    toast({
      title: editingTemplateId ? "Playbook updated" : "Playbook created",
      description: `${template.name} has ${templateTasks.length} tasks.`,
      variant: "success",
    });
  };

  const startProcess = (userId: string) => {
    if (!startingTemplate) return;
    const templateTasks = tasks.filter(
      task => task.lifecycleTemplateId === startingTemplate.id
    );
    const process: LifecycleProcess = {
      id: crypto.randomUUID(),
      userId,
      templateId: startingTemplate.id,
      status: "in_progress",
      startedOn: new Date().toISOString().slice(0, 10),
      taskStatuses: Object.fromEntries(
        templateTasks.map((task, index) => [
          task.id,
          index === 0 ? "in_progress" : "pending",
        ])
      ),
    };
    setProcesses(current => [process, ...current]);
    setStartingTemplateId(null);
    setSelectedProcessId(process.id);
    toast({
      title: "Lifecycle started",
      description: `${startingTemplate.name} was assigned to ${personLabel(userId)}.`,
      variant: "success",
    });
  };

  const changeTaskStatus = (taskId: string, taskStatus: TaskStatus) => {
    if (!selectedProcessId) return;
    setProcesses(current =>
      current.map(process => {
        if (process.id !== selectedProcessId) return process;
        const taskStatuses = { ...process.taskStatuses, [taskId]: taskStatus };
        const processTasks = tasks.filter(
          task => task.lifecycleTemplateId === process.templateId
        );
        const complete = processTasks.every(
          task => taskStatuses[task.id] === "completed"
        );
        return {
          ...process,
          taskStatuses,
          status: complete ? "completed" : "in_progress",
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-(--color-coral)">
            Lifecycle automation
          </p>
          <h1 className="mt-2 font-display text-[26px] font-700 tracking-tight text-(--color-ink)">
            Playbooks
          </h1>
          <p className="mt-1 max-w-2xl text-[14px] leading-6 text-(--color-sage-dim)">
            Build repeatable onboarding and offboarding workflows, then launch a
            tracked process for each employee.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <span aria-hidden="true">+</span> Create playbook
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(metric => (
          <div
            key={metric.label}
            className="rounded-[10px] border border-(--color-line-light) bg-(--color-offwhite-raised) p-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
              {metric.label}
            </p>
            <p className="mt-2 font-display text-[28px] font-700 text-(--color-ink)">
              {metric.value}
            </p>
            <p className="mt-1 text-[12px] text-(--color-sage-dim)">
              {metric.note}
            </p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-[17px] font-600 text-(--color-ink)">
              Lifecycle templates
            </h2>
            <p className="mt-1 text-[13px] text-(--color-sage-dim)">
              Each playbook stores its own ordered set of default tasks.
            </p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {templates.map(template => {
            const templateTasks = tasks.filter(
              task => task.lifecycleTemplateId === template.id
            );
            const liveCount = processes.filter(
              process =>
                process.templateId === template.id &&
                process.status === "in_progress"
            ).length;
            return (
              <article
                key={template.id}
                className="group flex flex-col rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised) p-5 transition-all hover:-translate-y-0.5 hover:border-(--color-coral) hover:shadow-[0_10px_24px_rgba(11,20,38,0.07)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-[8px] ${template.type === "onboarding" ? "bg-(--color-sage)/20 text-[#526650]" : template.type === "offboarding" ? "bg-(--color-coral)/12 text-(--color-coral)" : "bg-(--color-navy)/10 text-(--color-navy)"}`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {template.type === "onboarding" ? (
                        <>
                          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M19 8v6M22 11h-6" />
                        </>
                      ) : template.type === "offboarding" ? (
                        <>
                          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 11h-6" />
                        </>
                      ) : (
                        <>
                          <path d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M2 12h20M10 12v2h4v-2" />
                        </>
                      )}
                    </svg>
                  </div>
                  <StatusChip variant={statusVariant(template.status)}>
                    {template.status}
                  </StatusChip>
                </div>
                <div className="mt-4 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                    {statusLabel(template.type)}
                  </p>
                  <h3 className="mt-1 font-display text-[16px] font-600 text-(--color-ink)">
                    {template.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-4 border-y border-(--color-line-light) py-3 font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                    <span>{templateTasks.length} tasks</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {liveCount} active{" "}
                      {liveCount === 1 ? "process" : "processes"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {templateTasks.slice(0, 3).map(task => (
                      <span
                        key={task.id}
                        className="rounded-full bg-(--color-navy)/5 px-2 py-1 text-[10px] text-(--color-sage-dim)"
                      >
                        {roleLabel(task.roleId)}
                      </span>
                    ))}
                    {templateTasks.length > 3 && (
                      <span className="rounded-full bg-(--color-navy)/5 px-2 py-1 text-[10px] text-(--color-sage-dim)">
                        +{templateTasks.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplateId(template.id);
                      setEditorOpen(true);
                    }}
                    className="flex-1 rounded-[6px] border border-(--color-line-light) px-3 py-2.5 font-display text-[13px] font-600 text-(--color-sage-dim) transition-colors hover:border-(--color-coral) hover:text-(--color-coral)"
                  >
                    Edit tasks
                  </button>
                  <button
                    type="button"
                    disabled={
                      template.status !== "active" || templateTasks.length === 0
                    }
                    onClick={() => setStartingTemplateId(template.id)}
                    className="flex-1 rounded-[6px] bg-(--color-navy) px-3 py-2.5 font-display text-[13px] font-600 text-(--color-offwhite) transition-colors hover:bg-(--color-navy-raised) disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    Start process
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[12px] border border-(--color-line-light) bg-(--color-offwhite-raised)">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <h2 className="font-display text-[16px] font-600 text-(--color-ink)">
              Lifecycle processes
            </h2>
            <p className="mt-1 text-[12px] text-(--color-sage-dim)">
              Employee-specific instances created from playbooks.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
            {processes.length} total
          </span>
        </div>
        <div className="overflow-x-auto border-t border-(--color-line-light)">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-(--color-navy)/[0.025] font-mono text-[10px] uppercase tracking-widest text-(--color-sage-dim)">
                <th className="px-5 py-3 font-500">Employee</th>
                <th className="px-5 py-3 font-500">Playbook</th>
                <th className="px-5 py-3 font-500">Progress</th>
                <th className="px-5 py-3 font-500">Status</th>
                <th className="px-5 py-3 font-500">Started</th>
                <th className="px-5 py-3 font-500">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {processes.map(process => {
                const template = templates.find(
                  item => item.id === process.templateId
                );
                const processTasks = tasks.filter(
                  task => task.lifecycleTemplateId === process.templateId
                );
                const done = processTasks.filter(
                  task => process.taskStatuses[task.id] === "completed"
                ).length;
                return (
                  <tr
                    key={process.id}
                    className="border-t border-(--color-line-light) text-[13px] transition-colors hover:bg-(--color-offwhite)"
                  >
                    <td className="px-5 py-4 font-500 text-(--color-ink)">
                      {personLabel(process.userId)}
                    </td>
                    <td className="px-5 py-4 text-(--color-sage-dim)">
                      {template?.name ?? process.templateId}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-(--color-line-light)">
                          <div
                            className="h-full rounded-full bg-(--color-coral)"
                            style={{
                              width: `${processTasks.length ? (done / processTasks.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-(--color-sage-dim)">
                          {done}/{processTasks.length}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusChip variant={statusVariant(process.status)}>
                        {statusLabel(process.status)}
                      </StatusChip>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-(--color-sage-dim)">
                      {process.startedOn}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedProcessId(process.id)}
                        className="font-display text-[12px] font-600 text-(--color-coral) hover:underline"
                      >
                        Open process
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <PlaybookEditor
        open={editorOpen}
        template={editingTemplate}
        tasks={tasks.filter(
          task => task.lifecycleTemplateId === editingTemplateId
        )}
        onClose={() => setEditorOpen(false)}
        onSave={savePlaybook}
      />
      <StartProcessModal
        template={startingTemplate}
        taskCount={
          tasks.filter(task => task.lifecycleTemplateId === startingTemplateId)
            .length
        }
        onClose={() => setStartingTemplateId(null)}
        onStart={startProcess}
      />
      <ProcessModal
        process={selectedProcess}
        template={selectedProcessTemplate}
        tasks={selectedProcessTasks}
        onClose={() => setSelectedProcessId(null)}
        onTaskChange={changeTaskStatus}
      />
    </div>
  );
}
