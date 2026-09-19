CREATE TABLE IF NOT EXISTS early_access_signups (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  locale TEXT NOT NULL CHECK (locale IN ('ko', 'en')),
  consent_version TEXT NOT NULL,
  consent_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
