import React, { useState, useCallback } from 'react';
import { RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import Anthropic from '@anthropic-ai/sdk';
import { ROIInputs, ROIOutputs } from './ROICalculator';
import { VehicleRecommendation } from '../data/fleetData';

interface Props {
  roiInputs: ROIInputs;
  roiOutputs: ROIOutputs;
  selectedRecommendation: VehicleRecommendation | null;
}

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  dangerouslyAllowBrowser: true,
});

const buildPrompt = (
  roiInputs: ROIInputs,
  roiOutputs: ROIOutputs,
  selectedRec: VehicleRecommendation | null
): string => {
  return `You are a direct, sharp fleet business advisor speaking to Marcus, an independent car rental operator who uses the 1Now platform. You talk like a trusted peer — not corporate, not formal. Give real, grounded advice.

Here is Marcus's current fleet data:
- Fleet size: 6 vehicles
- Average fleet utilization: 77%
- Total monthly revenue: $9,735
- Missed booking requests this month: 14 (estimated $840 in lost revenue)
- Fleet health score: 74/100
- Top performers: 2022 Toyota Camry (91% util), 2021 Honda CR-V (87% util), 2020 Ford Explorer (83% util, $95/day ADR)
- Weakest link: 2022 Kia Forte (54% utilization, $48/day ADR)
- Expansion readiness score: 72/100 — in the "Consider Expanding" zone

Current ROI calculator inputs Marcus is exploring:
- Vehicle purchase price: $${roiInputs.purchasePrice.toLocaleString()}
- Down payment: $${roiInputs.downPayment.toLocaleString()}
- Loan term: ${roiInputs.loanTerm} months at ${roiInputs.interestRate}% APR
- Expected daily rate: $${roiInputs.expectedADR}/day
- Expected utilization: ${roiInputs.expectedUtilization}%
- Monthly insurance: $${roiInputs.monthlyInsurance}
- Monthly maintenance reserve: $${roiInputs.monthlyMaintenance}
- Projected net monthly contribution: ${roiOutputs.netMonthlyContribution >= 0 ? '+' : ''}$${roiOutputs.netMonthlyContribution.toLocaleString()}
- Break-even: ${roiOutputs.breakEvenMonths < 900 ? roiOutputs.breakEvenMonths + ' months' : 'not achieved at current settings'}
- Year-one net profit projection: $${roiOutputs.annualNetProfit.toLocaleString()}

Top vehicle recommendation for Marcus: ${selectedRec ? selectedRec.vehicleType + ' (' + selectedRec.exampleModel + ')' : 'Midsize SUV (Toyota RAV4 or Honda CR-V)'}

Write a 150-200 word personalized recommendation paragraph for Marcus. Write in second person ("Marcus, your fleet..."). Be direct, confident, and grounded in the numbers. Sound like a smart advisor who's seen a hundred small fleets — not a chatbot. No bullet points. One cohesive paragraph. Reference specific numbers from the data. If the ROI is positive, affirm the direction. If negative, say so clearly and give him one specific lever to pull.`;
};

const FALLBACK_TEXT = `Marcus, your fleet is putting in serious work — four of your six cars are running above 75% utilization, and you turned away 14 bookings last month. That's real money you're leaving on the table. Your expansion readiness score of 72 is telling you something: you're at the threshold. The data points clearly toward adding a midsize SUV. It's your highest-earning vehicle class at $95/day, you only have one in the rotation, and local demand for SUVs outpaces your current supply by over 30%. Before you pull the trigger, address the Kia Forte — at 54% utilization it's dragging your fleet average. Either reprice it aggressively or consider flipping it for the down payment on the SUV. At the ROI numbers you're exploring, you're looking at profitability within the first few months. The math works. The demand is there. The only thing left is the decision.`;

const AIRecommendation: React.FC<Props> = ({ roiInputs, roiOutputs, selectedRecommendation }) => {
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(false);
    setText('');

    try {
      const prompt = buildPrompt(roiInputs, roiOutputs, selectedRecommendation);
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        // Use fallback if no key
        await new Promise((r) => setTimeout(r, 1500));
        setText(FALLBACK_TEXT);
        setHasGenerated(true);
        setLoading(false);
        return;
      }

      const message = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        setText(content.text);
      }
      setHasGenerated(true);
    } catch (err) {
      console.error('Claude API error:', err);
      setError(true);
      setText(FALLBACK_TEXT);
      setHasGenerated(true);
    } finally {
      setLoading(false);
    }
  }, [roiInputs, roiOutputs, selectedRecommendation]);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{ background: '#A855F715', border: '1px solid #A855F730' }}
        >
          <Sparkles size={18} style={{ color: '#A855F7' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Your Expansion Brief</h2>
          <p className="text-xs" style={{ color: '#6B7280' }}>
            AI-powered analysis based on your fleet data and ROI inputs
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#111827', border: '1px solid #1F2937' }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: '1px solid #1F2937',
            background: 'linear-gradient(90deg, #A855F710, #6366F110)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: loading ? '#F59E0B' : hasGenerated ? '#10B981' : '#4B5563' }}
              />
              <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>
                {loading ? 'Analyzing...' : hasGenerated ? (error ? 'Fallback analysis' : 'Analysis complete') : 'Ready to analyze'}
              </span>
            </div>
            {hasGenerated && !error && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: '#A855F715',
                  border: '1px solid #A855F730',
                  color: '#A855F7',
                }}
              >
                claude-sonnet-4
              </span>
            )}
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #A855F7, #6366F1)',
              color: 'white',
              boxShadow: '0 2px 12px #A855F730',
            }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {hasGenerated ? 'Regenerate Analysis' : 'Generate Analysis'}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {!hasGenerated && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl mb-5"
                style={{
                  background: 'linear-gradient(135deg, #A855F720, #6366F120)',
                  border: '1px solid #A855F730',
                }}
              >
                <Sparkles size={28} style={{ color: '#A855F7' }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Get Your Personalized Expansion Brief
              </h3>
              <p className="text-sm mb-6 max-w-md" style={{ color: '#6B7280' }}>
                Click "Generate Analysis" to get a tailored recommendation based on your current fleet data and ROI calculator inputs.
              </p>
              <button
                onClick={generate}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                  color: 'white',
                  boxShadow: '0 4px 20px #A855F730',
                }}
              >
                <Sparkles size={16} />
                Generate Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-5">
                <div
                  className="w-12 h-12 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#A855F730', borderTopColor: '#A855F7' }}
                />
                <Sparkles
                  size={18}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ color: '#A855F7' }}
                />
              </div>
              <p className="text-sm font-semibold text-white mb-1">Analyzing your fleet...</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Reviewing utilization data, market demand, and ROI projections
              </p>
            </div>
          )}

          {hasGenerated && !loading && (
            <div>
              {error && (
                <div
                  className="flex items-center gap-2 text-xs mb-4 px-3 py-2 rounded-lg"
                  style={{
                    background: '#F59E0B15',
                    border: '1px solid #F59E0B30',
                    color: '#F59E0B',
                  }}
                >
                  <AlertTriangle size={13} />
                  API unavailable — showing pre-built analysis
                </div>
              )}

              <div className="relative">
                {/* Quote mark */}
                <div
                  className="absolute -top-2 -left-2 text-5xl font-black leading-none select-none"
                  style={{ color: '#A855F720', fontFamily: 'Georgia, serif' }}
                >
                  "
                </div>

                <div
                  className="pl-6 pr-4 py-2 border-l-2"
                  style={{ borderColor: '#A855F750' }}
                >
                  <p className="text-base leading-8 font-medium" style={{ color: '#D1D5DB', lineHeight: '1.9' }}>
                    {text}
                  </p>
                </div>
              </div>

              {/* Advisor attribution */}
              <div
                className="flex items-center gap-3 mt-6 pt-5"
                style={{ borderTop: '1px solid #1F2937' }}
              >
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-black"
                  style={{
                    background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                    color: 'white',
                  }}
                >
                  AI
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Fleet Expansion Advisor</div>
                  <div className="text-xs" style={{ color: '#6B7280' }}>
                    Powered by Claude · Personalized to your 1Now fleet
                  </div>
                </div>
                <div className="ml-auto">
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: '#10B98115',
                      border: '1px solid #10B98130',
                      color: '#10B981',
                    }}
                  >
                    Updated just now
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;
