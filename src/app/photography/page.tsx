'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import { getAssetPath } from '@/lib/utils';

interface Photo {
  id: number;
  title: string;
  location: string;
  description: string;
  category: string;
  image: string;
  date: string;
  camera?: string;
  settings?: string;
}

const photos: Photo[] = [
  {
    id: 1,
    title: 'Golden Hour at the Harbour',
    location: 'Sydney Harbour Bridge',
    description: 'Long exposure shot capturing the golden hour light reflecting off the harbour waters.',
    category: 'Landscape',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-12',
    camera: 'Sony A7III',
    settings: 'f/8 • 1/125s • ISO 100'
  },
  {
    id: 2,
    title: 'Urban Geometry',
    location: 'Sydney CBD',
    description: 'Modern architecture meets natural light in the heart of the city.',
    category: 'Architecture',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-11',
    camera: 'Sony A7III',
    settings: 'f/5.6 • 1/250s • ISO 200'
  },
  {
    id: 3,
    title: 'Coastal Serenity',
    location: 'Bondi Beach',
    description: 'Early morning waves crashing against the iconic Bondi coastline.',
    category: 'Landscape',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-10',
    camera: 'Sony A7III',
    settings: 'f/11 • 1/500s • ISO 100'
  },
  {
    id: 4,
    title: 'Street Life',
    location: 'Newtown',
    description: 'Candid moment capturing the vibrant street culture of inner Sydney.',
    category: 'Street',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-09',
    camera: 'Sony A7III',
    settings: 'f/2.8 • 1/500s • ISO 400'
  },
  {
    id: 5,
    title: 'Natural Portrait',
    location: 'Royal Botanic Garden',
    description: 'Natural light portrait session in the lush gardens.',
    category: 'Portrait',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-08',
    camera: 'Sony A7III',
    settings: 'f/1.8 • 1/200s • ISO 100'
  },
  {
    id: 6,
    title: 'Night Lights',
    location: 'Circular Quay',
    description: 'Long exposure capturing the city lights and ferry trails.',
    category: 'Night',
    image: getAssetPath('profile.jpg'), // Replace with actual photo
    date: '2024-07',
    camera: 'Sony A7III',
    settings: 'f/16 • 30s • ISO 100'
  }
];

const categories = ['All', 'Landscape', 'Architecture', 'Street', 'Portrait', 'Night'];

export default function PhotographyPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedPhoto, setSelectedPhoto] = React.useState<Photo | null>(null);

  const filteredPhotos = selectedCategory === 'All' 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <PageTransition>
      <div className="min-h-screen py-24 px-4" style={{ backgroundColor: '#1a1816', color: '#c8c0b4' }}>
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
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#9a968e' }}>
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
                    ? { background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#c8c0b4' }
                    : { backgroundColor: '#282622', color: '#9a968e' }
                }
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold mb-1" style={{ color: '#c8c0b4' }}>{photo.title}</h3>
                    <p className="text-sm mb-2" style={{ color: '#9a968e' }}>{photo.location}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(122, 144, 136, 0.2)', color: '#7a9088' }}>
                        {photo.category}
                      </span>
                      <span className="text-xs" style={{ color: '#9a968e' }}>{photo.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Photo Modal */}
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="max-w-6xl w-full rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#282622' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    <Image
                      src={selectedPhoto.image}
                      alt={selectedPhoto.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-2" style={{ color: '#c8c0b4' }}>{selectedPhoto.title}</h2>
                    <p className="mb-4" style={{ color: '#7a9088' }}>{selectedPhoto.location}</p>
                    <p className="mb-6" style={{ color: '#9a968e' }}>{selectedPhoto.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#9a968e' }}>Category:</span>
                        <span style={{ color: '#c8c0b4' }}>{selectedPhoto.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#9a968e' }}>Date:</span>
                        <span style={{ color: '#c8c0b4' }}>{selectedPhoto.date}</span>
                      </div>
                      {selectedPhoto.camera && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#9a968e' }}>Camera:</span>
                          <span style={{ color: '#c8c0b4' }}>{selectedPhoto.camera}</span>
                        </div>
                      )}
                      {selectedPhoto.settings && (
                        <div className="flex items-center gap-2">
                          <span style={{ color: '#9a968e' }}>Settings:</span>
                          <span style={{ color: '#c8c0b4' }}>{selectedPhoto.settings}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedPhoto(null)}
                      className="w-full px-6 py-3 font-semibold rounded-full transition-all duration-300"
                      style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#c8c0b4' }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#c8c0b4' }}>Interested in a photoshoot?</h2>
            <p className="mb-6" style={{ color: '#9a968e' }}>
              Available for portrait sessions, event photography, and creative collaborations in Sydney.
            </p>
            <a
              href="mailto:jiaedwin0605@gmail.com"
              className="inline-block px-8 py-3 font-semibold rounded-full transform hover:scale-105 transition-all duration-300"
              style={{ background: 'linear-gradient(to right, #7a9088, #6a8a8e)', color: '#c8c0b4' }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

