import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import FleetDashboard from './components/FleetDashboard';
import ExpansionGauge from './components/ExpansionGauge';
import VehicleRecommendations from './components/VehicleRecommendations';
import ROICalculator from './components/ROICalculator';
import AIRecommendation from './components/AIRecommendation';
import ActionFooter from './components/ActionFooter';
import SectionNav from './components/SectionNav';
import { VehicleRecommendation } from './data/fleetData';
import { ROIInputs, ROIOutputs } from './components/ROICalculator';

const DEFAULT_ROI_INPUTS: ROIInputs = {
  purchasePrice: 28000,
  downPayment: 3000,
  loanTerm: 48,
  interestRate: 8.9,
  expectedADR: 85,
  expectedUtilization: 75,
  monthlyInsurance: 180,
  monthlyMaintenance: 120,
};

const calcInitialOutputs = (): ROIOutputs => {
  const principal = DEFAULT_ROI_INPUTS.purchasePrice - DEFAULT_ROI_INPUTS.downPayment;
  const r = DEFAULT_ROI_INPUTS.interestRate / 100 / 12;
  const n = DEFAULT_ROI_INPUTS.loanTerm;
  const monthlyLoanPayment = Math.round(
    (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  );
  const monthlyGrossRevenue = Math.round(
    DEFAULT_ROI_INPUTS.expectedADR * 30 * (DEFAULT_ROI_INPUTS.expectedUtilization / 100)
  );
  const totalMonthlyCosts =
    monthlyLoanPayment +
    DEFAULT_ROI_INPUTS.monthlyInsurance +
    DEFAULT_ROI_INPUTS.monthlyMaintenance;
  const netMonthlyContribution = monthlyGrossRevenue - totalMonthlyCosts;
  const breakEvenMonths =
    netMonthlyContribution > 0
      ? Math.ceil(DEFAULT_ROI_INPUTS.downPayment / netMonthlyContribution)
      : 999;
  const annualNetProfit = netMonthlyContribution * 12;
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: `M${i + 1}`,
    cumulative: Math.round(
      -DEFAULT_ROI_INPUTS.downPayment + netMonthlyContribution * (i + 1)
    ),
  }));
  return {
    monthlyLoanPayment,
    monthlyGrossRevenue,
    totalMonthlyCosts,
    netMonthlyContribution,
    breakEvenMonths,
    annualNetProfit,
    monthlyData,
  };
};

function App() {
  const [selectedRec, setSelectedRec] = useState<VehicleRecommendation | null>(null);
  const [roiInputs, setRoiInputs] = useState<ROIInputs>(DEFAULT_ROI_INPUTS);
  const [roiOutputs, setRoiOutputs] = useState<ROIOutputs>(calcInitialOutputs);

  const roiRef = useRef<HTMLElement | null>(null);

  const handleSelectRecommendation = useCallback((rec: VehicleRecommendation) => {
    setSelectedRec(rec);
  }, []);

  const handleROIChange = useCallback((inputs: ROIInputs, outputs: ROIOutputs) => {
    setRoiInputs(inputs);
    setRoiOutputs(outputs);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        background: '#0A0F1E',
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#E5E7EB',
      }}
    >
      {/* Floating section nav */}
      <SectionNav />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14">
        {/* Section 1: Fleet Health Dashboard */}
        <section id="fleet-dashboard">
          <FleetDashboard />
        </section>

        <SectionDivider />

        {/* Section 2: Expansion Signal Meter */}
        <section id="expansion-signal">
          <ExpansionGauge />
        </section>

        <SectionDivider />

        {/* Section 3: Vehicle Recommendations */}
        <section id="recommendations">
          <VehicleRecommendations
            onSelectRecommendation={handleSelectRecommendation}
            roiRef={roiRef}
          />
        </section>

        <SectionDivider />

        {/* Section 4: ROI Calculator */}
        <div id="roi-calculator">
          <ROICalculator
            ref={roiRef}
            selectedRecommendation={selectedRec}
            onInputsChange={handleROIChange}
          />
        </div>

        <SectionDivider />

        {/* Section 5: AI Brief */}
        <section id="ai-brief">
          <AIRecommendation
            roiInputs={roiInputs}
            roiOutputs={roiOutputs}
            selectedRecommendation={selectedRec}
          />
        </section>

        <SectionDivider />

        {/* Section 6: Action Footer */}
        <section id="action-footer">
          <ActionFooter />
        </section>
      </main>

      {/* Scroll-to-top */}
      <ScrollTopButton />
    </div>
  );
}

const SectionDivider: React.FC = () => (
  <div className="flex items-center gap-4">
    <div
      className="flex-1 h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent, #1F2937 50%, transparent)',
      }}
    />
    <div className="flex gap-1">
      <div className="w-1 h-1 rounded-full" style={{ background: '#374151' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: '#1F2937' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: '#374151' }} />
    </div>
    <div
      className="flex-1 h-px"
      style={{
        background:
          'linear-gradient(90deg, transparent, #1F2937 50%, transparent)',
      }}
    />
  </div>
);

const ScrollTopButton: React.FC = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-40 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
      style={{
        background: '#1F2937',
        border: '1px solid #374151',
        color: '#9CA3AF',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 4px 16px #00000040',
      }}
      aria-label="Scroll to top"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 11V3M7 3L3 7M7 3l4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default App;
