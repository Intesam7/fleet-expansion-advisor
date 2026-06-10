import React from 'react';
import { Star, ChevronRight, TrendingUp, Zap } from 'lucide-react';
import { vehicleRecommendations, VehicleRecommendation } from '../data/fleetData';

interface Props {
  onSelectRecommendation: (rec: VehicleRecommendation) => void;
  roiRef: React.RefObject<HTMLElement | null>;
}

const DemandBar: React.FC<{ score: number; color: string }> = ({ score, color }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
      />
    </div>
    <span className="text-xs font-bold w-12 text-right" style={{ color }}>
      {score}/100
    </span>
  </div>
);

const RecommendationCard: React.FC<{
  rec: VehicleRecommendation;
  onSelect: (rec: VehicleRecommendation) => void;
  roiRef: React.RefObject<HTMLElement | null>;
}> = ({ rec, onSelect, roiRef }) => {
  const isTop = rec.isTopPick;
  const accentColor = isTop ? '#F59E0B' : rec.rank === 2 ? '#00C2FF' : '#10B981';
  const demandColor = rec.demandScore >= 80 ? '#10B981' : rec.demandScore >= 65 ? '#00C2FF' : '#F59E0B';

  const handleClick = () => {
    onSelect(rec);
    setTimeout(() => {
      roiRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: '#111827',
        border: `1px solid ${isTop ? '#F59E0B40' : '#1F2937'}`,
        boxShadow: isTop ? '0 0 30px #F59E0B15' : 'none',
      }}
    >
      {/* Top pick badge */}
      {isTop && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #F59E0B, #F59E0B80, transparent)' }}
        />
      )}

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isTop && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B30, #F59E0B15)',
                    border: '1px solid #F59E0B50',
                    color: '#F59E0B',
                  }}
                >
                  <Star size={10} fill="#F59E0B" />
                  TOP PICK
                </span>
              )}
              {!isTop && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: '#1F2937',
                    border: '1px solid #374151',
                    color: '#6B7280',
                  }}
                >
                  #{rec.rank} Ranked
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-white">{rec.vehicleType}</h3>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              e.g. {rec.exampleModel}
            </p>
          </div>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{
              background: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
          >
            <TrendingUp size={18} style={{ color: accentColor }} />
          </div>
        </div>

        {/* Reason */}
        <div
          className="p-3 rounded-lg mb-5 flex-1"
          style={{ background: '#0A0F1E80', border: '1px solid #1F2937' }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
            {rec.reason}
          </p>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div
            className="p-3 rounded-xl"
            style={{ background: '#0A0F1E80', border: '1px solid #1F2937' }}
          >
            <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6B7280' }}>
              Projected ADR
            </div>
            <div className="text-base font-bold text-white">
              ${rec.projectedADRLow}–{rec.projectedADRHigh}
              <span className="text-xs font-normal" style={{ color: '#6B7280' }}>
                /day
              </span>
            </div>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ background: '#0A0F1E80', border: '1px solid #1F2937' }}
          >
            <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#6B7280' }}>
              Monthly Revenue
            </div>
            <div className="text-base font-bold" style={{ color: '#10B981' }}>
              ${rec.projectedRevenueLow.toLocaleString()}–{rec.projectedRevenueHigh.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Demand score */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
              Demand Match Score
            </span>
            <span className="text-xs font-bold" style={{ color: demandColor }}>
              {rec.demandScore >= 80 ? 'Strong' : rec.demandScore >= 65 ? 'Good' : 'Moderate'}
            </span>
          </div>
          <DemandBar score={rec.demandScore} color={demandColor} />
        </div>

        {/* CTA */}
        <button
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 hover:gap-3 active:scale-95"
          style={
            isTop
              ? {
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#000',
                  boxShadow: '0 4px 16px #F59E0B30',
                }
              : {
                  background: '#1F2937',
                  color: '#E5E7EB',
                  border: '1px solid #374151',
                }
          }
          onMouseEnter={(e) => {
            if (!isTop) {
              (e.currentTarget as HTMLButtonElement).style.background = '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (!isTop) {
              (e.currentTarget as HTMLButtonElement).style.background = '#1F2937';
            }
          }}
        >
          Run ROI Analysis
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const VehicleRecommendations: React.FC<Props> = ({ onSelectRecommendation, roiRef }) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: '#F59E0B15', border: '1px solid #F59E0B30' }}
          >
            <Zap size={18} style={{ color: '#F59E0B' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">What Should You Add?</h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              Ranked by projected ROI based on your fleet profile and local market demand
            </p>
          </div>
        </div>
        <div
          className="hidden md:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{
            background: '#1F2937',
            border: '1px solid #374151',
            color: '#6B7280',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#10B981' }} />
          Live market data
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {vehicleRecommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            rec={rec}
            onSelect={onSelectRecommendation}
            roiRef={roiRef}
          />
        ))}
      </div>
    </section>
  );
};

export default VehicleRecommendations;
