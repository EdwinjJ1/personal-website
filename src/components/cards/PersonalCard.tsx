'use client';

import BaseCard from './BaseCard';
import Avatar from '../Avatar';

export default function PersonalCard() {
  return (
    <BaseCard size="md" delay={0.1} className="lg:col-span-4">
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <Avatar size="sm" />
          <div>
            <h1 className="text-2xl font-bold text-white">Evan Lin</h1>
            <p className="text-teal-400 text-sm">Computer Science Student</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm leading-relaxed flex-grow">
          19-year-old CS student at UNSW Sydney with a passion for AI and innovation.
          Former startup founder turned student, dedicated to building technology that makes a meaningful impact.
        </p>

        <div className="flex gap-2 mt-3">
          <span className="px-3 py-1 bg-green-900/30 text-green-300 text-xs rounded-full border border-green-500/30">
            Available for work
          </span>
        </div>
      </div>
    </BaseCard>
  );
}
