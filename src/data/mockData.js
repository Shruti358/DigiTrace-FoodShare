// Centralized Frontend Mock Data System for DigiTrace

export const mockDashboardMetrics = {
  station: "Station #4 Line Alpha",
  scaleId: "SCALE-STN-04",
  operator: "Shruti Sharma",
  operatorTitle: "Kitchen Operations Lead",
  dailyDiversionAvg: "342.5 kg",
  rescueMatchRate: "88%",
  complianceStandard: "ISO 14001 / HACCP",
  diversionScorePct: 94.2,
  co2eMitigatedKg: 528.6,
  kmVehicleEquivalent: 1240,
  
  // High-level summary totals (in kg)
  totals: {
    prepared: 2150.0,
    consumed: 1680.0,
    surplus: 340.0,
    waste: 130.0,
    consumedPct: 78.1,
    surplusPct: 15.8,
    wastePct: 6.1
  },

  // 7-day trend data
  weeklyTrend: [
    { day: "Mon", waste: 24.2, surplus: 45.0, target: 20.0 },
    { day: "Tue", waste: 19.5, surplus: 52.0, target: 20.0 },
    { day: "Wed", waste: 16.8, surplus: 38.0, target: 20.0 },
    { day: "Thu", waste: 18.2, surplus: 64.0, target: 20.0 },
    { day: "Fri", waste: 14.5, surplus: 48.0, target: 20.0 },
    { day: "Sat", waste: 11.2, surplus: 55.0, target: 20.0 },
    { day: "Sun", waste: 10.1, surplus: 38.0, target: 20.0, isToday: true }
  ],

  // Category breakdown
  categoryBreakdown: [
    { category: "Bakery & Grains", weight: 48.4, pct: 78, barColor: "bg-primary" },
    { category: "Produce & Salad Prep", weight: 38.1, pct: 65, barColor: "bg-primary-container" },
    { category: "Cooked Proteins", weight: 32.8, pct: 50, barColor: "bg-tertiary" },
    { category: "Dairy & Sauces", weight: 14.2, pct: 25, barColor: "bg-secondary" },
    { category: "Unserved Buffet", weight: 8.0, pct: 14, barColor: "bg-secondary-fixed-dim" }
  ]
};

// 1. Food Records List (Prepared = Consumed + Surplus + Waste)
export const mockFoodRecords = [
  {
    recordId: "DT-F-0001",
    date: "2026-10-02",
    time: "11:30 AM",
    station: "Station #4 Line Alpha",
    mealType: "Lunch",
    foodCategory: "Bakery",
    itemName: "Baguettes & Brioche Breads",
    foodPrepared: 42.5,
    foodConsumed: 31.0,
    surplus: 9.0,
    waste: 2.5,
    status: "Requested",
    statusBg: "bg-secondary-container text-on-secondary-container"
  },
  {
    recordId: "DT-F-0002",
    date: "2026-10-02",
    time: "09:45 AM",
    station: "Station #4 Line Beta",
    mealType: "Lunch",
    foodCategory: "Proteins",
    itemName: "Herb-Roasted Lemon Chicken & Root Veggies",
    foodPrepared: 68.0,
    foodConsumed: 48.1,
    surplus: 18.5,
    waste: 1.4,
    status: "Available",
    statusBg: "bg-emerald-100 text-emerald-800"
  },
  {
    recordId: "DT-F-0003",
    date: "2026-10-01",
    time: "08:15 PM",
    station: "Salad Prep Central",
    mealType: "Dinner",
    foodCategory: "Salad",
    itemName: "Vegetable Scrap & Salad Prep",
    foodPrepared: 54.0,
    foodConsumed: 41.5,
    surplus: 5.0,
    waste: 7.5,
    status: "Composted",
    statusBg: "bg-primary-fixed text-on-primary-fixed"
  },
  {
    recordId: "DT-F-0004",
    date: "2026-10-01",
    time: "02:20 PM",
    station: "Main Prep Kitchen",
    mealType: "Lunch",
    foodCategory: "Grains",
    itemName: "Brown Rice & Quinoa Grain Bowls",
    foodPrepared: 38.0,
    foodConsumed: 34.0,
    surplus: 3.0,
    waste: 1.0,
    status: "Completed",
    statusBg: "bg-tertiary-fixed text-on-tertiary-fixed"
  },
  {
    recordId: "DT-F-0005",
    date: "2026-10-01",
    time: "07:30 AM",
    station: "Dairy Line 1",
    mealType: "Breakfast",
    foodCategory: "Dairy",
    itemName: "Greek Yogurt & Cold Sauces",
    foodPrepared: 22.0,
    foodConsumed: 19.5,
    surplus: 1.5,
    waste: 1.0,
    status: "Expired",
    statusBg: "bg-gray-200 text-gray-700"
  },
  {
    recordId: "DT-F-0006",
    date: "2026-09-30",
    time: "06:10 PM",
    station: "Banquet Hall B",
    mealType: "Event",
    foodCategory: "Proteins",
    itemName: "Grilled Salmon & Asparagus Speared",
    foodPrepared: 95.0,
    foodConsumed: 78.0,
    surplus: 14.0,
    waste: 3.0,
    status: "Distributed",
    statusBg: "bg-secondary-container text-on-secondary-container"
  },
  {
    recordId: "DT-F-0007",
    date: "2026-09-30",
    time: "12:00 PM",
    station: "Station #4 Line Alpha",
    mealType: "Lunch",
    foodCategory: "Fruits",
    itemName: "Fresh Seasonal Fruit Medley",
    foodPrepared: 40.0,
    foodConsumed: 35.0,
    surplus: 4.0,
    waste: 1.0,
    status: "Completed",
    statusBg: "bg-tertiary-fixed text-on-tertiary-fixed"
  }
];

// 2. Surplus Marketplace Listings
export const mockSurplusListings = [
  {
    id: "SRP-2026-001",
    recordId: "DT-F-0002",
    title: "Herb-Roasted Lemon Chicken & Root Veggies",
    provider: "Grand Hotel & Conference Banquets",
    facilityId: "NODE-04",
    category: "Proteins",
    quantityKg: 18.5,
    availableKg: 18.5,
    servings: 45,
    expiryWindow: "01h 45m",
    prepTime: "Today at 09:45 AM",
    temp: "38°F (Chilled)",
    status: "Available",
    dietary: ["Dairy-Free", "Gluten-Free", "Halal-Compliant"],
    pickupAddress: "Loading Dock #2, North Bay",
    safetyCertified: true,
    haccpCode: "HCP-883",
    description: "Intact roast poultry with roasted seasonal root vegetable garnish. Packaged in sealed stainless GN 1/1 food pans with thermal seal."
  },
  {
    id: "SRP-2026-002",
    recordId: "DT-F-0001",
    title: "Baguettes & Brioche Breads",
    provider: "Pacific Rim Bakery Station #1",
    facilityId: "NODE-01",
    category: "Bakery",
    quantityKg: 9.0,
    availableKg: 9.0,
    servings: 22,
    expiryWindow: "03h 15m",
    prepTime: "Today at 11:30 AM",
    temp: "70°F (Ambient)",
    status: "Requested",
    dietary: ["Vegetarian", "Dairy-Free"],
    pickupAddress: "Bakery Rear Entrance Dock #1",
    safetyCertified: true,
    haccpCode: "HCP-912",
    description: "Freshly baked artisan brioche and baguettes in food-grade bakery containers."
  },
  {
    id: "SRP-2026-003",
    recordId: "DT-F-0004",
    title: "Brown Rice & Quinoa Grain Bowls",
    provider: "Main Kitchen Prep Central",
    facilityId: "NODE-02",
    category: "Grains",
    quantityKg: 3.0,
    availableKg: 0.0,
    servings: 8,
    expiryWindow: "Completed",
    prepTime: "Oct 01 at 02:20 PM",
    temp: "36°F (Chilled)",
    status: "Completed",
    dietary: ["Vegan", "Gluten-Free"],
    pickupAddress: "Main Kitchen Dock #3",
    safetyCertified: true,
    haccpCode: "HCP-704",
    description: "Steamed quinoa bowl with roasted bell peppers and olive oil drizzle."
  },
  {
    id: "SRP-2026-004",
    recordId: "DT-F-0006",
    title: "Grilled Salmon & Asparagus Speared",
    provider: "Banquet Hall B",
    facilityId: "NODE-05",
    category: "Proteins",
    quantityKg: 14.0,
    availableKg: 0.0,
    servings: 32,
    expiryWindow: "Completed",
    prepTime: "Sep 30 at 06:10 PM",
    temp: "37°F (Chilled)",
    status: "Distributed",
    dietary: ["Gluten-Free", "Keto-Friendly"],
    pickupAddress: "Banquet Kitchen Service Door",
    safetyCertified: true,
    haccpCode: "HCP-655",
    description: "Atlantic salmon fillets grilled with fresh herbs and asparagus spears."
  },
  {
    id: "SRP-2026-005",
    recordId: "DT-F-0005",
    title: "Greek Yogurt & Cold Sauces",
    provider: "Dairy Prep Line 1",
    facilityId: "NODE-03",
    category: "Dairy",
    quantityKg: 1.5,
    availableKg: 0.0,
    servings: 4,
    expiryWindow: "Expired",
    prepTime: "Oct 01 at 07:30 AM",
    temp: "45°F (Ambient)",
    status: "Expired",
    dietary: ["Vegetarian"],
    pickupAddress: "Cold Storage Dock #1",
    safetyCertified: false,
    haccpCode: "HCP-501",
    description: "Chilled Greek yogurt containers exceeding cold chain window safety protocol."
  }
];

export const mockSurplusRecords = [
  {
    surplusId: "DT-S-0201",
    recordId: "DT-F-0001",
    batch: "Baguettes & Brioche Breads",
    weight: 9.0,
    temp: "70°F (Ambient)",
    readyTime: "11:42 AM",
    recipient: "Hope Harbor Community Kitchen",
    courier: "Courier #204 (ETA 25m)",
    status: "Requested",
    statusBg: "bg-amber-100 text-amber-900"
  },
  {
    surplusId: "DT-S-0202",
    recordId: "DT-F-0002",
    batch: "Herb-Roasted Lemon Chicken & Root Veggies",
    weight: 18.5,
    temp: "38°F (Chilled)",
    readyTime: "09:45 AM",
    recipient: "Available on Marketplace",
    courier: "Pending Claim Dispatch",
    status: "Available",
    statusBg: "bg-emerald-100 text-emerald-800"
  },
  {
    surplusId: "DT-S-0203",
    recordId: "DT-F-0004",
    batch: "Brown Rice & Quinoa Grain Bowls",
    weight: 3.0,
    temp: "36°F (Chilled)",
    readyTime: "02:20 PM",
    recipient: "City Mission Food Pantry",
    courier: "Courier #108 (Completed)",
    status: "Completed",
    statusBg: "bg-tertiary-fixed text-on-tertiary-fixed"
  }
];

// 3. NGO Rescue Requests
export const mockRescueRequests = [
  {
    requestId: "REQ-2026-001",
    surplusId: "SRP-2026-002",
    recordId: "DT-F-0001",
    itemTitle: "Baguettes & Brioche Breads",
    provider: "Pacific Rim Bakery Station #1",
    ngoName: "Hope Harbor Community Kitchen",
    ngoId: "NGO-4491",
    ngoContact: "Sarah Jenkins (Director)",
    ngoPhone: "+1 (555) 234-5678",
    requestedKg: 9.0,
    estimatedMeals: 22,
    purpose: "Evening Meal Service for Shelter Residents",
    requestTime: "Today at 11:45 AM",
    pickupWindow: "02:30 PM - 03:30 PM",
    courier: "Hope Harbor Van #4 (Driver: Dave M.)",
    status: "Pending", // Pending | Accepted | Rejected | Pickup Scheduled | Picked Up | Received | Distributed | Completed
    rejectionReason: null,
    dockAccessCode: "DOCK-8821",
    haccpVerified: true,
    receivedTime: null,
    distributedMeals: null,
    finalNotes: null
  },
  {
    requestId: "REQ-2026-002",
    surplusId: "SRP-2026-003",
    recordId: "DT-F-0004",
    itemTitle: "Brown Rice & Quinoa Grain Bowls",
    provider: "Main Kitchen Prep Central",
    ngoName: "City Mission Food Pantry",
    ngoId: "NGO-1024",
    ngoContact: "Mark Rivera",
    ngoPhone: "+1 (555) 876-5432",
    requestedKg: 3.0,
    estimatedMeals: 8,
    purpose: "Senior Nutrition Program Handoff",
    requestTime: "Oct 01 at 03:00 PM",
    pickupWindow: "04:00 PM - 05:00 PM",
    courier: "City Mission Dispatch 12",
    status: "Completed",
    rejectionReason: null,
    dockAccessCode: "DOCK-4402",
    haccpVerified: true,
    receivedTime: "Oct 01 at 04:30 PM",
    distributedMeals: 8,
    finalNotes: "Fully distributed at evening soup kitchen."
  },
  {
    requestId: "REQ-2026-003",
    surplusId: "SRP-2026-004",
    recordId: "DT-F-0006",
    itemTitle: "Grilled Salmon & Asparagus Speared",
    provider: "Banquet Hall B",
    ngoName: "St. Jude Youth Center",
    ngoId: "NGO-3310",
    ngoContact: "Elena Rostova",
    ngoPhone: "+1 (555) 345-6789",
    requestedKg: 14.0,
    estimatedMeals: 32,
    purpose: "After-school Youth Dining",
    requestTime: "Sep 30 at 07:00 PM",
    pickupWindow: "08:00 PM - 09:00 PM",
    courier: "St. Jude Volunteer Truck 02",
    status: "Distributed",
    rejectionReason: null,
    dockAccessCode: "DOCK-1920",
    haccpVerified: true,
    receivedTime: "Sep 30 at 08:25 PM",
    distributedMeals: 32,
    finalNotes: "Served hot to youth shelter attendees."
  }
];

// 4. Waste Records List
export const mockWasteRecords = [
  {
    logId: "DT-W-0101",
    recordId: "DT-F-0003",
    date: "2026-10-02",
    time: "11:42 AM",
    item: "Vegetable Scraps & Peelings",
    station: "Station #4 Prep",
    category: "Vegetables",
    weight: 7.5,
    type: "Organic Scrap",
    cause: "Raw Prep Inedibles",
    stream: "Aerobic Digester",
    status: "Composted",
    statusBg: "bg-primary-fixed text-on-primary-fixed"
  },
  {
    logId: "DT-W-0102",
    recordId: "DT-F-0002",
    date: "2026-10-02",
    time: "10:15 AM",
    item: "Scorched Poultry Trimmings",
    station: "Hot Prep Line 2",
    category: "Proteins",
    weight: 1.4,
    type: "Cooked Loss",
    cause: "Over-searing Scrap",
    stream: "Municipal Compost",
    status: "Diverted",
    statusBg: "bg-surface-container-low text-primary"
  },
  {
    logId: "DT-W-0103",
    recordId: "DT-F-0001",
    date: "2026-10-01",
    time: "02:10 PM",
    item: "Stale Baguette Ends",
    station: "Bakery Station 01",
    category: "Bakery",
    weight: 2.5,
    type: "Inedible Crust",
    cause: "Prep Trimming",
    stream: "Local Animal Feed",
    status: "Diverted",
    statusBg: "bg-tertiary-fixed text-on-tertiary-fixed"
  }
];

// 5. Reports List
export const mockReportsList = [
  {
    reportId: "RPT-2026-001",
    title: "Monthly Municipal SB 1383 Audit Filing",
    type: "Regulatory PDF",
    period: "October 2026",
    size: "2.4 MB",
    status: "Ready"
  },
  {
    reportId: "RPT-2026-002",
    title: "EPA Scope 3 Methane Diversion Ledger",
    type: "ESG Compliance CSV",
    period: "Q3 2026",
    size: "4.8 MB",
    status: "Ready"
  },
  {
    reportId: "RPT-2026-003",
    title: "Kitchen Prep Line Yield Efficiency Report",
    type: "Internal Analytics",
    period: "Last 30 Days",
    size: "1.2 MB",
    status: "Ready"
  },
  {
    reportId: "RPT-2026-004",
    title: "Surplus Food Rescue Handoff Receipts",
    type: "Audit Trail PDF",
    period: "October 2026",
    size: "890 KB",
    status: "Ready"
  }
];

// 6. Dual Path Trace Details Loader
export function getMockTraceForRecord(recordId, recordsList = mockFoodRecords, requestsList = mockRescueRequests) {
  const found = recordsList.find((r) => r.recordId === recordId) || recordsList[0];
  const req = requestsList.find((rq) => rq.recordId === found.recordId || rq.surplusId === found.recordId);
  
  const prepared = found.foodPrepared || 42.5;
  const consumed = found.foodConsumed || 31.0;
  const surplus = found.surplus || 9.0;
  const waste = found.waste || 2.5;

  const isRescuePath = surplus > 0 && found.status !== "Composted";

  const rescueEvents = [
    {
      time: `${found.date} at ${found.time || '09:45 AM'}`,
      phase: "1. KITCHEN INGESTION",
      title: `Logged at ${found.station}`,
      desc: `Prepared: ${prepared} kg, Consumed: ${consumed} kg. Surplus identified: ${surplus} kg. Ingestion auto-tare verified.`
    },
    {
      time: `${found.date} at 11:30 AM`,
      phase: "2. STAGING & HACCP COLD CHAIN",
      title: "Transferred to Refrigerator Chiller #2",
      desc: `Surplus lot (${surplus} kg) packaged in tamper-evident food containers. Temp monitored continuously at 38°F.`
    },
    {
      time: `${found.date} at 11:45 AM`,
      phase: "3. SURPLUS MARKETPLACE LISTING",
      title: "Listed on DigiTrace Surplus Network",
      desc: `Lot ${found.itemName} published for non-profit and food bank requisitioning with 3h safety window.`
    },
    {
      time: req ? `${req.requestTime}` : `${found.date} at 01:15 PM`,
      phase: "4. NGO REQUISITION & DOCK MATCH",
      title: req ? `Claimed by ${req.ngoName}` : "Claim Request Received",
      desc: req ? `Requested ${req.requestedKg} kg (~${req.estimatedMeals} meals). Purpose: ${req.purpose}.` : "NGO claim submitted and pending donor dock authorization."
    },
    {
      time: `${found.date} at 02:30 PM`,
      phase: "5. COURIER PICKUP & CUSTODY DISPATCH",
      title: "Handoff to Certified Refrigerated Courier",
      desc: "Digital dock pass scanned. Custody manifest signed by driver with temperature probe audit."
    },
    {
      time: `${found.date} at 03:45 PM`,
      phase: "6. INTAKE & COMMUNITY DISTRIBUTION",
      title: "Receipt Confirmed at NGO Dining Facility",
      desc: "Surplus food inspected, received, and served as hot meals to community beneficiaries."
    }
  ];

  const wasteEvents = [
    {
      time: `${found.date} at ${found.time || '11:42 AM'}`,
      phase: "1. PREP LOSS INGESTION",
      title: `Logged at ${found.station}`,
      desc: `Inedible prep scrap recorded: ${waste} kg (${found.foodCategory}). Auto-weighed via IoT scale.`
    },
    {
      time: `${found.date} at 12:15 PM`,
      phase: "2. SORTING & STREAM SEGREGATION",
      title: "Transferred to Organic Diversion Bin #4",
      desc: "Contamination check completed. Organic material separated from inorganic packaging."
    },
    {
      time: `${found.date} at 02:00 PM`,
      phase: "3. MUNICIPAL DIVERSION HANDOFF",
      title: "Handoff to Regional Aerobic Bio-Digester",
      desc: "Transported to municipal facility for methane gas capture and organic compost creation."
    },
    {
      time: `${found.date} at 05:00 PM`,
      phase: "4. EPA SCOPE 3 CERTIFICATION",
      title: "Landfill Avoidance Ledger Sealed",
      desc: `Avoided ${(waste * 1.8).toFixed(1)} kg CO2e emissions. EPA SB 1383 compliance ledger signed.`
    }
  ];

  return {
    recordId: found.recordId,
    auditHash: `AUD-${found.recordId.replace(/[^0-9]/g, '')}-8F2A`,
    organization: "Grand Hotel & Conference Banquets",
    regulatoryStandard: "ISO 14001 / HACCP / SB 1383",
    itemName: found.itemName,
    timestamp: `${found.date} at ${found.time || '11:30 AM'}`,
    station: found.station || "Station #4 Line Alpha",
    status: found.status,
    statusBg: found.statusBg,
    preparedKg: prepared,
    consumedKg: consumed,
    consumedPct: prepared > 0 ? Math.round((consumed / prepared) * 100) : 0,
    surplusKg: surplus,
    surplusPct: prepared > 0 ? Math.round((surplus / prepared) * 100) : 0,
    wasteKg: waste,
    wastePct: prepared > 0 ? Math.round((waste / prepared) * 100) : 0,
    landfillAvoidancePct: 94.8,
    co2eMitigatedKg: (surplus * 2.2 + waste * 1.8).toFixed(1),
    isRescuePath,
    events: isRescuePath ? rescueEvents : wasteEvents
  };
}

// 7. Analytics Data
export const mockAnalyticsData = {
  timeRange: "Month",
  totals: {
    preparedInventoryKg: 5420,
    preparedChangePct: 3.2,
    consumptiveYieldRatePct: 82.4,
    yieldChangePct: 4.1,
    surplusRescuedRatePct: 14.8,
    surplusRescuedKg: 802,
    netDiscardRatioPct: 3.8,
    discardChangePct: -2.4
  },

  financialSavings: {
    purchasingAvoidedUsd: 5420.0,
    taxCreditUsd: 1680.0,
    totalUsd: 7100.0
  },

  weeklyPrepLossTrend: [
    { week: "W1", value: 65, rescue: 120 },
    { week: "W2", value: 42, rescue: 140 },
    { week: "W3", value: 78, rescue: 110 },
    { week: "W4", value: 55, rescue: 165 },
    { week: "W5", value: 38, rescue: 180 },
    { week: "W6", value: 90, rescue: 135 },
    { week: "W7", value: 48, rescue: 190 },
    { week: "W8", value: 60, rescue: 175 },
    { week: "W9", value: 35, rescue: 210 },
    { week: "W10", value: 70, rescue: 195 },
    { week: "W11", value: 45, rescue: 220 },
    { week: "W12", value: 30, rescue: 240 }
  ],

  aiRecommendations: [
    {
      id: "REC-AI-1",
      title: "Optimize Poultry Prep Volume",
      desc: "Data models detect a recurring 18% surplus of roast chicken on Thursday lunch shifts. Recommended batch reduction: 6.5 kg to align with consumption.",
      savings: "~$180/week",
      badgeColor: "bg-surface-container text-primary"
    },
    {
      id: "REC-AI-2",
      title: "Cold Chain Telemetry Check",
      desc: "Chiller #2 temperature log shows +2°F variance during 2 PM shift transitions. Prompt sensor calibration to preserve safe window.",
      savings: "Preventive HACCP",
      badgeColor: "bg-surface-container text-tertiary"
    },
    {
      id: "REC-AI-3",
      title: "Landfill Diversion Milestone",
      desc: "Your facility achieved 95.2% landfill avoidance rating for 4 consecutive weeks. Verified EPA Certificate ready for download.",
      savings: "Certified EPA Ready",
      badgeColor: "bg-surface-container text-on-surface"
    }
  ]
};
