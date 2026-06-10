import React, { useEffect, useState } from 'react';

const sections = [
  { id: 'fleet-dashboard', label: 'Fleet' },
  { id: 'expansion-signal', label: 'Signal' },
  { id: 'recommendations', label: 'Vehicles' },
  { id: 'roi-calculator', label: 'ROI Calc' },
  { id: 'ai-brief', label: 'AI Brief' },
];

const SectionNav: React.FC = () => {
  const [active, setActive] = useState('fleet-dashboard');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);

      // Find active section
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="flex flex-col gap-1 p-2 rounded-2xl"
        style={{
          background: '#111827ee',
          border: '1px solid #1F2937',
          backdropFilter: 'blur(12px)',
        }}
      >
        {sections.map((section) => {
          const isActive = active === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left"
              style={{
                background: isActive ? '#00C2FF15' : 'transparent',
                color: isActive ? '#00C2FF' : '#4B5563',
                border: `1px solid ${isActive ? '#00C2FF30' : 'transparent'}`,
              }}
              title={section.label}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: isActive ? '#00C2FF' : '#374151' }}
              />
              <span className="hidden xl:block">{section.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectionNav;
