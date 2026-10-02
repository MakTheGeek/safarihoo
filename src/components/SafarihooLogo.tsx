import React from 'react';

interface SafarihooLogoProps {
  className?: string;
  height?: number | string;
  showTagline?: boolean;
}

export const SafarihooLogo: React.FC<SafarihooLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto',
  showTagline = false,
}) => {
  return (
    <div className={`flex flex-col items-start ${showTagline ? 'gap-0.5' : ''}`}>
      <img
        src="https://res.cloudinary.com/opy809y1/image/upload/v1787692461/Logo.blanc.safarihoo.png"
        alt="Safarihoo Logo"
        className={`${className} object-contain select-none transition-transform duration-200 group-hover:scale-[1.02]`}
        loading="eager"
        decoding="async"
      />

      {showTagline && (
        <span className="text-[11px] text-white/80 font-normal tracking-wide pl-1">
          Your Journey, Our Expertise
        </span>
      )}
    </div>
  );
};

