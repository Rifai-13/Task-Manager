
import { useState } from "react";
import { Calendar, Edit, Trash2, MoreVertical, Check, Clock } from "lucide-react";
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
  const [showActions, setShowActions] = useState(false);

  const getDeadlineColor = (deadline: string | null) => {
    if (!deadline) return "text-gray-400";
    
    const taskDate = new Date(deadline);
    const now = new Date();
    const timeDiff = taskDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) return "text-red-500 bg-red-50";
    if (hoursDiff < 24) return "text-orange-500 bg-orange-50";
    return "text-green-500 bg-green-50";
  };

  const deadlineColor = getDeadlineColor(task.deadline);

  return (
    <div
      className={`group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 ${
        task.completed ? "opacity-70 bg-gray-50" : "bg-white"
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Checkbox dan Konten */}
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          <button
            onClick={() => onToggleComplete(task)}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 ${
              task.completed
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-transparent"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            {task.completed && (
              <Check size={14} className="text-white" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium leading-relaxed ${
                task.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {task.title}
            </h3>
            
            <div className="flex items-center flex-wrap gap-3 mt-2">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                <span>
                  {new Date(task.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              
              {task.deadline && (
                <>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <div className="flex items-center text-xs">
                    <Clock size={12} className="mr-1" />
                    <span className={deadlineColor.split(' ')[0]}>
                      {new Date(task.deadline).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <span className={`text-xs px-2 py-1 rounded-full ${deadlineColor}`}>
                    {formatRemainingTime(task.deadline)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          <div className="hidden sm:flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200"
              title="Edit task"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
              title="Hapus task"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Mobile Actions Dropdown */}
          <div className="sm:hidden relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors duration-200"
            >
              <MoreVertical size={18} />
            </button>

            {showActions && (
              <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
                >
                  <Edit size={16} className="mr-2 text-blue-600" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(task.id);
                    setShowActions(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {task.completed && (
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-green-500 bg-green-50 px-3 py-1 rounded-full">
            <Check size={12} className="mr-1" />
            Selesai
          </div>
        </div>
      )}
    </div>
  );
}