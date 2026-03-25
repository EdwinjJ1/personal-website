'use client';

import { useState } from 'react';

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) color = color.split('').map(c => c + c).join('');
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

interface FolderProps {
  color?: string;
  size?: number;
  // Each item: { content, onClick } — onClick fires when that paper is clicked while open
  items?: { content: React.ReactNode; onClick?: () => void }[];
  className?: string;
}

export default function Folder({ color = '#7a9088', size = 1, items = [], className = '' }: FolderProps) {
  const maxItems = 3;
  const papers = [...items.slice(0, maxItems)];
  while (papers.length < maxItems) papers.push({ content: null });

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);
  const paperBg = ['#d8d2c8', '#e4dfd6', '#f0ece6'];

  const toggleFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(prev => {
      if (prev) setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
      return !prev;
    });
  };

  const handlePaperMouseMove = (e: React.MouseEvent, i: number) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
    const offsetY = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
    setPaperOffsets(prev => { const n = [...prev]; n[i] = { x: offsetX, y: offsetY }; return n; });
  };

  const handlePaperMouseLeave = (_e: React.MouseEvent, i: number) => {
    setPaperOffsets(prev => { const n = [...prev]; n[i] = { x: 0, y: 0 }; return n; });
  };

  const handlePaperClick = (e: React.MouseEvent, i: number) => {
    if (!open) return;
    e.stopPropagation();
    papers[i].onClick?.();
  };

  return (
    <div style={{ transform: `scale(${size})`, transformOrigin: 'bottom center', display: 'inline-block' }} className={className}>
      <div
        onClick={toggleFolder}
        style={{ cursor: 'pointer', transition: 'transform 0.2s ease-in', transform: open ? 'translateY(-8px)' : 'none' }}
      >
        <div style={{ position: 'relative', width: 100, height: 80, background: folderBackColor, borderRadius: '0 10px 10px 10px' }}>
          {/* Tab */}
          <div style={{ position: 'absolute', bottom: '98%', left: 0, width: 30, height: 10, background: folderBackColor, borderRadius: '5px 5px 0 0' }} />

          {/* Papers */}
          {papers.map(({ content, onClick }, i) => {
            let transform = 'translate(-50%, 10%)';
            if (open) {
              const magX = paperOffsets[i].x;
              const magY = paperOffsets[i].y;
              if (i === 0) transform = `translate(calc(-120% + ${magX}px), calc(-70% + ${magY}px)) rotateZ(-15deg)`;
              if (i === 1) transform = `translate(calc(10% + ${magX}px), calc(-70% + ${magY}px)) rotateZ(15deg)`;
              if (i === 2) transform = `translate(calc(-50% + ${magX}px), calc(-100% + ${magY}px)) rotateZ(5deg)`;
            }
            return (
              <div
                key={i}
                onMouseMove={e => handlePaperMouseMove(e, i)}
                onMouseLeave={e => handlePaperMouseLeave(e, i)}
                onClick={e => handlePaperClick(e, i)}
                style={{
                  position: 'absolute',
                  zIndex: 2,
                  bottom: '10%',
                  left: '50%',
                  width: i === 0 ? '70%' : i === 1 ? '80%' : '90%',
                  height: i === 0 ? '80%' : '70%',
                  background: paperBg[i],
                  borderRadius: 8,
                  transform,
                  transition: 'all 0.3s ease-in-out',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: open && onClick ? 'pointer' : 'default',
                }}
              >
                {content}
              </div>
            );
          })}

          {/* Front flaps */}
          {[1, -1].map((skew, i) => (
            <div key={i} style={{
              position: 'absolute', zIndex: 3, inset: 0,
              background: color, borderRadius: '5px 10px 10px 10px',
              transformOrigin: 'bottom',
              transform: open ? `skew(${skew * 15}deg) scaleY(0.6)` : 'none',
              transition: 'all 0.3s ease-in-out',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
