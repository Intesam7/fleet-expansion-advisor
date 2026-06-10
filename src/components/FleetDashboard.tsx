import React from 'react';
import { Car, TrendingUp, AlertTriangle, CheckCircle, Activity, BarChart2 } from 'lucide-react';
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
import { fleetVehicles, fleetSummary } from '../data/fleetData';

const getUtilizationColor = (util: number) => {
  if (util >= 75) return '#10B981';
  if (util >= 50) return '#F59E0B';
  return '#EF4444';
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'High Demand':
      return { bg: '#10B98120', border: '#10B98140', text: '#10B981' };
    case 'Performing':
      return { bg: '#00C2FF20', border: '#00C2FF40', text: '#00C2FF' };
    case 'Underutilized':
      return { bg: '#EF444420', border: '#EF444440', text: '#EF4444' };
    default:
      return { bg: '#6B728020', border: '#6B728040', text: '#6B7280' };
  }
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'High Demand') return <TrendingUp size={10} />;
  if (status === 'Performing') return <CheckCircle size={10} />;
  return <AlertTriangle size={10} />;
};

// Mobile card view
const VehicleCard: React.FC<{ vehicle: (typeof fleetVehicles)[0] }> = ({ vehicle }) => {
  const utilColor = getUtilizationColor(vehicle.utilization);
  const statusStyle = getStatusStyle(vehicle.status);

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: '#0A0F1E', border: '1px solid #1F2937' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: '#1F2937', border: '1px solid #374151' }}
          >
            <Car size={13} style={{ color: '#9CA3AF' }} />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{vehicle.name}</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>
              {vehicle.type}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.text,
          }}
        >
          <StatusIcon status={vehicle.status} />
          {vehicle.status}
        </span>
      </div>

      {/* Utilization bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs" style={{ color: '#6B7280' }}>Utilization</span>
          <span className="text-xs font-bold" style={{ color: utilColor }}>
            {vehicle.utilization}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1F2937' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${vehicle.utilization}%`,
              background: `linear-gradient(90deg, ${utilColor}cc, ${utilColor})`,
              boxShadow: `0 0 6px ${utilColor}55`,
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-sm font-bold text-white">${vehicle.adr}</div>
          <div className="text-xs" style={{ color: '#6B7280' }}>ADR</div>
        </div>
        <div>
          <div className="text-sm font-bold" style={{ color: '#10B981' }}>
            ${vehicle.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Revenue</div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">
            {vehicle.daysBooked}/{vehicle.daysAvailable}d
          </div>
          <div className="text-xs" style={{ color: '#6B7280' }}>Days</div>
        </div>
      </div>
    </div>
  );
};

// Desktop table row
const VehicleRow: React.FC<{
  vehicle: (typeof fleetVehicles)[0];
  index: number;
}> = ({ vehicle, index }) => {
  const utilColor = getUtilizationColor(vehicle.utilization);
  const statusStyle = getStatusStyle(vehicle.status);

  return (
    <div
      className="grid items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 cursor-default"
      style={{
        gridTemplateColumns: 'minmax(160px, 1fr) 180px 80px 110px 90px 130px',
        background: index % 2 === 0 ? 'transparent' : '#0A0F1E33',
        border: '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = '#00C2FF06';
        (e.currentTarget as HTMLElement).style.borderColor = '#1F2937';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          index % 2 === 0 ? 'transparent' : '#0A0F1E33';
        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
      }}
    >
      {/* Car name */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
          style={{ background: '#1F2937', border: '1px solid #374151' }}
        >
          <Car size={14} style={{ color: '#9CA3AF' }} />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{vehicle.name}</div>
          <div className="text-xs" style={{ color: '#6B7280' }}>
            {vehicle.type}
          </div>
        </div>
      </div>

      {/* Utilization bar */}
      <div className="flex items-center gap-3">
        <div
          className="flex-1 h-2 rounded-full overflow-hidden"
          style={{ background: '#1F2937' }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${vehicle.utilization}%`,
              background: `linear-gradient(90deg, ${utilColor}80, ${utilColor})`,
              boxShadow: `0 0 8px ${utilColor}55`,
              transition: 'width 1s ease',
            }}
          />
        </div>
        <span
          className="text-xs font-bold w-9 text-right flex-shrink-0"
          style={{ color: utilColor }}
        >
          {vehicle.utilization}%
        </span>
      </div>

      {/* ADR */}
      <div className="text-sm font-semibold text-white text-right">
        ${vehicle.adr}
        <span className="text-xs font-normal" style={{ color: '#6B7280' }}>
          /d
        </span>
      </div>

      {/* Monthly revenue */}
      <div className="text-sm font-bold text-right" style={{ color: '#10B981' }}>
        ${vehicle.monthlyRevenue.toLocaleString()}
        <span className="text-xs font-normal block" style={{ color: '#4B5563' }}>
          /month
        </span>
      </div>

      {/* Days booked */}
      <div className="text-sm text-right">
        <span className="text-white font-semibold">{vehicle.daysBooked}</span>
        <span style={{ color: '#6B7280' }}>/{vehicle.daysAvailable}d</span>
      </div>

      {/* Status tag */}
      <div className="flex justify-end">
        <span
          className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap"
          style={{
            background: statusStyle.bg,
            border: `1px solid ${statusStyle.border}`,
            color: statusStyle.text,
          }}
        >
          <StatusIcon status={vehicle.status} />
          {vehicle.status}
        </span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-lg text-xs"
        style={{ background: '#1F2937', border: '1px solid #374151', color: '#E5E7EB' }}
      >
        <div className="font-semibold mb-0.5">{label}</div>
        <div className="text-xs" style={{ color: '#10B981' }}>
          ${payload[0].value.toLocaleString()}/mo
        </div>
      </div>
    );
  }
  return null;
};

const FleetDashboard: React.FC = () => {
  const chartData = fleetVehicles.map((v) => ({
    name: v.model,
    revenue: v.monthlyRevenue,
    util: v.utilization,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-lg"
            style={{ background: '#00C2FF15', border: '1px solid #00C2FF30' }}
          >
            <Activity size={18} style={{ color: '#00C2FF' }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Fleet Health Dashboard</h2>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              Live performance across your 6 active vehicles · October 2024
            </p>
          </div>
        </div>
        <div
          className="hidden md:flex items-center gap-4 text-xs"
          style={{ color: '#6B7280' }}
        >
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            High (&gt;75%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
            Watch (50–75%)
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: '#EF4444' }} />
            Low (&lt;50%)
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{ border: '1px solid #1F2937', background: '#111827' }}
      >
        {/* Column headers */}
        <div
          className="grid items-center gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
          style={{
            gridTemplateColumns: 'minmax(160px, 1fr) 180px 80px 110px 90px 130px',
            color: '#4B5563',
            borderBottom: '1px solid #1F2937',
            background: '#0A0F1E',
          }}
        >
          <div>Vehicle</div>
          <div>Utilization Rate</div>
          <div className="text-right">ADR</div>
          <div className="text-right">Mo. Revenue</div>
          <div className="text-right">Days Booked</div>
          <div className="text-right">Status</div>
        </div>

        {/* Vehicle rows */}
        <div>
          {fleetVehicles.map((vehicle, index) => (
            <VehicleRow key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>

        {/* Fleet Summary row */}
        <div
          className="grid items-center gap-4 px-5 py-4"
          style={{
            gridTemplateColumns: 'minmax(160px, 1fr) 180px 80px 110px 90px 130px',
            borderTop: '2px solid #1F2937',
            background: 'linear-gradient(90deg, #00C2FF06, #10B98106)',
          }}
        >
          <div className="text-sm font-bold text-white">Fleet Average / Total</div>

          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-2 rounded-full overflow-hidden"
              style={{ background: '#1F2937' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${fleetSummary.avgUtilization}%`,
                  background: 'linear-gradient(90deg, #00C2FF80, #10B981)',
                }}
              />
            </div>
            <span className="text-xs font-bold w-9 text-right flex-shrink-0 text-white">
              {fleetSummary.avgUtilization}%
            </span>
          </div>

          <div className="text-sm font-semibold text-white text-right">
            $68<span className="text-xs font-normal" style={{ color: '#6B7280' }}>/avg</span>
          </div>

          <div className="text-sm font-bold text-right" style={{ color: '#10B981' }}>
            ${fleetSummary.totalMonthlyRevenue.toLocaleString()}
            <span className="text-xs font-normal block" style={{ color: '#4B5563' }}>
              combined
            </span>
          </div>

          <div className="text-right">
            <span
              className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg"
              style={{
                background: '#F59E0B20',
                border: '1px solid #F59E0B40',
                color: '#F59E0B',
              }}
            >
              <AlertTriangle size={10} />
              {fleetSummary.missedBookings} missed
            </span>
          </div>

          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-sm font-bold text-white">
                {fleetSummary.healthScore}
                <span className="text-xs font-normal" style={{ color: '#6B7280' }}>
                  /100
                </span>
              </div>
              <div className="text-xs" style={{ color: '#6B7280' }}>
                Health Score
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {fleetVehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}

        {/* Mobile summary */}
        <div
          className="p-4 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #00C2FF10, #10B98110)',
            border: '1px solid #00C2FF25',
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Avg Utilization</div>
              <div className="text-lg font-bold" style={{ color: '#10B981' }}>
                {fleetSummary.avgUtilization}%
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Total Revenue</div>
              <div className="text-lg font-bold text-white">
                ${fleetSummary.totalMonthlyRevenue.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Missed Bookings</div>
              <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>
                {fleetSummary.missedBookings}
              </div>
            </div>
            <div>
              <div className="text-xs" style={{ color: '#6B7280' }}>Health Score</div>
              <div className="text-lg font-bold text-white">{fleetSummary.healthScore}/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
        {[
          {
            label: 'Avg Fleet Utilization',
            value: '77%',
            sub: 'vs 68% industry avg',
            color: '#10B981',
            icon: <TrendingUp size={16} />,
          },
          {
            label: 'Total Monthly Revenue',
            value: '$9,735',
            sub: '+12% vs last month',
            color: '#00C2FF',
            icon: <Activity size={16} />,
          },
          {
            label: 'Missed Opportunities',
            value: '14 bookings',
            sub: 'Est. $840 lost revenue',
            color: '#F59E0B',
            icon: <AlertTriangle size={16} />,
          },
          {
            label: 'Fleet Health Score',
            value: '74 / 100',
            sub: '"Good" — room to grow',
            color: '#00C2FF',
            icon: <CheckCircle size={16} />,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{
              background: '#111827',
              border: '1px solid #1F2937',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: card.color }}>{card.icon}</span>
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: '#6B7280' }}
              >
                {card.label}
              </span>
            </div>
            <div className="text-xl font-bold text-white">{card.value}</div>
            <div className="text-xs mt-1" style={{ color: '#4B5563' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart by vehicle */}
      <div
        className="mt-5 p-5 rounded-2xl"
        style={{ background: '#111827', border: '1px solid #1F2937' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={15} style={{ color: '#6B7280' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
            Monthly Revenue by Vehicle
          </span>
        </div>
        <div style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="28%">
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: '#4B5563' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#4B5563' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={fleetSummary.totalMonthlyRevenue / 6}
                stroke="#374151"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {chartData.map((_entry, index) => (
                  <Cell
                    key={index}
                    fill={getUtilizationColor(fleetVehicles[index].utilization)}
                    opacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs" style={{ color: '#4B5563' }}>
            --- fleet avg ($1,622/vehicle)
          </span>
        </div>
      </div>
    </div>
  );
};

export default FleetDashboard;
