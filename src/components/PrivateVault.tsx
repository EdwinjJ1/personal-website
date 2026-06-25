'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';

type EntryKind = 'plan' | 'journal' | 'note';
type EntryStatus = 'active' | 'done' | 'archived';

type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  entryId: string | null;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

type VaultEntry = {
  id: string;
  kind: EntryKind;
  title: string;
  body: string;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
};

type VaultPayload = {
  version: 1;
  entries: VaultEntry[];
  schedule: ScheduleItem[];
};

type StoredVault = {
  version: 1;
  kdf: 'PBKDF2-SHA256';
  iterations: number;
  salt: string;
  iv: string;
  data: string;
};

const STORAGE_KEY = 'evan-private-work-vault:v1';
const ITERATIONS = 250000;
const EMPTY_PAYLOAD: VaultPayload = { version: 1, entries: [], schedule: [] };
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const KIND_LABELS: Record<EntryKind, string> = {
  plan: 'Plan',
  journal: 'Journal',
  note: 'Note',
};

const STATUS_LABELS: Record<EntryStatus, string> = {
  active: 'Active',
  done: 'Done',
  archived: 'Archived',
};

function toBase64(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function fromBase64(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function deriveKey(password: string, salt: Uint8Array, iterations: number) {
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    toArrayBuffer(new TextEncoder().encode(password)),
    'PBKDF2',
    false,
    ['deriveKey'],
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: toArrayBuffer(salt),
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

async function encryptPayload(payload: VaultPayload, password: string): Promise<StoredVault> {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt, ITERATIONS);
  const encoded = new TextEncoder().encode(JSON.stringify(payload));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(encoded),
  );

  return {
    version: 1,
    kdf: 'PBKDF2-SHA256',
    iterations: ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(encrypted)),
  };
}

async function decryptPayload(stored: StoredVault, password: string): Promise<VaultPayload> {
  const salt = fromBase64(stored.salt);
  const iv = fromBase64(stored.iv);
  const key = await deriveKey(password, salt, stored.iterations);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    key,
    toArrayBuffer(fromBase64(stored.data)),
  );
  const parsed = JSON.parse(new TextDecoder().decode(decrypted)) as VaultPayload;

  if (parsed.version !== 1 || !Array.isArray(parsed.entries)) {
    throw new Error('Unsupported vault data.');
  }

  return parsed;
}

function readStoredVault(): StoredVault | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return JSON.parse(raw) as StoredVault;
}

function normalizePayload(payload: VaultPayload | (Omit<VaultPayload, 'schedule'> & { schedule?: ScheduleItem[] })): VaultPayload {
  return {
    version: 1,
    entries: Array.isArray(payload.entries) ? payload.entries : [],
    schedule: Array.isArray(payload.schedule) ? payload.schedule : [],
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('en-AU', { month: 'long', year: 'numeric' }).format(date);
}

function getCalendarDays(monthDate: Date) {
  const first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function formatScheduleTime(item: ScheduleItem) {
  if (item.startTime && item.endTime) return `${item.startTime} - ${item.endTime}`;
  if (item.startTime) return item.startTime;
  return 'All day';
}

function newEntry(kind: EntryKind): VaultEntry {
  const now = new Date().toISOString();
  return {
    id: window.crypto.randomUUID(),
    kind,
    title: '',
    body: '',
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
}

function newScheduleItem(input: {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
  entryId: string | null;
}): ScheduleItem {
  const now = new Date().toISOString();
  return {
    id: window.crypto.randomUUID(),
    title: input.title,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    note: input.note,
    entryId: input.entryId,
    done: false,
    createdAt: now,
    updatedAt: now,
  };
}

export default function PrivateVault() {
  const [ready, setReady] = useState(false);
  const [hasVault, setHasVault] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [payload, setPayload] = useState<VaultPayload | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | EntryKind>('all');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [changingKey, setChangingKey] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(getLocalDateString);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [scheduleDraft, setScheduleDraft] = useState({
    title: '',
    date: getLocalDateString(),
    startTime: '',
    endTime: '',
    note: '',
    entryId: '',
  });

  useEffect(() => {
    setHasVault(Boolean(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  const entries = payload?.entries ?? [];
  const schedule = payload?.schedule ?? [];
  const activeEntry = entries.find((entry) => entry.id === activeId) ?? entries[0] ?? null;
  const planEntries = entries.filter((entry) => entry.kind === 'plan');

  const visibleEntries = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return entries
      .filter((entry) => filter === 'all' || entry.kind === filter)
      .filter((entry) => {
        if (!needle) return true;
        return `${entry.title} ${entry.body}`.toLowerCase().includes(needle);
      })
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  }, [entries, filter, query]);

  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const schedulesByDate = useMemo(() => {
    return schedule.reduce<Record<string, ScheduleItem[]>>((grouped, item) => {
      grouped[item.date] = grouped[item.date] ? [...grouped[item.date], item] : [item];
      return grouped;
    }, {});
  }, [schedule]);
  const selectedDateSchedules = useMemo(() => {
    return [...(schedulesByDate[selectedDate] ?? [])].sort((a, b) => {
      const aTime = a.startTime || '99:99';
      const bTime = b.startTime || '99:99';
      return aTime.localeCompare(bTime) || a.title.localeCompare(b.title);
    });
  }, [schedulesByDate, selectedDate]);

  const persist = async (nextPayload: VaultPayload, currentPassword = password.trim()) => {
    const normalizedPayload = normalizePayload(nextPayload);
    const stored = await encryptPayload(normalizedPayload, currentPassword);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    setPayload(normalizedPayload);
    setHasVault(true);
    setSavedAt(new Date().toISOString());
  };

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const trimmedPassword = password.trim();
    if (trimmedPassword.length < 8) {
      setError('口令至少需要 8 个字符。');
      return;
    }

    if (!hasVault && trimmedPassword !== confirmPassword.trim()) {
      setError('两次输入的口令不一致。');
      return;
    }

    setBusy(true);
    try {
      if (!hasVault) {
        setPassword(trimmedPassword);
        await persist(EMPTY_PAYLOAD, trimmedPassword);
        setPayload(EMPTY_PAYLOAD);
        return;
      }

      const stored = readStoredVault();
      if (!stored) throw new Error('Vault not found.');
      const decrypted = await decryptPayload(stored, trimmedPassword);
      const normalized = normalizePayload(decrypted);
      setPassword(trimmedPassword);
      setPayload(normalized);
      setActiveId(normalized.entries[0]?.id ?? null);
    } catch {
      setError('口令不对，或者本地 vault 数据已损坏。');
    } finally {
      setBusy(false);
    }
  };

  const updateEntry = async (id: string, patch: Partial<VaultEntry>) => {
    if (!payload) return;
    const nextPayload = {
      ...payload,
      entries: payload.entries.map((entry) =>
        entry.id === id ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry,
      ),
    };
    await persist(nextPayload);
  };

  const addSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload) return;

    const title = scheduleDraft.title.trim();
    if (!title || !scheduleDraft.date) return;

    const item = newScheduleItem({
      title,
      date: scheduleDraft.date,
      startTime: scheduleDraft.startTime,
      endTime: scheduleDraft.endTime,
      note: scheduleDraft.note.trim(),
      entryId: scheduleDraft.entryId || null,
    });
    const nextPayload = { ...payload, schedule: [...payload.schedule, item] };
    await persist(nextPayload);
    setSelectedDate(item.date);
    setCalendarMonth(new Date(`${item.date}T00:00:00`));
    setScheduleDraft((draft) => ({
      ...draft,
      title: '',
      startTime: '',
      endTime: '',
      note: '',
    }));
  };

  const updateSchedule = async (id: string, patch: Partial<ScheduleItem>) => {
    if (!payload) return;
    const nextPayload = {
      ...payload,
      schedule: payload.schedule.map((item) =>
        item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
      ),
    };
    await persist(nextPayload);
  };

  const deleteSchedule = async (id: string) => {
    if (!payload) return;
    const nextPayload = {
      ...payload,
      schedule: payload.schedule.filter((item) => item.id !== id),
    };
    await persist(nextPayload);
  };

  const selectCalendarDate = (date: Date) => {
    const nextDate = getLocalDateString(date);
    setSelectedDate(nextDate);
    setScheduleDraft((draft) => ({ ...draft, date: nextDate }));
  };

  const shiftCalendarMonth = (delta: number) => {
    setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    const todayString = getLocalDateString(today);
    setSelectedDate(todayString);
    setScheduleDraft((draft) => ({ ...draft, date: todayString }));
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const addEntry = async (kind: EntryKind) => {
    if (!payload) return;
    const entry = newEntry(kind);
    const nextPayload = { ...payload, entries: [entry, ...payload.entries] };
    await persist(nextPayload);
    setActiveId(entry.id);
  };

  const deleteEntry = async (id: string) => {
    if (!payload) return;
    const nextEntries = payload.entries.filter((entry) => entry.id !== id);
    const nextPayload = { ...payload, entries: nextEntries };
    await persist(nextPayload);
    setActiveId(nextEntries[0]?.id ?? null);
  };

  const lockVault = () => {
    setPayload(null);
    setPassword('');
    setConfirmPassword('');
    setActiveId(null);
    setError('');
    setChangingKey(false);
    setNewPassword('');
    setConfirmNewPassword('');
    setKeyMessage('');
  };

  const handleChangeKey = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payload) return;

    const trimmedPassword = newPassword.trim();
    setKeyMessage('');

    if (trimmedPassword.length < 8) {
      setKeyMessage('新口令至少需要 8 个字符。');
      return;
    }

    if (trimmedPassword !== confirmNewPassword.trim()) {
      setKeyMessage('两次输入的新口令不一致。');
      return;
    }

    setBusy(true);
    try {
      await persist(payload, trimmedPassword);
      setPassword(trimmedPassword);
      setNewPassword('');
      setConfirmNewPassword('');
      setChangingKey(false);
      setKeyMessage('Key updated.');
    } catch {
      setKeyMessage('更新口令失败，请再试一次。');
    } finally {
      setBusy(false);
    }
  };

  const exportEncryptedBackup = () => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const blob = new Blob([raw], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `private-vault-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (activeEntry?.kind === 'plan') {
      setScheduleDraft((draft) => ({ ...draft, entryId: activeEntry.id }));
    }
  }, [activeEntry?.id, activeEntry?.kind]);

  if (!ready) {
    return <div className="private-shell" />;
  }

  if (!payload) {
    return (
      <main className="private-shell">
        <section className="private-lock-panel">
          <Link href="/" className="private-back-link" aria-label="Back home">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Home
          </Link>

          <div className="private-lock-plate" aria-hidden="true">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10" width="16" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              <path d="M12 14v2" />
            </svg>
          </div>

          <div className="private-lock-copy">
            <span>Private workspace</span>
            <h1>{hasVault ? '打开你的私吧' : '创建你的私吧'}</h1>
            <p>
              {hasVault
                ? '输入口令后，浏览器会在本机解密你的计划、日记和想法。'
                : '第一次进入会建立一个本地加密 vault。口令不会写进代码，也不会上传。'}
            </p>
          </div>

          <form onSubmit={handleUnlock} className="private-lock-form">
            <label>
              <span>Key phrase</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={hasVault ? 'current-password' : 'new-password'}
                placeholder="至少 8 个字符"
              />
            </label>

            {!hasVault && (
              <label>
                <span>Confirm key phrase</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="再输入一次"
                />
              </label>
            )}

            {error && <p className="private-lock-error">{error}</p>}

            <button type="submit" disabled={busy}>
              {busy ? 'Opening...' : hasVault ? 'Unlock' : 'Create vault'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="private-shell private-shell--open">
      <section className="private-workspace">
        <header className="private-workspace-header">
          <div>
            <span>Private workspace</span>
            <h1>计划、日常、想法</h1>
          </div>
          <div className="private-workspace-actions">
            <button type="button" onClick={exportEncryptedBackup}>
              Backup
            </button>
            <button type="button" onClick={() => setChangingKey((value) => !value)}>
              Change key
            </button>
            <button type="button" onClick={lockVault}>
              Lock
            </button>
          </div>
        </header>

        {changingKey && (
          <form className="private-key-form" onSubmit={handleChangeKey}>
            <label>
              <span>New key phrase</span>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="至少 8 个字符"
              />
            </label>
            <label>
              <span>Confirm new key</span>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="再输入一次"
              />
            </label>
            <button type="submit" disabled={busy}>
              {busy ? 'Updating...' : 'Update key'}
            </button>
          </form>
        )}

        {keyMessage && <p className="private-key-message">{keyMessage}</p>}

        <div className="private-workspace-toolbar">
          <div className="private-segmented" aria-label="Filter entries">
            {(['all', 'plan', 'journal', 'note'] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? 'is-active' : ''}
                onClick={() => setFilter(item)}
              >
                {item === 'all' ? 'All' : KIND_LABELS[item]}
              </button>
            ))}
          </div>
          <label className="private-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
        </div>

        <div className="private-create-row">
          {(['plan', 'journal', 'note'] as EntryKind[]).map((kind) => (
            <button key={kind} type="button" onClick={() => addEntry(kind)}>
              <span aria-hidden="true">+</span>
              {KIND_LABELS[kind]}
            </button>
          ))}
        </div>

        <div className="private-workspace-grid">
          <aside className="private-entry-list" aria-label="Private entries">
            {visibleEntries.length === 0 ? (
              <div className="private-empty-list">
                <p>No entries yet.</p>
              </div>
            ) : (
              visibleEntries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={entry.id === activeEntry?.id ? 'is-active' : ''}
                  onClick={() => setActiveId(entry.id)}
                >
                  <span>{KIND_LABELS[entry.kind]}</span>
                  <strong>{entry.title.trim() || 'Untitled'}</strong>
                  <small>{formatDate(entry.updatedAt)}</small>
                </button>
              ))
            )}
          </aside>

          <section className="private-editor" aria-label="Entry editor">
            <AnimatePresence mode="wait">
              {activeEntry ? (
                <motion.div
                  key={activeEntry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="private-editor-inner"
                >
                  <div className="private-editor-meta">
                    <select
                      value={activeEntry.kind}
                      onChange={(event) => updateEntry(activeEntry.id, { kind: event.target.value as EntryKind })}
                      aria-label="Entry type"
                    >
                      {(['plan', 'journal', 'note'] as EntryKind[]).map((kind) => (
                        <option key={kind} value={kind}>{KIND_LABELS[kind]}</option>
                      ))}
                    </select>
                    <select
                      value={activeEntry.status}
                      onChange={(event) => updateEntry(activeEntry.id, { status: event.target.value as EntryStatus })}
                      aria-label="Entry status"
                    >
                      {(['active', 'done', 'archived'] as EntryStatus[]).map((status) => (
                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => deleteEntry(activeEntry.id)}>
                      Delete
                    </button>
                  </div>

                  <input
                    className="private-title-input"
                    value={activeEntry.title}
                    onChange={(event) => updateEntry(activeEntry.id, { title: event.target.value })}
                    placeholder="Title"
                    maxLength={120}
                  />

                  <textarea
                    value={activeEntry.body}
                    onChange={(event) => updateEntry(activeEntry.id, { body: event.target.value })}
                    placeholder="写下今天的计划、复盘、灵感，或者任何不想公开的东西。"
                  />

                  <footer className="private-editor-footer">
                    <span>Created {formatDate(activeEntry.createdAt)}</span>
                    <span>{savedAt ? `Saved ${formatDate(savedAt)}` : 'Encrypted locally'}</span>
                  </footer>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="private-empty-editor"
                >
                  <h2>空房间</h2>
                  <p>先新建一条计划、日记或想法。</p>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        <section className="private-calendar" aria-label="Schedule calendar">
          <div className="private-calendar-header">
            <div>
              <span>Schedule</span>
              <h2>日程</h2>
            </div>
            <div className="private-calendar-controls">
              <button type="button" onClick={() => shiftCalendarMonth(-1)} aria-label="Previous month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <strong>{getMonthLabel(calendarMonth)}</strong>
              <button type="button" onClick={() => shiftCalendarMonth(1)} aria-label="Next month">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <button type="button" onClick={jumpToToday}>
                Today
              </button>
            </div>
          </div>

          <div className="private-calendar-layout">
            <div className="private-calendar-board">
              <div className="private-calendar-weekdays">
                {WEEKDAYS.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>
              <div className="private-calendar-grid">
                {calendarDays.map((date) => {
                  const dateString = getLocalDateString(date);
                  const dayItems = schedulesByDate[dateString] ?? [];
                  const isCurrentMonth = getMonthKey(date) === getMonthKey(calendarMonth);
                  const isSelected = dateString === selectedDate;
                  const isToday = dateString === getLocalDateString();

                  return (
                    <button
                      key={dateString}
                      type="button"
                      className={[
                        isCurrentMonth ? '' : 'is-muted',
                        isSelected ? 'is-selected' : '',
                        isToday ? 'is-today' : '',
                        dayItems.length > 0 ? 'has-items' : '',
                      ].join(' ')}
                      onClick={() => selectCalendarDate(date)}
                    >
                      <span>{date.getDate()}</span>
                      {dayItems.length > 0 && <small>{dayItems.length}</small>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="private-calendar-panel">
              <div className="private-calendar-panel-header">
                <span>Selected day</span>
                <strong>{new Intl.DateTimeFormat('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${selectedDate}T00:00:00`))}</strong>
              </div>

              <form className="private-schedule-form" onSubmit={addSchedule}>
                <label className="private-schedule-title-field">
                  <span>Title</span>
                  <input
                    value={scheduleDraft.title}
                    onChange={(event) => setScheduleDraft((draft) => ({ ...draft, title: event.target.value }))}
                    placeholder="Add a schedule item"
                    maxLength={120}
                  />
                </label>
                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={scheduleDraft.date}
                    onChange={(event) => {
                      const nextDate = event.target.value;
                      setScheduleDraft((draft) => ({ ...draft, date: nextDate }));
                      if (nextDate) {
                        setSelectedDate(nextDate);
                        setCalendarMonth(new Date(`${nextDate}T00:00:00`));
                      }
                    }}
                  />
                </label>
                <label>
                  <span>Start</span>
                  <input
                    type="time"
                    value={scheduleDraft.startTime}
                    onChange={(event) => setScheduleDraft((draft) => ({ ...draft, startTime: event.target.value }))}
                  />
                </label>
                <label>
                  <span>End</span>
                  <input
                    type="time"
                    value={scheduleDraft.endTime}
                    onChange={(event) => setScheduleDraft((draft) => ({ ...draft, endTime: event.target.value }))}
                  />
                </label>
                <label className="private-schedule-title-field">
                  <span>Plan link</span>
                  <select
                    value={scheduleDraft.entryId}
                    onChange={(event) => setScheduleDraft((draft) => ({ ...draft, entryId: event.target.value }))}
                  >
                    <option value="">No linked plan</option>
                    {planEntries.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.title.trim() || 'Untitled plan'}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="private-schedule-note-field">
                  <span>Note</span>
                  <textarea
                    value={scheduleDraft.note}
                    onChange={(event) => setScheduleDraft((draft) => ({ ...draft, note: event.target.value }))}
                    placeholder="Optional detail"
                  />
                </label>
                <button type="submit" disabled={!scheduleDraft.title.trim() || !scheduleDraft.date}>
                  Add schedule
                </button>
              </form>

              <div className="private-schedule-list">
                {selectedDateSchedules.length === 0 ? (
                  <p className="private-schedule-empty">No schedule on this day.</p>
                ) : (
                  selectedDateSchedules.map((item) => {
                    const linkedEntry = item.entryId ? entries.find((entry) => entry.id === item.entryId) : null;
                    return (
                      <article key={item.id} className={item.done ? 'is-done' : ''}>
                        <div>
                          <span>{formatScheduleTime(item)}</span>
                          <h3>{item.title}</h3>
                          {linkedEntry && <small>Plan: {linkedEntry.title.trim() || 'Untitled plan'}</small>}
                          {item.note && <p>{item.note}</p>}
                        </div>
                        <div className="private-schedule-item-actions">
                          <button type="button" onClick={() => updateSchedule(item.id, { done: !item.done })}>
                            {item.done ? 'Reopen' : 'Done'}
                          </button>
                          <button type="button" onClick={() => deleteSchedule(item.id)}>
                            Delete
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
