import React from 'react';

// Common floating animation styling inline to keep SVGs alive and smooth
const floatAnimationStyles = `
  @keyframes svg-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes svg-pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.3; }
  }
  @keyframes svg-spin {
    100% { transform: rotate(360deg); }
  }
  .svg-float-element { animation: svg-float 5s ease-in-out infinite; }
  .svg-pulse-element { animation: svg-pulse 3s ease-in-out infinite; }
  .svg-spin-element { transform-origin: center; animation: svg-spin 12s linear infinite; }
`;

export const HeroIllustration = () => (
  <div className="w-full max-w-[480px] mx-auto svg-float-element select-none">
    <style>
      {floatAnimationStyles}
      {`
        .svg-float-1 { animation: svg-float 6s ease-in-out infinite; }
        .svg-float-2 { animation: svg-float 6s ease-in-out infinite; animation-delay: 1.5s; }
        .svg-float-3 { animation: svg-float 6s ease-in-out infinite; animation-delay: 3s; }
        .svg-float-4 { animation: svg-float 6s ease-in-out infinite; animation-delay: 4.5s; }
        .svg-core-pulse { animation: svg-pulse 2s ease-in-out infinite; }
        .svg-orbit-ring { transform-origin: 250px 245px; animation: svg-spin 25s linear infinite; }
        .svg-orbit-ring-rev { transform-origin: 250px 245px; animation: svg-spin 30s linear infinite reverse; }
        .svg-flow-line { stroke-dasharray: 6 12; stroke-dashoffset: 0; animation: svg-dash 10s linear infinite; }
        @keyframes svg-dash {
          to { stroke-dashoffset: -120; }
        }
      `}
    </style>
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* Background radial glow */}
      <circle cx="250" cy="245" r="180" fill="url(#heroGlow)" opacity="0.35" className="svg-pulse-element" />

      {/* Floating starry elements */}
      <polygon points="120,60 123,66 129,67 124,71 126,77 120,74 114,77 116,71 111,67 117,66" fill="#818cf8" opacity="0.7" className="svg-pulse-element" style={{ animationDelay: '0.5s' }} />
      <polygon points="380,380 383,386 389,387 384,391 386,397 380,394 374,397 376,391 371,387 377,386" fill="#a78bfa" opacity="0.6" className="svg-pulse-element" style={{ animationDelay: '1.2s' }} />
      <polygon points="410,120 412,124 417,125 413,128 414,133 410,131 406,133 407,128 403,125 408,124" fill="#f43f5e" opacity="0.5" className="svg-pulse-element" />
      <polygon points="70,220 72,224 77,225 73,228 74,233 70,231 66,233 67,228 63,225 68,224" fill="#10b981" opacity="0.5" className="svg-pulse-element" style={{ animationDelay: '1.8s' }} />

      {/* AI neural connection paths radiating from center core */}
      <path d="M250,245 Q125,200 105,165" stroke="url(#lineGradPdf)" strokeWidth="2.5" strokeLinecap="round" className="svg-flow-line" />
      <path d="M250,245 Q375,200 395,165" stroke="url(#lineGradVideo)" strokeWidth="2.5" strokeLinecap="round" className="svg-flow-line" />
      <path d="M250,245 Q125,290 125,310" stroke="url(#lineGradNotes)" strokeWidth="2.5" strokeLinecap="round" className="svg-flow-line" />
      <path d="M250,245 Q375,290 385,310" stroke="url(#lineGradWeb)" strokeWidth="2.5" strokeLinecap="round" className="svg-flow-line" />

      {/* Orbit Rings crossing the central core */}
      <ellipse cx="250" cy="245" rx="90" ry="32" stroke="#6366f1" strokeWidth="2" strokeDasharray="12 24" className="svg-orbit-ring" opacity="0.7" />
      <ellipse cx="250" cy="245" rx="110" ry="40" stroke="#db2777" strokeWidth="1.5" strokeDasharray="8 16" className="svg-orbit-ring-rev" opacity="0.6" />

      {/* Central Core: Holographic Vault Cube */}
      <g transform="translate(0, 0)">
        {/* Isometric base shadow */}
        <polygon points="210,265 250,245 290,265 250,285" fill="#4338ca" opacity="0.3" />
        
        {/* Isometric Portal Platform */}
        <polygon points="200,260 250,235 300,260 250,285" fill="#0f111a" stroke="#818cf8" strokeWidth="2.5" />
        <polygon points="200,260 200,267 250,292 250,285" fill="#4f46e5" />
        <polygon points="250,285 250,292 300,267 300,260" fill="#312e81" />
        
        {/* Holographic Translucent Glass Box projecting */}
        <polygon points="210,245 250,225 290,245 250,265" fill="#818cf8" fillOpacity="0.1" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="210" y1="245" x2="210" y2="200" stroke="#818cf8" strokeWidth="1.5" />
        <line x1="250" y1="265" x2="250" y2="220" stroke="#818cf8" strokeWidth="1.5" />
        <line x1="290" y1="245" x2="290" y2="200" stroke="#818cf8" strokeWidth="1.5" />
        <polygon points="210,200 250,180 290,200 250,220" fill="url(#coreGlow)" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="2" />

        {/* Central brain node (digital knowledge) */}
        <g transform="translate(130, 95)" className="svg-core-pulse">
          {/* Brain Left Hemisphere */}
          <path d="M120 100C100 100 85 112 85 128C85 136 89 142 93 146C89 150 87 156 87 162C87 178 102 188 120 188" stroke="#818cf8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
          {/* Brain Right Hemisphere */}
          <path d="M120 100C140 100 155 112 155 128C155 136 151 142 147 146C151 150 153 156 153 162C153 178 138 188 120 188" stroke="#f472b6" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.9" />
          {/* Connection bridge */}
          <line x1="120" y1="108" x2="120" y2="180" stroke="#6366f1" strokeWidth="3" strokeDasharray="4 4" />
        </g>
      </g>

      {/* Floating Resource Cards representation */}
      
      {/* 1. PDF Document Card (Top-Left) */}
      <g className="svg-float-3" transform="translate(40, 70)">
        <rect width="130" height="95" rx="16" fill="#0f111a" fillOpacity="0.85" stroke="#f43f5e" strokeWidth="2.5" />
        <rect x="12" y="12" width="28" height="16" rx="4" fill="#f43f5e" />
        <text x="16" y="23" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">PDF</text>
        <rect x="48" y="18" width="60" height="5" rx="2.5" fill="#e2e8f0" />
        <line x1="12" y1="38" x2="118" y2="38" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="12" y="48" width="96" height="4" rx="2" fill="#334155" />
        <rect x="12" y="58" width="84" height="4" rx="2" fill="#334155" />
        <rect x="12" y="68" width="90" height="4" rx="2" fill="#1e293b" />
        <rect x="12" y="78" width="50" height="4" rx="2" fill="#1e293b" />
      </g>

      {/* 2. Videos card (Top-Right) */}
      <g className="svg-float-2" transform="translate(330, 70)">
        <rect width="130" height="95" rx="16" fill="#0f111a" fillOpacity="0.85" stroke="#ef4444" strokeWidth="2.5" />
        <rect x="10" y="10" width="110" height="50" rx="10" fill="#161822" />
        <circle cx="65" cy="35" r="12" fill="#ef4444" fillOpacity="0.25" />
        <polygon points="62,30 62,40 71,35" fill="#ef4444" />
        <rect x="20" y="52" width="90" height="3" rx="1.5" fill="#334155" />
        <rect x="20" y="52" width="45" height="3" rx="1.5" fill="#ef4444" />
        <rect x="12" y="70" width="80" height="5" rx="2.5" fill="#e2e8f0" />
        <rect x="12" y="80" width="45" height="4" rx="2" fill="#475569" />
      </g>

      {/* 3. Smart Notes Card (Bottom-Left) */}
      <g className="svg-float-1" transform="translate(60, 310)">
        <rect width="130" height="95" rx="16" fill="#0f111a" fillOpacity="0.85" stroke="#8b5cf6" strokeWidth="2.5" />
        <rect x="12" y="12" width="22" height="22" rx="6" fill="#8b5cf6" fillOpacity="0.15" />
        <path d="M17,18H29M17,23H25" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
        <rect x="42" y="16" width="60" height="6" rx="3" fill="#e2e8f0" />
        <rect x="42" y="26" width="35" height="4" rx="2" fill="#475569" />
        <line x1="12" y1="44" x2="118" y2="44" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="12" y="54" width="90" height="5" rx="2.5" fill="#334155" />
        <rect x="12" y="66" width="70" height="5" rx="2.5" fill="#334155" />
        <circle cx="110" cy="67" r="4.5" fill="#8b5cf6" className="svg-pulse-element" />
      </g>

      {/* 4. Websites Bookmark Card (Bottom-Right) */}
      <g className="svg-float-4" transform="translate(320, 310)">
        <rect width="130" height="95" rx="16" fill="#0f111a" fillOpacity="0.85" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="12" fill="#10b981" fillOpacity="0.15" />
        <circle cx="24" cy="24" r="7" stroke="#10b981" strokeWidth="1.5" fill="none" />
        <rect x="44" y="16" width="65" height="6" rx="3" fill="#e2e8f0" />
        <rect x="44" y="26" width="45" height="4" rx="2" fill="#475569" />
        <line x1="12" y1="44" x2="118" y2="44" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="12" y="54" width="70" height="5" rx="2.5" fill="#334155" />
        <rect x="12" y="66" width="40" height="12" rx="6" fill="#10b981" fillOpacity="0.15" />
        <rect x="58" y="66" width="35" height="12" rx="6" fill="#1e293b" />
      </g>

      {/* Gradients */}
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coreGlow" x1="210" y1="180" x2="290" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
        <linearGradient id="lineGradPdf" x1="250" y1="245" x2="105" y2="165">
          <stop stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="lineGradVideo" x1="250" y1="245" x2="395" y2="165">
          <stop stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <linearGradient id="lineGradNotes" x1="250" y1="245" x2="125" y2="310">
          <stop stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="lineGradWeb" x1="250" y1="245" x2="385" y2="310">
          <stop stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const WelcomeIllustration = () => (
  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 select-none svg-float-element">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Decorative background glow */}
      <circle cx="100" cy="100" r="70" fill="url(#welcomeGlow)" opacity="0.3" className="svg-pulse-element" />
      
      {/* Glowing library/vault core */}
      <rect x="60" y="50" width="80" height="90" rx="16" fill="#0f111a" stroke="url(#accentGradient)" strokeWidth="3" />
      
      {/* Server slots / book binders details */}
      <rect x="75" y="70" width="50" height="8" rx="4" fill="#818cf8" opacity="0.9" />
      <rect x="75" y="86" width="50" height="8" rx="4" fill="#a78bfa" opacity="0.8" />
      <rect x="75" y="102" width="50" height="8" rx="4" fill="#c084fc" opacity="0.7" />
      <rect x="75" y="118" width="50" height="8" rx="4" fill="#e879f9" opacity="0.6" />

      {/* Server LEDs */}
      <circle cx="68" cy="74" r="2.5" fill="#10b981" className="svg-pulse-element" />
      <circle cx="68" cy="90" r="2.5" fill="#10b981" />
      <circle cx="68" cy="106" r="2.5" fill="#10b981" />
      <circle cx="68" cy="122" r="2.5" fill="#64748b" />

      {/* Floating space elements */}
      <path d="M30 60C30 50 50 50 50 60" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="160" cy="65" r="4" fill="#c084fc" />
      <polygon points="150,130 154,138 162,140 154,142 150,150 146,142 138,140 146,138" fill="#818cf8" className="svg-pulse-element" />

      <defs>
        <radialGradient id="welcomeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="accentGradient" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const EmptyNotesIllustration = () => (
  <div className="w-32 h-32 mx-auto select-none svg-float-element mb-4">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Glow background */}
      <circle cx="100" cy="100" r="60" fill="url(#notesGlow)" opacity="0.25" className="svg-pulse-element" />
      
      {/* Notepad outline */}
      <rect x="55" y="40" width="90" height="110" rx="12" fill="#0b0c10" stroke="#818cf8" strokeWidth="2.5" />
      {/* Binder clips */}
      <line x1="75" y1="30" x2="75" y2="45" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <line x1="100" y1="30" x2="100" y2="45" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
      <line x1="125" y1="30" x2="125" y2="45" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

      {/* Empty page lines with dashed placeholders */}
      <rect x="75" y="65" width="50" height="5" rx="2.5" fill="#334155" />
      <rect x="75" y="82" width="40" height="5" rx="2.5" fill="#1e293b" />
      <rect x="75" y="99" width="50" height="5" rx="2.5" fill="#1e293b" />
      <rect x="75" y="116" width="30" height="5" rx="2.5" fill="#1e293b" />

      {/* Glowing pen */}
      <g transform="translate(130, 80) rotate(15)" className="svg-float-element" style={{ animationDelay: '0.8s' }}>
        <path d="M0 80 L10 50 L35 50 L45 80 L22 90 Z" fill="#8b5cf6" />
        <path d="M22 90 L10 110 L0 80 Z" fill="#c084fc" />
        <circle cx="22" cy="65" r="4" fill="#a78bfa" />
      </g>

      <defs>
        <radialGradient id="notesGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export const EmptyVideosIllustration = () => (
  <div className="w-32 h-32 mx-auto select-none svg-float-element mb-4">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background glow */}
      <circle cx="100" cy="100" r="60" fill="url(#videosGlow)" opacity="0.25" className="svg-pulse-element" />

      {/* Screen Outline */}
      <rect x="40" y="50" width="120" height="90" rx="14" fill="#0b0c10" stroke="#ef4444" strokeWidth="2.5" />
      
      {/* Inside play boundary */}
      <rect x="48" y="58" width="104" height="74" rx="8" fill="#181922" />

      {/* Play button */}
      <polygon points="90,82 90,110 118,96" fill="url(#videoPlayGrad)" stroke="#ef4444" strokeWidth="1.5" />

      {/* Bottom video sliders representation */}
      <rect x="58" y="112" width="60" height="4" rx="2" fill="#ef4444" opacity="0.3" />
      <rect x="58" y="112" width="20" height="4" rx="2" fill="#ef4444" />
      <circle cx="78" cy="114" r="3.5" fill="#e2e8f0" />
      <rect x="126" y="112" width="16" height="4" rx="2" fill="#475569" />

      <defs>
        <radialGradient id="videosGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="videoPlayGrad" x1="90" y1="82" x2="118" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export const EmptyWebsitesIllustration = () => (
  <div className="w-32 h-32 mx-auto select-none svg-float-element mb-4">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="100" r="60" fill="url(#websitesGlow)" opacity="0.25" className="svg-pulse-element" />

      {/* Web browser window */}
      <rect x="45" y="45" width="110" height="95" rx="12" fill="#0b0c10" stroke="#10b981" strokeWidth="2.5" />
      
      {/* Browser headers */}
      <line x1="45" y1="68" x2="155" y2="68" stroke="#10b981" strokeWidth="2" />
      {/* Dot operations */}
      <circle cx="58" cy="56" r="3" fill="#fc5d5b" />
      <circle cx="68" cy="56" r="3" fill="#fdb82d" />
      <circle cx="78" cy="56" r="3" fill="#10b981" />

      {/* Globe drawing inside page */}
      <g transform="translate(75, 80)">
        <circle cx="25" cy="25" r="22" stroke="#334155" strokeWidth="2" />
        <ellipse cx="25" cy="25" rx="22" ry="7" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
        <ellipse cx="25" cy="25" rx="7" ry="22" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
        <line x1="25" y1="3" x2="25" y2="47" stroke="#334155" strokeWidth="1.5" />
        <line x1="3" y1="25" x2="47" y2="25" stroke="#334155" strokeWidth="1.5" />
      </g>

      <defs>
        <radialGradient id="websitesGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export const EmptyPdfsIllustration = () => (
  <div className="w-32 h-32 mx-auto select-none svg-float-element mb-4">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="100" cy="100" r="60" fill="url(#pdfsGlow)" opacity="0.25" className="svg-pulse-element" />

      {/* PDF Document Sheets stacked */}
      {/* Back document */}
      <rect x="62" y="38" width="76" height="105" rx="8" fill="#181922" stroke="#334155" strokeWidth="1.5" />

      {/* Front document */}
      <rect x="54" y="46" width="76" height="105" rx="8" fill="#0b0c10" stroke="#f43f5e" strokeWidth="2.5" />

      {/* PDF tag box */}
      <rect x="66" y="58" width="28" height="16" rx="4" fill="#f43f5e" />
      <text x="71" y="70" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="sans-serif">PDF</text>

      {/* Content lines */}
      <rect x="100" y="64" width="20" height="4" rx="2" fill="#334155" />
      <rect x="66" y="86" width="54" height="4" rx="2" fill="#1e293b" />
      <rect x="66" y="98" width="54" height="4" rx="2" fill="#1e293b" />
      <rect x="66" y="110" width="40" height="4" rx="2" fill="#1e293b" />
      <rect x="66" y="122" width="48" height="4" rx="2" fill="#1e293b" />

      <defs>
        <radialGradient id="pdfsGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);

export const EmptyAiSummaryIllustration = () => (
  <div className="w-20 h-20 mx-auto select-none svg-float-element">
    <style>{floatAnimationStyles}</style>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background glow orb */}
      <circle cx="50" cy="50" r="30" fill="url(#aiGlow)" opacity="0.35" className="svg-pulse-element" />

      {/* Microcontroller core */}
      <rect x="35" y="35" width="30" height="30" rx="8" fill="#0f111a" stroke="#818cf8" strokeWidth="2" />
      
      {/* Glowing brain circuits emerging */}
      {/* Top connection */}
      <path d="M50 35 L50 20 A6 6 0 0 1 56 14" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="56" cy="14" r="2.5" fill="#a78bfa" className="svg-pulse-element" />
      
      {/* Bottom connection */}
      <path d="M50 65 L50 80 A6 6 0 0 0 44 86" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="44" cy="86" r="2.5" fill="#a78bfa" />

      {/* Left connection */}
      <path d="M35 50 L20 50 A6 6 0 0 1 14 44" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="44" r="2.5" fill="#818cf8" />

      {/* Right connection */}
      <path d="M65 50 L80 50 A6 6 0 0 0 86 56" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="86" cy="56" r="2.5" fill="#818cf8" className="svg-pulse-element" />

      {/* Internal neural processor pattern */}
      <circle cx="50" cy="50" r="6" fill="#6366f1" />
      <circle cx="50" cy="50" r="1.5" fill="#ffffff" />

      <defs>
        <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </div>
);
