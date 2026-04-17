"use client";

import { Modal } from "@/components/ui/Modal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inviteEmail: string;
  onEmailChange: (email: string) => void;
  onInvite: () => void;
  inviting: boolean;
  inviteSuccess: boolean;
  inviteError: string | null;
}

export function InviteTeacherModal({ isOpen, onClose, inviteEmail, onEmailChange, onInvite, inviting, inviteSuccess, inviteError }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={inviteSuccess ? "Invitation envoyée !" : "Inviter un professeur"}
      size="sm"
      footer={
        inviteSuccess ? (
          <button
            onClick={onClose}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            Fermer
          </button>
        ) : (
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onInvite}
              disabled={inviting}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              {inviting ? "Envoi..." : "Envoyer l'invitation"}
            </button>
          </div>
        )
      }
    >
      {inviteSuccess ? (
        <p className="text-sm text-muted">
          Une invitation a été envoyée à <span className="text-foreground font-medium">{inviteEmail}</span>.
          Le professeur apparaîtra dans la liste avec le statut <span className="text-yellow-400 font-medium">Invité</span> jusqu&apos;à acceptation.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            Le professeur recevra une invitation par email pour rejoindre votre école.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 dark:text-gray-600">
              Adresse email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              placeholder="prof@exemple.fr"
              value={inviteEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onInvite()}
              autoFocus
              className="bg-background dark:bg-gray-100 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {inviteError && (
            <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{inviteError}</p>
          )}
        </div>
      )}
    </Modal>
  );
}
