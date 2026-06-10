import React from 'react';
import { Car, Zap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1530 50%, #0A1628 100%)' }}>
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #00C2FF 0%, transparent 70%)',
            transform: 'translate(30%, -30%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, #10B981 0%, transparent 70%)',
            transform: 'translate(-30%, 30%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,194,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Logo + Title */}
          <div className="flex items-start gap-5">
            {/* Icon mark */}
            <div
              className="flex items-center justify-center w-14 h-14 rounded-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00C2FF22, #10B98122)',
                border: '1px solid #00C2FF44',
              }}
            >
              <Car size={28} style={{ color: '#00C2FF' }} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1
                  className="text-2xl md:text-3xl font-bold tracking-tight text-white"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Fleet Expansion Advisor
                </h1>
                {/* 1Now badge */}
                <span
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #00C2FF22, #00C2FF11)',
                    border: '1px solid #00C2FF55',
                    color: '#00C2FF',
                  }}
                >
                  <Zap size={10} />
                  Built for 1Now Operators
                </span>
              </div>
              <p className="text-base md:text-lg" style={{ color: '#94A3B8' }}>
                Know exactly when to grow —{' '}
                <span style={{ color: '#00C2FF' }}>and what to buy.</span>
              </p>
            </div>
          </div>

          {/* Right: Stats strip */}
          <div className="flex items-center gap-6 md:gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">6</div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                Vehicles
              </div>
            </div>
            <div
              className="w-px h-8 hidden md:block"
              style={{ background: '#1F2937' }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
                77%
              </div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                Avg Util.
              </div>
            </div>
            <div
              className="w-px h-8 hidden md:block"
              style={{ background: '#1F2937' }}
            />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">$9,735</div>
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                Mo. Revenue
              </div>
            </div>
          </div>
        </div>

        {/* Mobile badge */}
        <div className="mt-4 sm:hidden">
          <span
            className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #00C2FF22, #00C2FF11)',
              border: '1px solid #00C2FF55',
              color: '#00C2FF',
            }}
          >
            <Zap size={10} />
            Built for 1Now Operators
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
