export interface GISData {
  publicTransportScore: number;
  walkabilityScore: number;
  nearestBusStop: string;
  nearestTrainStation: string;
  landUseZone: string;
  floodRiskZone: string;
  noiseLevel: string;
  nearbyAmenities: string[];
  populationDensity: string;
  avgIncomeArea: string;
}

export interface ESGData {
  estimatedCO2Footprint: string;
  energyClass: string;
  heatingType: string;
  insulationStatus: string;
  potentialCO2Reduction: string;
  renovationToEnergyClassB: string;
  demolitionWasteEstimate: string;
  reusableMaterialsValue: string;
  materialBreakdown: {
    brick: string;
    concrete: string;
    wood: string;
    other: string;
  };
}

export interface FinancialData {
  estimatedMarketValue: string;
  landValue: string;
  pricePerSqm: string;
  estimatedRenovationCost: string;
  annualMaintenanceCost: string;
  propertyTax: string;
  rentalPotentialResidential: string;
  rentalPotentialCommercial: string;
  saleAfterRenovation: string;
  paybackPeriod: string;
  expectedROI: string;
}

export interface AIScenario {
  name: string;
  description: string;
  investmentRequired: string;
  expectedROI: string;
  timeframe: string;
  riskLevel: string;
  co2Impact: string;
  feasibilityScore: number;
}

export interface Building {
  id: string;
  name: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  image?: string;
  type: string;
  price: string;
  size: {
    floorArea?: string;
    groundArea?: string;
    commercialArea?: string;
    builtArea?: string;
  };
  floors: string;
  material: string;
  materialCategory?: string; // Material category for CO2 calculations (e.g., 'mursten', 'Betonkonstruktion', 'Trækonstruktion', 'Steel')
  owner: string;
  year: string;
  description: string;
  gisData?: GISData;
  esgData?: ESGData;
  financialData?: FinancialData;
  aiScenarios?: AIScenario[];
  isochroneGeoJSON?: GeoJSON.FeatureCollection; // Isochrone data for walkability visualization
  galleryImages?: string[]; // Array of image paths for photo gallery
  planImages?: string[]; // Array of image paths for plan drawings
}

export interface ContactFormData {
  name: string;
  email: string;
  organization?: string;
  message: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}


