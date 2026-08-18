"use client";

import { FormEvent, useMemo, useState } from "react";
import { TASK_STATUSES, type Manuscript, type ProjectTask, type TaskStatus } from "@/lib/types";

type Props = {
  manuscripts: Manuscript[];
  selectedId: string;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Manuscript>) => void;
};

const nextStatus = (status: TaskStatus) => TASK_STATUSES[Math.min(TASK_STATUSES.indexOf(status) + 1, TASK_STATUSES.length - 1)];

export default function ProjectBoard({ manuscripts, selectedId, onSelect, onUpdate }: Props) {
  const selected = manuscripts.find((item) => item.id === selectedId) ?? manuscripts[0];
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskOwner, setTaskOwner] = useState("Lead author");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<ProjectTask["priority"]>("Medium");
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | undefined>();
  const [collaborator, setCollaborator] = useState("");

  const doneIds = useMemo(() => new Set(selected?.tasks.filter((task) => task.status === "Done").map((task) => task.id)), [selected]);
  if (!selected) return null;

  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!taskTitle.trim()) return;
    const task: ProjectTask = {
      id: crypto.randomUUID(),
      title: taskTitle.trim(),
      status: "Backlog",
      assignee: taskOwner.trim() || "Unassigned",
      dueDate: taskDue,
      milestone: "",
      dependsOn: [],
      priority: taskPriority,
    };
    onUpdate(selected.id, { tasks: [...selected.tasks, task] });
    setTaskTitle("");
    setTaskDue("");
    setShowTaskForm(false);
  }

  function updateTask(taskId: string, patch: Partial<ProjectTask>) {
    onUpdate(selected.id, { tasks: selected.tasks.map((task) => task.id === taskId ? { ...task, ...patch } : task) });
  }

  function addComment(event: FormEvent) {
    event.preventDefault();
    if (!comment.trim()) return;
    onUpdate(selected.id, {
      comments: [...selected.comments, {
        id: crypto.randomUUID(),
        author: "You",
        body: comment.trim(),
        createdAt: new Date().toISOString(),
        parentId: replyTo,
      }],
    });
    setComment("");
    setReplyTo(undefined);
  }

  function addCollaborator(event: FormEvent) {
    event.preventDefault();
    if (!collaborator.trim()) return;
    onUpdate(selected.id, {
      collaborators: [...selected.collaborators, {
        id: crypto.randomUUID(),
        name: collaborator.trim(),
        role: "Co-author",
        creditRole: "Writing – review & editing",
      }],
    });
    setCollaborator("");
  }

  const topLevelComments = selected.comments.filter((item) => !item.parentId);

  return (
    <div className="content project-page">
      <div className="page-heading">
        <div><p className="eyebrow">PUBLICATION AS A PROJECT</p><h1>Project execution</h1><p>Delegate work, expose dependencies and keep milestones visible to technical and non-technical collaborators.</p></div>
        <button className="primary-button" onClick={() => setShowTaskForm((value) => !value)}>+ Add task</button>
      </div>

      <div className="project-switcher">
        <label>Active project<select value={selected.id} onChange={(event) => onSelect(event.target.value)}>{manuscripts.map((item) => <option value={item.id} key={item.id}>{item.shortTitle}</option>)}</select></label>
        <div><strong>{selected.tasks.filter((task) => task.status === "Done").length}/{selected.tasks.length}</strong><span>tasks complete</span></div>
        <div><strong>{selected.collaborators.length + 1}</strong><span>people</span></div>
        <div><strong>{selected.milestones.filter((item) => item.complete).length}/{selected.milestones.length}</strong><span>milestones</span></div>
      </div>

      {showTaskForm && <form className="quick-task-form panel" onSubmit={addTask}>
        <label>Task<input autoFocus value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="What needs to be completed?" required /></label>
        <label>Assigned to<input value={taskOwner} onChange={(event) => setTaskOwner(event.target.value)} /></label>
        <label>Due<input type="date" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} /></label>
        <label>Priority<select value={taskPriority} onChange={(event) => setTaskPriority(event.target.value as ProjectTask["priority"])}><option>Low</option><option>Medium</option><option>High</option></select></label>
        <button className="primary-button" type="submit">Create task</button>
      </form>}

      <div className="task-board" aria-label="Task Kanban board">
        {TASK_STATUSES.map((status) => <section className="task-column" key={status}>
          <header><strong>{status}</strong><span>{selected.tasks.filter((task) => task.status === status).length}</span></header>
          <div>{selected.tasks.filter((task) => task.status === status).map((task) => {
            const blocked = task.dependsOn.some((dependency) => !doneIds.has(dependency));
            return <article className="task-card" key={task.id}>
              <div className="task-flags"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority}</span>{blocked && <span className="blocked">Blocked</span>}</div>
              <strong>{task.title}</strong>
              <label>Owner<input value={task.assignee} onChange={(event) => updateTask(task.id, { assignee: event.target.value })} /></label>
              <div className="task-meta"><span>{task.dueDate || "No deadline"}</span><span>{task.milestone || "No milestone"}</span></div>
              {task.status !== "Done" && <button disabled={blocked} onClick={() => updateTask(task.id, { status: nextStatus(task.status) })}>Move to {nextStatus(task.status)} →</button>}
            </article>;
          })}</div>
        </section>)}
      </div>

      <div className="project-lower-grid">
        <section className="panel project-side-panel">
          <div className="panel-heading"><div><h2>Milestones</h2><p>Submission-critical checkpoints</p></div></div>
          <div className="milestone-list">{selected.milestones.map((milestone) => <label key={milestone.id}>
            <input type="checkbox" checked={milestone.complete} onChange={(event) => onUpdate(selected.id, { milestones: selected.milestones.map((item) => item.id === milestone.id ? { ...item, complete: event.target.checked } : item) })} />
            <span><strong>{milestone.title}</strong><small>{milestone.date || "Date not set"}</small></span>
          </label>)}</div>
        </section>

        <section className="panel project-side-panel">
          <div className="panel-heading"><div><h2>Contributors</h2><p>Project and CRediT responsibilities</p></div></div>
          <div className="collaborator-list"><article><span>SP</span><div><strong>Lead author</strong><small>Project administration</small></div></article>{selected.collaborators.map((person) => <article key={person.id}><span>{person.name.slice(0, 2).toUpperCase()}</span><div><strong>{person.name}</strong><small>{person.creditRole}</small></div></article>)}</div>
          <form className="inline-add" onSubmit={addCollaborator}><input value={collaborator} onChange={(event) => setCollaborator(event.target.value)} placeholder="Add collaborator" /><button>Add</button></form>
        </section>

        <section className="panel project-side-panel comments-panel">
          <div className="panel-heading"><div><h2>Project discussion</h2><p>Decisions and threaded replies</p></div></div>
          <div className="comment-list">{topLevelComments.map((item) => <article key={item.id}>
            <div><strong>{item.author}</strong><small>{new Date(item.createdAt).toLocaleDateString("en-GB")}</small></div><p>{item.body}</p><button onClick={() => setReplyTo(item.id)}>Reply</button>
            {selected.comments.filter((reply) => reply.parentId === item.id).map((reply) => <article className="comment-reply" key={reply.id}><div><strong>{reply.author}</strong><small>{new Date(reply.createdAt).toLocaleDateString("en-GB")}</small></div><p>{reply.body}</p></article>)}
          </article>)}{!topLevelComments.length && <p className="muted-copy">No discussion yet. Record a decision or ask a project question.</p>}</div>
          <form className="comment-form" onSubmit={addComment}>{replyTo && <div>Replying in thread <button type="button" onClick={() => setReplyTo(undefined)}>Cancel</button></div>}<textarea rows={3} value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Add a project comment" /><button className="primary-button">Post comment</button></form>
        </section>
      </div>
    </div>
  );
}
