import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  LoaderCircle,
  Edit,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import type { Database } from "../lib/database.types";
import EditTask from "./EditTask";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const formatRemainingTime = (deadline: string | null): string => {
  if (!deadline) return "";
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffInMs = deadlineDate.getTime() - now.getTime();
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) return "Tenggat waktu terlewat";
  if (diffInDays === 0) return "Hari ini";
  if (diffInDays === 1) return "1 hari lagi";
  return `${diffInDays} hari lagi`;
};

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data);
      }
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const remaining = total - completed;
    return { total, completed, remaining };
  }, [tasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: newTaskTitle,
        deadline: newDeadline || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
    } else {
      setTasks([data, ...tasks]);
      setNewTaskTitle("");
      setNewDeadline("");
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id);

    if (error) {
      console.error("Error updating task:", error);
    } else {
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleUpdateTask = async (updates: { title: string; deadline: string | null }) => {
    if (!editingTask || !updates.title.trim()) return;

    const { data, error } = await supabase
      .from('tasks')
      .update({ 
        title: updates.title, 
        deadline: updates.deadline 
      })
      .eq('id', editingTask.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
    } else if (data) {
      setTasks(tasks.map(t => (t.id === editingTask.id ? data : t)));
      setEditingTask(null);
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg">
        <header className="bg-blue-600 text-white p-6 rounded-t-xl">
          <h1 className="text-3xl font-bold">Task Manager</h1>
          <p className="text-blue-200">Kelola tugas Anda dengan mudah</p>
          <div className="flex items-center gap-2 mt-4 text-sm">
            <Calendar size={16} />
            <span>{today}</span>
          </div>
        </header>

        <main className="p-6">
          <form
            onSubmit={handleAddTask}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Tambahkan tugas baru..."
              className="flex-grow border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="relative flex items-center">
              <Clock size={16} className="absolute left-3 text-gray-400" />
              <input
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full border rounded-md p-2 pl-9 text-sm text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              <span>Tambah</span>
            </button>
          </form>

          <div className="text-sm text-gray-500 mb-4 border-b pb-4">
            Total: <strong>{taskStats.total}</strong> &nbsp; Selesai:{" "}
            <strong>{taskStats.completed}</strong> &nbsp; Tersisa:{" "}
            <strong>{taskStats.remaining}</strong>
          </div>

          <div className="space-y-3 min-h-[100px]">
            {loading ? (
              <div className="flex justify-center items-center pt-10">
                <LoaderCircle className="animate-spin text-blue-500" />
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 flex items-center gap-4 transition-opacity ${
                    task.completed ? "opacity-50" : ""
                  }`}
                >
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className={`w-6 h-6 border-2 rounded-full flex-shrink-0 ${
                      task.completed
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300"
                    }`}
                  ></button>
                  <div className="flex-grow">
                    <p
                      className={`font-semibold ${
                        task.completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="text-xs text-gray-500 flex items-center gap-3 flex-wrap mt-1">
                      <span>
                        Dibuat:{" "}
                        {new Date(task.created_at).toLocaleString("id-ID")}
                      </span>
                      {task.deadline && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />{" "}
                            {new Date(task.deadline).toLocaleString("id-ID")}
                          </span>
                          <span>•</span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {formatRemainingTime(task.deadline)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="text-gray-400 hover:text-blue-500 p-1"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>

        <footer className="text-center text-xs text-gray-400 py-4">
          &copy; {new Date().getFullYear()} Muhammad Rifai
        </footer>
      </div>
      <EditTask
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
