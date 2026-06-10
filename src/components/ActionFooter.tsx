import React, { useState } from 'react';
import { Download, Save, Share2, CheckCircle } from 'lucide-react';

type ToastType = 'export' | 'save' | 'share' | null;

const ActionFooter: React.FC = () => {
  const [activeToast, setActiveToast] = useState<ToastType>(null);

  const showToast = (type: ToastType) => {
    setActiveToast(type);
    setTimeout(() => setActiveToast(null), 3000);
  };

  const toastMessages: Record<string, { text: string; icon: React.ReactNode }> = {
    export: { text: 'Report exported as PDF', icon: <Download size={15} /> },
    save: { text: 'Scenario saved', icon: <Save size={15} /> },
    share: { text: 'Link copied to clipboard', icon: <Share2 size={15} /> },
  };

  const actions = [
    {
      id: 'export' as const,
      label: 'Export This Report',
      icon: <Download size={17} />,
      style: {
        background: '#1F2937',
        color: '#E5E7EB',
        border: '1px solid #374151',
      },
      hoverStyle: { background: '#374151' },
    },
    {
      id: 'save' as const,
      label: 'Save Scenario',
      icon: <Save size={17} />,
      style: {
        background: '#00C2FF15',
        color: '#00C2FF',
        border: '1px solid #00C2FF40',
      },
      hoverStyle: { background: '#00C2FF25' },
    },
    {
      id: 'share' as const,
      label: 'Share with Partner',
      icon: <Share2 size={17} />,
      style: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 16px #10B98130',
      },
      hoverStyle: {},
    },
  ];

  return (
    <section>
      {/* Toast notification */}
      <div
        className="fixed bottom-6 right-6 z-50 transition-all duration-300"
        style={{
          transform: activeToast ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          opacity: activeToast ? 1 : 0,
          pointerEvents: activeToast ? 'auto' : 'none',
        }}
      >
        {activeToast && (
          <div
            className="flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl"
            style={{
              background: '#1F2937',
              border: '1px solid #374151',
              color: '#E5E7EB',
              boxShadow: '0 8px 32px #00000060',
            }}
          >
            <div
              className="flex items-center justify-center w-7 h-7 rounded-full"
              style={{ background: '#10B98120', color: '#10B981' }}
            >
              <CheckCircle size={14} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {toastMessages[activeToast].text}
              </div>
              <div className="text-xs" style={{ color: '#6B7280' }}>
                Fleet Expansion Advisor · 1Now Labs
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA section */}
      <div
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #111827, #0D1530)',
          border: '1px solid #1F2937',
        }}
      >
        <h3 className="text-xl font-bold text-white mb-2">Ready to Make a Move?</h3>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#6B7280' }}>
          Save your analysis, export a PDF for your lender, or share with a business partner.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => showToast(action.id)}
              className="flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
              style={action.style}
              onMouseEnter={(e) => {
                Object.assign((e.currentTarget as HTMLButtonElement).style, action.hoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign((e.currentTarget as HTMLButtonElement).style, action.style);
              }}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-10 mb-6">
          <div className="flex-1 h-px" style={{ background: '#1F2937' }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#374151' }} />
          <div className="flex-1 h-px" style={{ background: '#1F2937' }} />
        </div>

        {/* Footer note */}
        <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
          Fleet Expansion Advisor is a{' '}
          <span style={{ color: '#4B5563' }}>1Now Labs</span>{' '}
          concept. Built to help operators make confident growth decisions.
          <br />
          <span style={{ color: '#374151' }}>
            Data shown is illustrative. Always validate with your own financial advisor before making acquisition decisions.
          </span>
        </p>
      </div>
    </section>
  );
};

export default ActionFooter;
