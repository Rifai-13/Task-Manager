
import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { X, Calendar, Save, Clock } from "lucide-react";
import type { Database } from "../lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const toDateTimeLocal = (isoDate: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - timezoneOffset);
  return localDate.toISOString().slice(0, 16);
};

interface EditTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { title: string; deadline: string | null }) => void;
  task: Task | null;
}

export default function EditTask({
  isOpen,
  onClose,
  onSave,
  task,
}: EditTaskProps) {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || "");
      setEditedDeadline(toDateTimeLocal(task.deadline));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onSave({ title: editedTitle.trim(), deadline: editedDeadline || null });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-white/20 transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar size={24} className="mr-3" />
                      <DialogTitle
                        as="h3"
                        className="text-xl font-bold leading-6"
                      >
                        Edit Tugas
                      </DialogTitle>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white hover:text-blue-100 transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Judul Tugas
                    </label>
                    <textarea
                      id="title"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                      placeholder="Masukkan judul tugas..."
                      rows={3}
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        Tanggal & Waktu Deadline
                      </div>
                    </label>
                    <input
                      id="deadline"
                      type="datetime-local"
                      value={editedDeadline}
                      onChange={(e) => setEditedDeadline(e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!editedTitle.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                    >
                      <Save size={20} />
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}