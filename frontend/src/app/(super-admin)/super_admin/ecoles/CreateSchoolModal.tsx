"use client";

import { Modal } from "@/components/ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  onNameChange: (name: string) => void;
  onCreate: () => void;
  creating: boolean;
  createError: string | null;
}

export function CreateSchoolModal({ isOpen, onClose, newName, onNameChange, onCreate, creating, createError }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle école"
      size="sm"
      footer={
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onCreate}
            disabled={creating}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {creating ? "Création..." : "Créer l'école"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
            Nom de l&apos;école <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="ex: École Nationale du Numérique"
            value={newName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCreate()}
            autoFocus
            className="bg-background dark:bg-gray-100 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        {createError && (
          <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{createError}</p>
        )}
      </div>
    </Modal>
  );
}
