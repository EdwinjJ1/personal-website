'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { aiCardFullPayload, aiCardLinkPayload, AI_CARD_URL } from '@/data/aiCard';

type CopyKind = 'full' | 'link';

const cardStyle = {
  background:
    'linear-gradient(to bottom right, rgba(40, 38, 34, 0.6), rgba(33, 30, 28, 0.5), rgba(40, 38, 34, 0.6))',
  borderColor: 'rgba(114, 110, 102, 0.3)',
};

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy path
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

interface AICardPanelProps {
  /** When true, renders a more compact version for embedding inside the About page. */
  compact?: boolean;
}

export default function AICardPanel({ compact = false }: AICardPanelProps) {
  const [copied, setCopied] = useState<CopyKind | null>(null);
  const [failed, setFailed] = useState(false);

  const handleCopy = async (kind: CopyKind) => {
    const payload = kind === 'full' ? aiCardFullPayload : aiCardLinkPayload;
    const ok = await copyToClipboard(payload);
    if (ok) {
      setFailed(false);
      setCopied(kind);
      window.setTimeout(() => setCopied((c) => (c === kind ? null : c)), 2000);
    } else {
      setFailed(true);
    }
  };

  return (
    <div
      className={`rounded-xl border ${compact ? 'p-6' : 'p-8'}`}
      style={cardStyle}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <h3 className="text-xl font-bold" style={{ color: '#7a9088' }}>
          Hand me to an AI
        </h3>
      </div>

      <p className="text-sm leading-relaxed mb-5" style={{ color: '#b8b4aa' }}>
        Want an AI to actually know me? Copy one of these into ChatGPT, Claude, or any
        assistant — it&apos;ll get my background, projects, and resume in one shot.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => handleCopy('full')}
          className="flex-1 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors"
          style={{
            backgroundColor: copied === 'full' ? 'rgba(122, 144, 136, 0.3)' : 'rgba(122, 144, 136, 0.15)',
            color: '#e0d8cc',
            borderColor: 'rgba(122, 144, 136, 0.4)',
          }}
        >
          {copied === 'full' ? '✓ Copied' : '📋 Copy full brief'}
        </button>

        <button
          type="button"
          onClick={() => handleCopy('link')}
          className="flex-1 px-4 py-2.5 rounded-lg border text-sm font-semibold transition-colors"
          style={{
            backgroundColor: copied === 'link' ? 'rgba(122, 144, 136, 0.3)' : 'transparent',
            color: '#b8b4aa',
            borderColor: 'rgba(114, 110, 102, 0.4)',
          }}
        >
          {copied === 'link' ? '✓ Copied' : '🔗 Copy links'}
        </button>
      </div>

      {failed && (
        <p className="text-xs mt-3" style={{ color: '#c98a7a' }}>
          Couldn&apos;t copy automatically — select the text manually, or just share{' '}
          <span style={{ color: '#7a9088' }}>{AI_CARD_URL}</span>.
        </p>
      )}

      {!compact && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs mt-5"
          style={{ color: '#8a857b' }}
        >
          Tip: web-connected AIs can also just read{' '}
          <span style={{ color: '#7a9088' }}>evanlin.site/llms.txt</span> on their own.
        </motion.p>
      )}
    </div>
  );
}
