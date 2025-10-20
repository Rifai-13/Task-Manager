// src/components/TaskItem.tsx
import { Calendar, Edit, Trash2 } from "lucide-react";
import { formatRemainingTime } from "../utils/dateUtils";
import type { Database } from "../lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskItemProps {
  task: Task;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  return (
    <div
      className={`border rounded-lg p-4 flex items-center gap-4 transition-opacity ${
        task.completed ? "opacity-50 bg-gray-50" : "bg-white"
      }`}
    >
      <button
        onClick={() => onToggleComplete(task)}
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
        onClick={() => onEdit(task)}
        className="text-gray-400 hover:text-blue-500 p-1"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}