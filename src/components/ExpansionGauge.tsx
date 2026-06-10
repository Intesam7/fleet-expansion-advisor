import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const SCORE = 72;

interface Zone {
  label: string;
  min: number;
  max: number;
  color: string;
  bgColor: string;
}

const zones: Zone[] = [
  { label: 'Hold Off', min: 0, max: 30, color: '#EF4444', bgColor: '#EF444420' },
  { label: 'Monitor Closely', min: 31, max: 60, color: '#F59E0B', bgColor: '#F59E0B20' },
  { label: 'Consider Expanding', min: 61, max: 80, color: '#00C2FF', bgColor: '#00C2FF20' },
  { label: 'Expand Now', min: 81, max: 100, color: '#10B981', bgColor: '#10B98120' },
];

const getZoneForScore = (score: number) => {
  return zones.find((z) => score >= z.min && score <= z.max) || zones[2];
};

// Convert score 0-100 to angle in degrees
// Gauge goes from -135deg (score=0) to +135deg (score=100)
const scoreToAngle = (score: number): number => {
  return -135 + (score / 100) * 270;
};

// SVG gauge path helpers
const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const arcPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
};

const GaugeArc: React.FC<{
  cx: number;
  cy: number;
  r: number;
  startAngle: number;
  endAngle: number;
  color: string;
  strokeWidth: number;
  opacity?: number;
}> = ({ cx, cy, r, startAngle, endAngle, color, strokeWidth, opacity = 1 }) => {
  const d = arcPath(cx, cy, r, startAngle, endAngle);
  return <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" opacity={opacity} />;
};

const ExpansionGauge: React.FC = () => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const duration = 2000; // ms

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * SCORE));
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    const timer = setTimeout(() => {
      animRef.current = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  const currentZone = getZoneForScore(animatedScore);
  const cx = 160;
  const cy = 140;
  const outerR = 120;
  const trackR = 110;

  // Gauge spans from -135 to +135 degrees (0 to 100 score)
  const gaugStart = -135;
  const gaugeEnd = 135;

  const needleAngle = scoreToAngle(animatedScore);

  const signals = [
    {
      type: 'success',
      text: '4 of 6 vehicles running above 75% utilization',
      icon: <CheckCircle size={15} />,
    },
    {
      type: 'success',
      text: '14 booking requests turned away this month',
      icon: <CheckCircle size={15} />,
    },
    {
      type: 'warning',
      text: '1 underperforming vehicle — consider replacing before adding',
      icon: <AlertTriangle size={15} />,
    },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: '#00C2FF15', border: '1px solid #00C2FF30' }}
        >
          <TrendingUp size={18} style={{ color: '#00C2FF' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Expansion Signal Meter</h2>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            Composite score based on utilization, demand signals, and fleet mix
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ background: '#111827', border: '1px solid #1F2937' }}
      >
        <div className="flex flex-col xl:flex-row items-center gap-8">
          {/* Gauge */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div className="relative">
              <svg
                width="320"
                height="200"
                viewBox="0 0 320 200"
                className="overflow-visible"
              >
                {/* Background track */}
                <GaugeArc
                  cx={cx}
                  cy={cy}
                  r={trackR}
                  startAngle={gaugStart}
                  endAngle={gaugeEnd}
                  color="#1F2937"
                  strokeWidth={18}
                />

                {/* Zone arcs */}
                {/* Hold Off: 0-30 → -135 to -54 */}
                <GaugeArc cx={cx} cy={cy} r={trackR} startAngle={-135} endAngle={-54} color="#EF4444" strokeWidth={18} opacity={0.85} />
                {/* Monitor: 31-60 → -54 to +27 */}
                <GaugeArc cx={cx} cy={cy} r={trackR} startAngle={-54} endAngle={27} color="#F59E0B" strokeWidth={18} opacity={0.85} />
                {/* Consider: 61-80 → +27 to +81 */}
                <GaugeArc cx={cx} cy={cy} r={trackR} startAngle={27} endAngle={81} color="#00C2FF" strokeWidth={18} opacity={0.85} />
                {/* Expand Now: 81-100 → +81 to +135 */}
                <GaugeArc cx={cx} cy={cy} r={trackR} startAngle={81} endAngle={135} color="#10B981" strokeWidth={18} opacity={0.85} />

                {/* Outer ring glow for active zone */}
                <GaugeArc
                  cx={cx}
                  cy={cy}
                  r={outerR}
                  startAngle={gaugStart}
                  endAngle={gaugeEnd}
                  color={currentZone.color}
                  strokeWidth={2}
                  opacity={0.2}
                />

                {/* Zone labels */}
                {[
                  { angle: -108, label: 'Hold', color: '#EF4444' },
                  { angle: -27, label: 'Monitor', color: '#F59E0B' },
                  { angle: 54, label: 'Consider', color: '#00C2FF' },
                  { angle: 115, label: 'Expand', color: '#10B981' },
                ].map(({ angle, label, color }) => {
                  const pos = polarToCartesian(cx, cy, 85, angle);
                  return (
                    <text
                      key={label}
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="7.5"
                      fontWeight="700"
                      fill={color}
                      opacity={0.7}
                      style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                    >
                      {label}
                    </text>
                  );
                })}

                {/* Tick marks */}
                {[0, 25, 50, 75, 100].map((tick) => {
                  const tickAngle = scoreToAngle(tick);
                  const inner = polarToCartesian(cx, cy, 95, tickAngle);
                  const outer2 = polarToCartesian(cx, cy, 125, tickAngle);
                  const labelPos = polarToCartesian(cx, cy, 132, tickAngle);
                  return (
                    <g key={tick}>
                      <line
                        x1={inner.x}
                        y1={inner.y}
                        x2={outer2.x}
                        y2={outer2.y}
                        stroke="#374151"
                        strokeWidth="1.5"
                      />
                      <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="8"
                        fill="#4B5563"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {tick}
                      </text>
                    </g>
                  );
                })}

                {/* Needle shadow */}
                <g transform={`rotate(${needleAngle + 90}, ${cx}, ${cy})`} opacity="0.3">
                  <line
                    x1={cx}
                    y1={cy + 8}
                    x2={cx}
                    y2={cy - 95}
                    stroke="#000"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </g>

                {/* Needle */}
                <g transform={`rotate(${needleAngle + 90}, ${cx}, ${cy})`}>
                  <line
                    x1={cx}
                    y1={cy + 8}
                    x2={cx}
                    y2={cy - 92}
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <line
                    x1={cx}
                    y1={cy + 8}
                    x2={cx}
                    y2={cy - 92}
                    stroke={currentZone.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                </g>

                {/* Center hub */}
                <circle cx={cx} cy={cy} r="10" fill="#1F2937" stroke="#374151" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="5" fill={currentZone.color} />

                {/* Score display */}
                <text
                  x={cx}
                  y={cy + 35}
                  textAnchor="middle"
                  fontSize="36"
                  fontWeight="800"
                  fill="white"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {animatedScore}
                </text>
                <text
                  x={cx}
                  y={cy + 55}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill={currentZone.color}
                  style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  {currentZone.label}
                </text>
              </svg>
            </div>

            {/* Zone legend pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {zones.map((zone) => {
                const isActive = animatedScore >= zone.min && animatedScore <= zone.max;
                return (
                  <div
                    key={zone.label}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: isActive ? zone.bgColor : '#1F2937',
                      border: `1px solid ${isActive ? zone.color + '60' : '#374151'}`,
                      color: isActive ? zone.color : '#4B5563',
                      transform: isActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: zone.color, opacity: isActive ? 1 : 0.4 }}
                    />
                    {zone.min}–{zone.max}: {zone.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signal cards */}
          <div className="flex-1 w-full">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white">Why Your Score Is {SCORE}</h3>
              <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                These signals are driving your expansion readiness rating
              </p>
            </div>

            <div className="space-y-3">
              {signals.map((signal, i) => {
                const isSuccess = signal.type === 'success';
                const color = isSuccess ? '#10B981' : '#F59E0B';
                const bgColor = isSuccess ? '#10B98112' : '#F59E0B12';
                const borderColor = isSuccess ? '#10B98130' : '#F59E0B30';
                return (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl"
                    style={{ background: bgColor, border: `1px solid ${borderColor}` }}
                  >
                    <div
                      className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 mt-0.5"
                      style={{ background: `${color}20`, color }}
                    >
                      {signal.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white leading-snug">{signal.text}</p>
                    </div>
                    <div
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {isSuccess ? 'Signal' : 'Caution'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Readiness summary box */}
            <div
              className="mt-5 p-4 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #00C2FF10, #10B98110)',
                border: '1px solid #00C2FF30',
              }}
            >
              <div className="flex items-start gap-3">
                <TrendingUp size={18} style={{ color: '#00C2FF', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="text-sm font-bold text-white mb-1">Expansion Verdict</div>
                  <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                    Your fleet is running well above average. Four of six vehicles are in high-demand territory. 
                    The signal is clear: you have more demand than supply. One vehicle needs attention first, 
                    but the data supports adding to your fleet in the next 30–60 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpansionGauge;
