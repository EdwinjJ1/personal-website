'use client';

import BaseCard from './BaseCard';
import Avatar from '../Avatar';

export default function PersonalCard() {
  return (
    <BaseCard size="md" delay={0.1} className="lg:col-span-4" glass={true}>
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <Avatar size="sm" />
          <div>
            <p className="text-2xl font-black tracking-tight text-ink">Evan Lin</p>
            <p className="text-sm text-sage">Computer Science Student</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed flex-grow text-ink-mid">
          19-year-old CS student at UNSW Sydney with a passion for AI and
          innovation. Former startup founder turned student, dedicated to
          building technology that makes a meaningful impact.
        </p>

        <div className="flex gap-2 mt-3">
          <span className="badge">Available for work</span>
        </div>
      </div>
    </BaseCard>
  );
}
