import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { DollarSign, AlertTriangle, TrendingUp, Calculator } from 'lucide-react';
import { VehicleRecommendation } from '../data/fleetData';

interface ROIInputs {
  purchasePrice: number;
  downPayment: number;
  loanTerm: number;
  interestRate: number;
  expectedADR: number;
  expectedUtilization: number;
  monthlyInsurance: number;
  monthlyMaintenance: number;
}

interface ROIOutputs {
  monthlyLoanPayment: number;
  monthlyGrossRevenue: number;
  totalMonthlyCosts: number;
  netMonthlyContribution: number;
  breakEvenMonths: number;
  annualNetProfit: number;
  monthlyData: { month: string; cumulative: number }[];
}

const calcLoanPayment = (principal: number, annualRate: number, months: number): number => {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
};

const calcOutputs = (inputs: ROIInputs): ROIOutputs => {
  const principal = inputs.purchasePrice - inputs.downPayment;
  const monthlyLoanPayment = calcLoanPayment(principal, inputs.interestRate, inputs.loanTerm);
  const monthlyGrossRevenue = inputs.expectedADR * 30 * (inputs.expectedUtilization / 100);
  const totalMonthlyCosts = monthlyLoanPayment + inputs.monthlyInsurance + inputs.monthlyMaintenance;
  const netMonthlyContribution = monthlyGrossRevenue - totalMonthlyCosts;
  const breakEvenMonths = netMonthlyContribution > 0 ? Math.ceil(inputs.downPayment / netMonthlyContribution) : 999;
  const annualNetProfit = netMonthlyContribution * 12;

  // 12-month cumulative chart
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const cumulative = -inputs.downPayment + netMonthlyContribution * monthNum;
    return {
      month: `M${monthNum}`,
      cumulative: Math.round(cumulative),
    };
  });

  return {
    monthlyLoanPayment: Math.round(monthlyLoanPayment),
    monthlyGrossRevenue: Math.round(monthlyGrossRevenue),
    totalMonthlyCosts: Math.round(totalMonthlyCosts),
    netMonthlyContribution: Math.round(netMonthlyContribution),
    breakEvenMonths,
    annualNetProfit: Math.round(annualNetProfit),
    monthlyData,
  };
};

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  format?: (val: number) => string;
  color?: string;
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(v),
  color = '#00C2FF',
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
          {label}
        </label>
        <span className="text-sm font-bold text-white">{format(value)}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 rounded-full" style={{ background: '#1F2937' }} />
        <div
          className="absolute h-1.5 rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-1.5 opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-2 pointer-events-none"
          style={{
            left: `calc(${pct}% - 8px)`,
            background: '#0A0F1E',
            borderColor: color,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs" style={{ color: '#4B5563' }}>
          {format(min)}
        </span>
        <span className="text-xs" style={{ color: '#4B5563' }}>
          {format(max)}
        </span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const isPositive = val >= 0;
    return (
      <div
        className="px-3 py-2 rounded-lg text-sm"
        style={{
          background: '#1F2937',
          border: '1px solid #374151',
          color: isPositive ? '#10B981' : '#EF4444',
        }}
      >
        <div className="font-semibold">{label}</div>
        <div className="font-bold">{val >= 0 ? '+' : ''}${val.toLocaleString()}</div>
      </div>
    );
  }
  return null;
};

interface ROICalculatorProps {
  selectedRecommendation: VehicleRecommendation | null;
  onInputsChange?: (inputs: ROIInputs, outputs: ROIOutputs) => void;
}

const ROICalculator = forwardRef<HTMLElement, ROICalculatorProps>(
  ({ selectedRecommendation, onInputsChange }, ref) => {
    const [inputs, setInputs] = useState<ROIInputs>({
      purchasePrice: 28000,
      downPayment: 3000,
      loanTerm: 48,
      interestRate: 8.9,
      expectedADR: 85,
      expectedUtilization: 75,
      monthlyInsurance: 180,
      monthlyMaintenance: 120,
    });

    // Apply recommendation defaults when selected
    useEffect(() => {
      if (selectedRecommendation) {
        setInputs((prev) => ({
          ...prev,
          purchasePrice: selectedRecommendation.defaultPrice,
          expectedADR: selectedRecommendation.defaultADR,
          expectedUtilization: selectedRecommendation.defaultUtilization,
        }));
      }
    }, [selectedRecommendation]);

    const [outputs, setOutputs] = useState<ROIOutputs>(() => calcOutputs({
      purchasePrice: 28000,
      downPayment: 3000,
      loanTerm: 48,
      interestRate: 8.9,
      expectedADR: 85,
      expectedUtilization: 75,
      monthlyInsurance: 180,
      monthlyMaintenance: 120,
    }));

    const updateInput = useCallback((key: keyof ROIInputs, value: number) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
      const newOutputs = calcOutputs(inputs);
      setOutputs(newOutputs);
      onInputsChange?.(inputs, newOutputs);
    }, [inputs, onInputsChange]);

    const isPositive = outputs.netMonthlyContribution >= 0;
    const netColor = isPositive ? '#10B981' : '#EF4444';

    return (
      <section ref={ref as React.Ref<HTMLElement>}>
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: '#10B98115', border: '1px solid #10B98130' }}
          >
            <Calculator size={18} style={{ color: '#10B981' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Can You Afford It? Let's Do The Math.</h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              Adjust the inputs below — all outputs update in real time
              {selectedRecommendation && (
                <span style={{ color: '#00C2FF' }}>
                  {' '}· Loaded: {selectedRecommendation.vehicleType}
                </span>
              )}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #1F2937', background: '#111827' }}
        >
          <div className="grid lg:grid-cols-2">
            {/* LEFT: Inputs */}
            <div className="p-6 lg:p-8" style={{ borderRight: '1px solid #1F2937' }}>
              <div className="flex items-center gap-2 mb-6">
                <DollarSign size={16} style={{ color: '#00C2FF' }} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Deal Parameters
                </h3>
              </div>

              <Slider
                label="Vehicle Purchase Price"
                value={inputs.purchasePrice}
                min={15000}
                max={45000}
                step={500}
                onChange={(v) => updateInput('purchasePrice', v)}
                format={(v) => `$${v.toLocaleString()}`}
                color="#00C2FF"
              />
              <Slider
                label="Down Payment"
                value={inputs.downPayment}
                min={0}
                max={10000}
                step={250}
                onChange={(v) => updateInput('downPayment', v)}
                format={(v) => `$${v.toLocaleString()}`}
                color="#00C2FF"
              />

              <div className="mb-5">
                <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#9CA3AF' }}>
                  Loan Term
                </label>
                <div className="flex gap-2">
                  {[36, 48, 60].map((term) => (
                    <button
                      key={term}
                      onClick={() => updateInput('loanTerm', term)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-150"
                      style={{
                        background: inputs.loanTerm === term ? '#00C2FF' : '#1F2937',
                        color: inputs.loanTerm === term ? '#000' : '#9CA3AF',
                        border: `1px solid ${inputs.loanTerm === term ? '#00C2FF' : '#374151'}`,
                      }}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              <Slider
                label="Interest Rate (APR)"
                value={inputs.interestRate}
                min={4}
                max={18}
                step={0.1}
                onChange={(v) => updateInput('interestRate', v)}
                format={(v) => `${v.toFixed(1)}%`}
                color="#F59E0B"
              />

              <div
                className="my-5 h-px"
                style={{ background: '#1F2937' }}
              />
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={15} style={{ color: '#10B981' }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Revenue Assumptions
                </h4>
              </div>

              <Slider
                label="Expected Daily Rate (ADR)"
                value={inputs.expectedADR}
                min={45}
                max={150}
                step={1}
                onChange={(v) => updateInput('expectedADR', v)}
                format={(v) => `$${v}/day`}
                color="#10B981"
              />
              <Slider
                label="Expected Utilization"
                value={inputs.expectedUtilization}
                min={50}
                max={95}
                step={1}
                onChange={(v) => updateInput('expectedUtilization', v)}
                format={(v) => `${v}%`}
                color="#10B981"
              />

              <div
                className="my-5 h-px"
                style={{ background: '#1F2937' }}
              />
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} style={{ color: '#EF4444' }} />
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Monthly Costs
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#9CA3AF' }}>
                    Insurance / mo
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                      style={{ color: '#6B7280' }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      value={inputs.monthlyInsurance}
                      onChange={(e) => updateInput('monthlyInsurance', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 transition-all"
                      style={{
                        background: '#0A0F1E',
                        border: '1px solid #374151',
                        color: 'white',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C2FF')}
                      onBlur={(e) => (e.target.style.borderColor = '#374151')}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider mb-2 block" style={{ color: '#9CA3AF' }}>
                    Maintenance Reserve
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold"
                      style={{ color: '#6B7280' }}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      value={inputs.monthlyMaintenance}
                      onChange={(e) => updateInput('monthlyMaintenance', Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl text-sm font-bold text-white outline-none focus:ring-2 transition-all"
                      style={{
                        background: '#0A0F1E',
                        border: '1px solid #374151',
                        color: 'white',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#00C2FF')}
                      onBlur={(e) => (e.target.style.borderColor = '#374151')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Outputs */}
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={16} style={{ color: '#10B981' }} />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live ROI Projection
                </h3>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  {
                    label: 'Monthly Loan Payment',
                    value: `$${outputs.monthlyLoanPayment.toLocaleString()}`,
                    color: '#EF4444',
                    sub: `${inputs.loanTerm}-mo @ ${inputs.interestRate}% APR`,
                  },
                  {
                    label: 'Projected Gross Revenue',
                    value: `$${outputs.monthlyGrossRevenue.toLocaleString()}`,
                    color: '#10B981',
                    sub: `${inputs.expectedADR}/day × ${inputs.expectedUtilization}% util`,
                  },
                  {
                    label: 'Total Monthly Costs',
                    value: `$${outputs.totalMonthlyCosts.toLocaleString()}`,
                    color: '#F59E0B',
                    sub: 'Loan + insurance + maint.',
                  },
                  {
                    label: 'Break-Even Timeline',
                    value: outputs.breakEvenMonths < 900 ? `${outputs.breakEvenMonths} months` : 'N/A',
                    color: isPositive ? '#00C2FF' : '#EF4444',
                    sub: isPositive ? 'From down payment recovery' : 'Negative cash flow',
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="p-3 rounded-xl"
                    style={{ background: '#0A0F1E', border: '1px solid #1F2937' }}
                  >
                    <div className="text-xs font-medium mb-1" style={{ color: '#6B7280' }}>
                      {metric.label}
                    </div>
                    <div className="text-base font-bold" style={{ color: metric.color }}>
                      {metric.value}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#4B5563' }}>
                      {metric.sub}
                    </div>
                  </div>
                ))}
              </div>

              {/* NET MONTHLY — Hero number */}
              <div
                className="p-5 rounded-2xl mb-5 text-center"
                style={{
                  background: isPositive
                    ? 'linear-gradient(135deg, #10B98115, #10B98108)'
                    : 'linear-gradient(135deg, #EF444415, #EF444408)',
                  border: `2px solid ${netColor}40`,
                  boxShadow: `0 0 24px ${netColor}15`,
                }}
              >
                <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>
                  Net Monthly Contribution
                </div>
                <div
                  className="text-4xl font-black mb-1"
                  style={{ color: netColor, letterSpacing: '-0.02em' }}
                >
                  {outputs.netMonthlyContribution >= 0 ? '+' : ''}${Math.abs(outputs.netMonthlyContribution).toLocaleString()}
                </div>
                <div className="text-sm font-medium" style={{ color: '#6B7280' }}>
                  {isPositive ? `Annual net: ` : 'Annual loss: '}
                  <span style={{ color: netColor, fontWeight: 700 }}>
                    {outputs.annualNetProfit >= 0 ? '+' : ''}${Math.abs(outputs.annualNetProfit).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Summary statement */}
              <div
                className="p-4 rounded-xl mb-5 text-sm leading-relaxed"
                style={{
                  background: isPositive ? '#10B98110' : '#EF444410',
                  border: `1px solid ${netColor}25`,
                  color: '#94A3B8',
                }}
              >
                {isPositive ? (
                  <>
                    At these numbers, this vehicle pays for itself in{' '}
                    <span style={{ color: '#10B981', fontWeight: 700 }}>
                      {outputs.breakEvenMonths} months
                    </span>{' '}
                    and generates{' '}
                    <span style={{ color: '#10B981', fontWeight: 700 }}>
                      ${outputs.annualNetProfit.toLocaleString()}
                    </span>{' '}
                    in year-one net profit.
                  </>
                ) : (
                  <span className="flex items-start gap-2">
                    <AlertTriangle size={15} style={{ color: '#EF4444', flexShrink: 0, marginTop: 1 }} />
                    At current settings, this vehicle loses{' '}
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>
                      ${Math.abs(outputs.netMonthlyContribution).toLocaleString()}/month
                    </span>
                    . Increase your ADR or utilization target to reach profitability.
                  </span>
                )}
              </div>

              {/* 12-month chart */}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6B7280' }}>
                  12-Month Cumulative Cash Flow
                </div>
                <div style={{ height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={outputs.monthlyData} barCategoryGap="20%">
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10, fill: '#4B5563' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#4B5563' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={0} stroke="#374151" strokeWidth={1} />
                      <Bar dataKey="cumulative" radius={[3, 3, 0, 0]}>
                        {outputs.monthlyData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.cumulative >= 0 ? '#10B981' : '#EF4444'}
                            opacity={0.85}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

ROICalculator.displayName = 'ROICalculator';

export default ROICalculator;
export type { ROIInputs, ROIOutputs };
