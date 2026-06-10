export interface Vehicle {
  id: number;
  name: string;
  year: number;
  make: string;
  model: string;
  utilization: number;
  adr: number;
  monthlyRevenue: number;
  daysBooked: number;
  daysAvailable: number;
  status: 'High Demand' | 'Performing' | 'Underutilized';
  type: string;
}

export const fleetVehicles: Vehicle[] = [
  {
    id: 1,
    name: '2022 Toyota Camry',
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    utilization: 91,
    adr: 68,
    monthlyRevenue: 1856,
    daysBooked: 27,
    daysAvailable: 30,
    status: 'High Demand',
    type: 'Midsize Sedan',
  },
  {
    id: 2,
    name: '2021 Honda CR-V',
    year: 2021,
    make: 'Honda',
    model: 'CR-V',
    utilization: 87,
    adr: 75,
    monthlyRevenue: 1961,
    daysBooked: 26,
    daysAvailable: 30,
    status: 'High Demand',
    type: 'Compact SUV',
  },
  {
    id: 3,
    name: '2023 Hyundai Sonata',
    year: 2023,
    make: 'Hyundai',
    model: 'Sonata',
    utilization: 78,
    adr: 62,
    monthlyRevenue: 1457,
    daysBooked: 23,
    daysAvailable: 30,
    status: 'Performing',
    type: 'Midsize Sedan',
  },
  {
    id: 4,
    name: '2020 Ford Explorer',
    year: 2020,
    make: 'Ford',
    model: 'Explorer',
    utilization: 83,
    adr: 95,
    monthlyRevenue: 2251,
    daysBooked: 25,
    daysAvailable: 30,
    status: 'High Demand',
    type: 'Full-Size SUV',
  },
  {
    id: 5,
    name: '2022 Kia Forte',
    year: 2022,
    make: 'Kia',
    model: 'Forte',
    utilization: 54,
    adr: 48,
    monthlyRevenue: 934,
    daysBooked: 16,
    daysAvailable: 30,
    status: 'Underutilized',
    type: 'Economy Sedan',
  },
  {
    id: 6,
    name: '2021 Nissan Altima',
    year: 2021,
    make: 'Nissan',
    model: 'Altima',
    utilization: 69,
    adr: 58,
    monthlyRevenue: 1276,
    daysBooked: 21,
    daysAvailable: 30,
    status: 'Performing',
    type: 'Midsize Sedan',
  },
];

export const fleetSummary = {
  avgUtilization: 77,
  totalMonthlyRevenue: 9735,
  missedBookings: 14,
  healthScore: 74,
};

export interface VehicleRecommendation {
  id: number;
  rank: number;
  isTopPick: boolean;
  vehicleType: string;
  exampleModel: string;
  reason: string;
  projectedADRLow: number;
  projectedADRHigh: number;
  projectedRevenueLow: number;
  projectedRevenueHigh: number;
  demandScore: number;
  defaultPrice: number;
  defaultADR: number;
  defaultUtilization: number;
}

export const vehicleRecommendations: VehicleRecommendation[] = [
  {
    id: 1,
    rank: 1,
    isTopPick: true,
    vehicleType: 'Midsize SUV',
    exampleModel: 'Toyota RAV4 or Honda CR-V',
    reason:
      'SUVs are your highest ADR vehicle class at $95/day. You only have 1 SUV in your fleet. Market demand for SUVs in your area is 34% higher than your current supply.',
    projectedADRLow: 85,
    projectedADRHigh: 95,
    projectedRevenueLow: 2100,
    projectedRevenueHigh: 2400,
    demandScore: 94,
    defaultPrice: 32000,
    defaultADR: 90,
    defaultUtilization: 80,
  },
  {
    id: 2,
    rank: 2,
    isTopPick: false,
    vehicleType: 'Economy Sedan',
    exampleModel: 'Toyota Corolla or Honda Civic',
    reason:
      'Economy vehicles have the fastest booking velocity in your market — typically booked within 4 hours of listing. Low acquisition cost means faster break-even.',
    projectedADRLow: 55,
    projectedADRHigh: 65,
    projectedRevenueLow: 1400,
    projectedRevenueHigh: 1700,
    demandScore: 78,
    defaultPrice: 22000,
    defaultADR: 60,
    defaultUtilization: 78,
  },
  {
    id: 3,
    rank: 3,
    isTopPick: false,
    vehicleType: 'Minivan / Family',
    exampleModel: 'Chrysler Pacifica',
    reason:
      'Zero minivans in your current fleet. Niche demand but zero competition from your own listings. Commands a premium and attracts a loyal repeat-renter demographic.',
    projectedADRLow: 90,
    projectedADRHigh: 110,
    projectedRevenueLow: 1600,
    projectedRevenueHigh: 1900,
    demandScore: 61,
    defaultPrice: 28000,
    defaultADR: 100,
    defaultUtilization: 65,
  },
];
