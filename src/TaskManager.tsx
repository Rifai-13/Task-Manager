// src/TaskManager.tsx
import { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, Plus, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";

import { supabase } from "./lib/supabase";
import type { Database } from "./lib/database.types";
import EditTask from "./components/EditTask";
import TaskList from "./components/TaskList";
import AuthModal from "./components/AuthModal";
import UserProfile from "./components/UserProfile";
import { useAuth } from "./contexts/AuthContext";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export default function TaskManager() {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      setTasks(data || []);
    }
    setLoading(false);
  };

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const remaining = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, completed, remaining, completionRate };
  }, [tasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (!newTaskTitle.trim()) {
      alert("Judul task tidak boleh kosong");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: newTaskTitle.trim(),
          deadline: newDeadline || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Error adding task:", error);
        alert(`Error: ${error.message}`);
      } else {
        setTasks([data, ...tasks]);
        setNewTaskTitle("");
        setNewDeadline("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!user) return;

    const { error } = await supabase
      .from("tasks")
      .update({ completed: !task.completed })
      .eq("id", task.id)
      .eq("user_id", user.id);

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
    if (!user) return;
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting task:", error);
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleUpdateTask = async (updates: {
    title: string;
    deadline: string | null;
  }) => {
    if (!editingTask || !updates.title.trim() || !user) return;

    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: updates.title,
        deadline: updates.deadline,
      })
      .eq("id", editingTask.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating task:", error);
    } else if (data) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? data : t)));
      setEditingTask(null);
    }
  };

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (authLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 min-h-screen flex items-start justify-center p-4 font-sans">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/60 mt-8 mb-8">
        {/* Header dengan gradient yang sama dengan AuthModal */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-3xl relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="bg-white/20 p-2 rounded-2xl mr-3">
                    <Calendar size={28} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
                <p className="text-blue-100 text-lg">Tingkatkan produktivitas Anda dengan mudah</p>
              </div>

              {user ? (
                <UserProfile />
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => openAuthModal("register")}
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                  >
                    Mulai Sekarang
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-6 text-blue-100">
              <Calendar size={20} />
              <span className="text-lg font-medium">{today}</span>
            </div>
          </div>
        </header>

        <main className="p-8">
          {user ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Task</p>
                      <p className="text-2xl font-bold">{taskStats.total}</p>
                    </div>
                    <TrendingUp size={24} className="text-blue-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Selesai</p>
                      <p className="text-2xl font-bold">{taskStats.completed}</p>
                    </div>
                    <CheckCircle size={24} className="text-green-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Tersisa</p>
                      <p className="text-2xl font-bold">{taskStats.remaining}</p>
                    </div>
                    <AlertCircle size={24} className="text-orange-200" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Progress</p>
                      <p className="text-2xl font-bold">{taskStats.completionRate}%</p>
                    </div>
                    <div className="w-12 h-2 bg-purple-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${taskStats.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Task Form */}
              <form
                onSubmit={handleAddTask}
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg border border-blue-100 mb-8"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Plus size={20} className="mr-2 text-blue-600" />
                  Tambah Task Baru
                </h3>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Apa yang ingin Anda kerjakan?"
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>
                  <div className="relative flex-1">
                    <Clock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="datetime-local"
                      value={newDeadline}
                      onChange={(e) => setNewDeadline(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-12 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 py-3 flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Tambah Task</span>
                  </button>
                </div>
              </form>

              {/* Task List Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Daftar Task Anda</h3>
                  <p className="text-gray-600">Kelola dan pantau progress tugas Anda</p>
                </div>
                
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  onToggleComplete={handleToggleComplete}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              </div>
            </>
          ) : (
            /* Welcome Section for Non-Authenticated Users */
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 max-w-2xl mx-auto border border-white shadow-2xl">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/60">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar size={40} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    Selamat Datang di <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TaskFlow</span>
                  </h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Bergabunglah dengan komunitas produktif dan kelola tugas Anda dengan cara yang modern dan efisien
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => openAuthModal("register")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      🚀 Daftar Sekarang - Gratis!
                    </button>
                    <button
                      onClick={() => openAuthModal("login")}
                      className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    >
                      🔑 Sudah Punya Akun?
                    </button>
                  </div>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Gratis Selamanya</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>Sync Multi-Device</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span>100% Privasi Terjaga</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-100 bg-white/50 rounded-b-3xl">
          <div className="flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} TaskFlow</span>
            <span>•</span>
            <span>Dibuat oleh Muhammad Rifai</span>
          </div>
        </footer>
      </div>

      <EditTask
        isOpen={editingTask !== null}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        onSave={handleUpdateTask}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}