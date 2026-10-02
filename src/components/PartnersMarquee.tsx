import React from 'react';

interface PartnersMarqueeProps {
  onOpenAirHelp?: () => void;
  onSelectService?: (service: string) => void;
}

export const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({
  onOpenAirHelp,
  onSelectService,
}) => {
  const partners = [
    {
      id: 'aviasales',
      name: 'Aviasales',
      onClick: () => {
        window.open('https://www.aviasales.com', '_blank', 'noopener,noreferrer');
      },
      logo: (
        <svg viewBox="0 0 160 36" className="h-7 sm:h-8 w-auto fill-current" aria-label="Aviasales Logo">
          {/* Airplane Icon */}
          <g transform="translate(0, 3)">
            <path
              d="M16 2L3 17l11-1.5L21 28l4-1-2-12.5L30 13l2-3-19 2z"
              fill="#00A3FF"
            />
            <path
              d="M16 2l-3 8.5 8-1.5L16 2z"
              fill="#38BDF8"
            />
          </g>
          {/* Wordmark */}
          <text
            x="38"
            y="24"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="22"
            letterSpacing="-0.5px"
            fill="#FFFFFF"
          >
            avia<tspan fill="#00A3FF">sales</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'trip',
      name: 'Trip.com',
      onClick: () => {
        window.open('https://www.trip.com', '_blank', 'noopener,noreferrer');
      },
      logo: (
        <svg viewBox="0 0 145 36" className="h-7 sm:h-8 w-auto fill-current" aria-label="Trip.com Logo">
          {/* Circular badge */}
          <circle cx="16" cy="18" r="14" fill="#2681FF" />
          <path
            d="M10.5 18c0-3.3 2.7-6 6-6 2.5 0 4.6 1.5 5.5 3.7l-2.6 1.1c-.6-1.4-2-2.3-3.6-2.3-2.1 0-3.8 1.6-3.8 3.5s1.7 3.5 3.8 3.5c1.5 0 2.8-.8 3.4-2h-3.4v-2.3h5.9v4.5c-1.4 1.7-3.5 2.8-5.9 2.8-4.4 0-8-3.6-8-8z"
            fill="#FFFFFF"
          />
          {/* Wordmark */}
          <text
            x="36"
            y="24"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="22"
            letterSpacing="-0.5px"
            fill="#FFFFFF"
          >
            Trip<tspan fill="#2681FF">.com</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'getrentacar',
      name: 'GetrentalCar',
      onClick: () => {
        if (onSelectService) {
          onSelectService('Cars');
        } else {
          window.open('https://getrentacar.com', '_blank', 'noopener,noreferrer');
        }
      },
      logo: (
        <svg viewBox="0 0 175 36" className="h-7 sm:h-8 w-auto fill-current" aria-label="GetrentalCar Logo">
          {/* Car outline badge */}
          <g transform="translate(0, 5)">
            <rect x="0" y="0" width="28" height="24" rx="7" fill="#F59E0B" />
            <path
              d="M6 16h16M7 11l2-4h10l2 4M9 16a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm10 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              stroke="#000000"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
          {/* Wordmark */}
          <text
            x="36"
            y="24"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="20"
            letterSpacing="-0.4px"
            fill="#FFFFFF"
          >
            Get<tspan fill="#F59E0B">rentalCar</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'airhelp',
      name: 'AirHelp',
      onClick: () => {
        if (onOpenAirHelp) {
          onOpenAirHelp();
        } else {
          window.open('https://www.airhelp.com', '_blank', 'noopener,noreferrer');
        }
      },
      logo: (
        <svg viewBox="0 0 140 36" className="h-7 sm:h-8 w-auto fill-current" aria-label="AirHelp Logo">
          {/* Red Origami Jet */}
          <g transform="translate(0, 4)">
            <path
              d="M24 2L2 14l10 4 12-16z"
              fill="#FF3B30"
            />
            <path
              d="M12 18l4 8 8-24-12 16z"
              fill="#DC2626"
            />
          </g>
          {/* Wordmark */}
          <text
            x="32"
            y="24"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="-0.5px"
            fill="#FFFFFF"
          >
            Air<tspan fill="#FF3B30">Help</tspan>
          </text>
        </svg>
      ),
    },
    {
      id: 'booking',
      name: 'Booking.com',
      onClick: () => {
        if (onSelectService) {
          onSelectService('Hotels');
        } else {
          window.open('https://www.booking.com', '_blank', 'noopener,noreferrer');
        }
      },
      logo: (
        <svg viewBox="0 0 175 36" className="h-7 sm:h-8 w-auto fill-current" aria-label="Booking.com Logo">
          {/* Booking Dark Navy Pill Badge */}
          <rect x="0" y="4" width="28" height="28" rx="7" fill="#003580" />
          <text
            x="7"
            y="23"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="900"
            fontSize="18"
            fill="#FFFFFF"
          >
            B<tspan fill="#006CE4">.</tspan>
          </text>
          {/* Wordmark */}
          <text
            x="35"
            y="24"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="21"
            letterSpacing="-0.4px"
            fill="#FFFFFF"
          >
            Booking<tspan fill="#38BDF8">.com</tspan>
          </text>
        </svg>
      ),
    },
  ];

  // Repeat the 5 partners multiple times to ensure seamless infinite looping
  const duplicatedPartners = [
    ...partners,
    ...partners,
    ...partners,
    ...partners,
    ...partners,
    ...partners,
  ];

  return (
    <section 
      id="partners-marquee-section" 
      aria-label="Partners Marquee"
      className="w-full py-6 sm:py-8 relative z-10 overflow-hidden select-none bg-transparent"
    >
      {/* Marquee Wrapper with soft edge gradient fades */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Mask */}
        <div 
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-r from-black via-black/80 to-transparent z-10" 
          aria-hidden="true" 
        />
        {/* Right Fade Mask */}
        <div 
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 lg:w-44 bg-gradient-to-l from-black via-black/80 to-transparent z-10" 
          aria-hidden="true" 
        />

        {/* Animated Marquee Strip containing ONLY the logos */}
        <div className="animate-marquee flex items-center gap-12 sm:gap-16 lg:gap-24 cursor-pointer">
          {duplicatedPartners.map((p, idx) => (
            <div
              key={`${p.id}-${idx}`}
              onClick={p.onClick}
              title={p.name}
              className="flex items-center justify-center flex-shrink-0 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              {p.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
