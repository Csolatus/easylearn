"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSchoolStore } from "@/store/schoolStore";
import { SchoolInfoForm } from "./SchoolInfoForm";
import { SchoolLogoUpload } from "./SchoolLogoUpload";
import { AccentColorPicker } from "./AccentColorPicker";

export default function ParametresPage() {
  const activeSchool = useSchoolStore((s) => s.activeSchool);
  const setActiveSchool = useSchoolStore((s) => s.setActiveSchool);
  const [schoolName, setSchoolName] = useState(activeSchool?.name ?? "");
  const [email, setEmail] = useState(activeSchool?.email ?? "");
  const [website, setWebsite] = useState(activeSchool?.website ?? "");
  const [address, setAddress] = useState(activeSchool?.address ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState("#ea580c");

  async function handleSave() {
    if (!activeSchool?.id || !schoolName.trim()) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await api.patch<{ id: string; name: string; email: string | null; website: string | null; address: string | null; is_active: boolean; created_at: string }>(
        `/schools/${activeSchool.id}`,
        { name: schoolName.trim() || undefined, email: email.trim() || null, website: website.trim() || null, address: address.trim() || null }
      );
      setActiveSchool({ ...activeSchool, name: updated.name, email: updated.email, website: updated.website, address: updated.address });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white dark:text-gray-900">Paramètres</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Configurez les informations de votre école
        </p>
      </div>

      <SchoolInfoForm
        schoolName={schoolName}
        email={email}
        website={website}
        address={address}
        onSchoolNameChange={setSchoolName}
        onEmailChange={setEmail}
        onWebsiteChange={setWebsite}
        onAddressChange={setAddress}
      />

      <SchoolLogoUpload
        logo={logo}
        onLogoChange={setLogo}
        onLogoRemove={() => setLogo(null)}
      />

      <AccentColorPicker
        accentColor={accentColor}
        onColorChange={setAccentColor}
        onSave={handleSave}
        saving={saving}
        saved={saved}
        saveError={saveError}
        disabled={!activeSchool}
      />
    </div>
  );
}
