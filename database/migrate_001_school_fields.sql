-- Migration 001 — Ajout des champs email, website, address sur la table schools
-- À exécuter si la DB a été initialisée avant cette migration.
-- Safe à re-exécuter (IF NOT EXISTS).

ALTER TABLE schools ADD COLUMN IF NOT EXISTS email   VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE schools ADD COLUMN IF NOT EXISTS address TEXT;
