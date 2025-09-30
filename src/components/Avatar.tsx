'use client';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Avatar = ({ size = 'md', className = '' }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto ${className}`}>
      <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 p-1">
        <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
          <img
            src="/profile.jpg"
            alt="Evan Lin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Avatar;
