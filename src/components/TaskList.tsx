// src/components/TaskList.tsx
import { LoaderCircle } from "lucide-react";
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
  // Memisahkan task yang belum selesai dan sudah selesai
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-10">
        <LoaderCircle className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-[100px]">
      {/* Section Task Belum Selesai */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-700 text-lg mb-2">
          Task Aktif ({incompleteTasks.length})
        </h3>
        {incompleteTasks.length > 0 ? (
          incompleteTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            Tidak ada task aktif
          </p>
        )}
      </div>

      {/* Pemisah antara task aktif dan selesai */}
      {completedTasks.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-lg mb-2">
              Task Selesai ({completedTasks.length})
            </h3>
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
    </div>
  );
}