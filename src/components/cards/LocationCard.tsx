'use client';

import Image from 'next/image';
import BaseCard from './BaseCard';

export default function LocationCard() {
  return (
    <BaseCard
      size="sm"
      delay={0.2}
      className="group min-h-[170px] overflow-hidden lg:col-span-2"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-4 top-8 h-px w-16 bg-gradient-to-r from-transparent via-[#7a9088]/45 to-transparent" />
        <div className="absolute right-5 top-12 h-px w-12 bg-gradient-to-r from-transparent via-[#b8a06a]/35 to-transparent" />
        <div className="absolute inset-x-8 top-14 h-20 bg-[radial-gradient(ellipse_at_center,rgba(122,144,136,0.15),transparent_66%)] opacity-80 transition-opacity duration-500 group-hover:opacity-50" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-between text-center">
        <div className="relative h-[102px] w-full">
          <div className="absolute left-1/2 top-[-12px] h-[118px] w-[178px] -translate-x-1/2 transition-all duration-500 ease-out group-hover:translate-y-1 group-hover:scale-95 group-hover:opacity-0">
            <Image
              src="/images/generated/sydney-landmarks.png"
              alt="Sydney Opera House and Harbour Bridge"
              fill
              priority
              sizes="178px"
              className="object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.36)]"
            />
          </div>
          <div className="absolute left-1/2 top-[-10px] h-[116px] w-[176px] -translate-x-1/2 translate-y-3 scale-95 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
            <Image
              src="/images/generated/beijing-landmarks.png"
              alt="Beijing Forbidden City and Tiananmen inspired landmark"
              fill
              sizes="176px"
              className="object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.34)]"
            />
          </div>
        </div>

        <div className="relative h-[56px] w-full">
          <div className="absolute inset-x-0 top-0 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:opacity-0">
            <p className="mb-1 text-[10px] font-semibold uppercase text-[#8a8680]">Based in</p>
            <div className="mb-1 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#9ab1aa]" />
              <h3 className="text-lg font-semibold leading-none text-[#e0d8cc]">Sydney, Australia</h3>
            </div>
            <p className="text-xs font-medium text-[#8a8680]">UTC+10/11</p>
          </div>

          <div className="absolute inset-x-0 top-0 translate-y-2 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <p className="mb-1 text-[10px] font-semibold uppercase text-[#b38b5a]">Also based in</p>
            <div className="mb-1 flex items-center justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#c59a5e]" />
              <h3 className="text-lg font-semibold leading-none text-[#f0ded0]">Beijing, China</h3>
            </div>
            <p className="text-xs font-medium text-[#9f958a]">UTC+8</p>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}
