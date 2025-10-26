
import { LoaderCircle, CheckCircle, ListTodo } from "lucide-react";
import type { Database } from "../lib/database.types";
import TaskItem from "./TaskItem";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskList({ tasks, loading, onToggleComplete, onEdit, onDelete }: TaskListProps) {

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-4">
        <LoaderCircle className="animate-spin text-blue-500 w-8 h-8" />
        <p className="text-gray-500">Memuat tugas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ListTodo className="text-blue-500 w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Belum ada tugas
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          Mulai dengan menambahkan tugas pertama Anda untuk meningkatkan produktivitas!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-[200px]">
      {/* Section Task Belum Selesai */}
      {incompleteTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <h3 className="font-bold text-gray-800 text-lg">
              Task Aktif ({incompleteTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {incompleteTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section Task Selesai */}
      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <h3 className="font-bold text-gray-800 text-lg">
              Task Selesai ({completedTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty States */}
      {incompleteTasks.length === 0 && completedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500 w-10 h-10" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Semua tugas selesai!
          </h3>
          <p className="text-gray-500">
            Selamat! Anda telah menyelesaikan semua tugas.
          </p>
        </div>
      )}
    </div>
  );
}