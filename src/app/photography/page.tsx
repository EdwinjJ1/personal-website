'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import { photos, categories, Photo } from '@/data/photography';
import { getAssetPath } from '@/lib/utils';

export default function PhotographyPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // Filter photos based on category
  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(photo => photo.category === selectedCategory);

  // Find the actual index in the full 'photos' array or the filtered list?
  // It's better to navigate within the *filtered* list for the lightbox.
  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev === null || prev === filteredPhotos.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  }, [filteredPhotos.length, selectedPhotoIndex]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev === null || prev === 0 ? filteredPhotos.length - 1 : prev - 1
    );
    setIsZoomed(false);
  }, [filteredPhotos.length, selectedPhotoIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedPhotoIndex === null) return;
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'Escape') setSelectedPhotoIndex(null);
  }, [selectedPhotoIndex, handleNext, handlePrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentPhoto) return;
    const url = window.location.href;
    const text = `Check out "${currentPhoto.title}" by Edwin on his portfolio!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: currentPhoto.title, text, url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen py-24 px-4" style={{ backgroundColor: '#1a1816', color: '#e0d8cc' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4" style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Photography Portfolio
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#b8b4aa' }}>
              Capturing moments when I trade the keyboard for a camera.
              Exploring Sydney through light, composition, and storytelling.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300`}
                style={
                  selectedCategory === category
                    ? { background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }
                    : { backgroundColor: '#282622', color: '#b8b4aa' }
                }
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredPhotos.map((photo, index) => (
                <motion.div
                  layout
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-neutral-900"
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <Image
                    src={getAssetPath(photo.image)}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={index < 4} // Load first 4 images immediately
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl font-bold mb-1" style={{ color: '#e0d8cc' }}>{photo.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#b8b4aa' }}>{photo.location}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(122, 144, 136, 0.2)', color: '#7a9088' }}>
                          {photo.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Full Screen Lightbox */}
          <AnimatePresence>
            {currentPhoto && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
                onClick={() => setSelectedPhotoIndex(null)}
              >
                {/* Top Bar: Close & Share */}
                <div className="absolute top-4 right-4 z-50 flex gap-4">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                    title="Share"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.287.696.345 1.045m-3.41 2.935a2.25 2.25 0 0 1 0-2.186m0-2.186c.222.126.479.196.75.196 1.05 0 1.959-.577 2.449-1.427m3.39-1.077a2.25 2.25 0 0 1 .75-1.898m0 0c.34-.176.716-.284 1.115-.284 1.34 0 2.428 1.088 2.428 2.428 0 1.34-1.088 2.428-2.428 2.428-.62 0-1.196-.234-1.637-.622" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Main Image Container */}
                <div
                  className="relative w-full h-full flex items-center justify-center p-4 md:p-12"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                  }}
                >
                  <motion.div
                    key={currentPhoto.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`relative w-full h-full max-w-7xl max-h-[85vh] ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  >
                    <Image
                      src={getAssetPath(currentPhoto.image)}
                      alt={currentPhoto.title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </motion.div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-50 hidden md:block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 z-50 hidden md:block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Info Bar (Bottom) */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{currentPhoto.title}</h2>
                      <p className="text-gray-300 text-sm mb-2">{currentPhoto.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.62.83.799 1.654 1.382 2.274 1.766a11.998 11.998 0 00.758.432l.024.01.006.004zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {currentPhoto.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                          </svg>
                          {currentPhoto.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          {currentPhoto.camera}
                        </span>
                      </div>
                    </div>

                    {/* Settings Badge */}
                    <div className="px-3 py-1 rounded bg-white/10 border border-white/20 text-xs font-mono whitespace-nowrap">
                      {currentPhoto.settings}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#e0d8cc' }}>Interested in a photoshoot?</h2>
            <p className="mb-6" style={{ color: '#b8b4aa' }}>
              Available for portrait sessions, event photography, and creative collaborations in Sydney.
            </p>
            <a
              href="mailto:jiaedwin0605@gmail.com"
              className="inline-block px-8 py-3 font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#e0d8cc' }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}