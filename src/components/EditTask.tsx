// src/components/EditTaskModal.tsx

import { useState, useEffect, Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import type { Database } from "../lib/database.types";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

const toDateTimeLocal = (isoDate: string | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  // Adjust for timezone offset
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

  // Sinkronkan state input dengan task yang dipilih saat modal dibuka
  useEffect(() => {
    if (task) {
      setEditedTitle(task.title || "");
      setEditedDeadline(toDateTimeLocal(task.deadline));
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title: editedTitle, deadline: editedDeadline || null });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Tugas
                </DialogTitle>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Judul Tugas
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="deadline"
                      className="block text-sm font-medium text-gray-700 mt-4"
                    >
                      Tenggal Waktu
                    </label>
                    <input
                      id="deadline"
                      type="datetime-local"
                      value={editedDeadline}
                      onChange={(e) => setEditedDeadline(e.target.value)}
                      className="mt-1 w-full border rounded-md p-2 text-sm text-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
                    >
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
