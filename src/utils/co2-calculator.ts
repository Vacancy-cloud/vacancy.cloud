/**
 * Danish Building Regulation (BR18) & LCAbyg based constants.
 * Metrics: kg CO2e / m2 / year (calculated over a 50-year period).
 */
export const DANISH_LCA_STANDARDS = {
    REFERENCE_PERIOD: 50, // Standard Danish calculation period
    TARGET_2025_LIMIT: 7.1, // New Danish limit for buildings > 1000m2
  };
  
  export interface CarbonAnalysis {
    conservation: number;
    renovation: number;
    demolition: number;
  }

  // Define standard emission factors based on Danish LCA data
  const MATERIAL_FACTORS: Record<string, number> = {
    'Beton': 1.3,
    'Betonkonstruktion': 1.3,
    'mursten': 1.0,
    'Brick': 1.0, // Keep for backward compatibility
    'Trækonstruktion': 0.7,
    'Wood': 0.7, // Keep for backward compatibility
    'Steel': 1.5, // Added steel as it's common in commercial buildings
    'Default': 1.0
  };
  
  /**
   * Main calculation engine for the three scenarios.
   * @param areaM2 - Building area in square meters. Must be > 0.
   * @param material - Building material type (e.g., 'mursten', 'Betonkonstruktion', 'Trækonstruktion', 'Steel')
   * @param yearBuilt - Year the building was constructed
   * @returns CarbonAnalysis object with CO2 impact values
   * @throws Error if areaM2 is <= 0
   */
  export const calculateCarbonImpact = (
    areaM2: number, 
    material: string = 'Default', 
    yearBuilt: number = 2000
  ): CarbonAnalysis => {
    // Type guard: ensure area is valid
    if (!isFinite(areaM2) || areaM2 <= 0) {
      throw new Error(`Invalid area: ${areaM2}. Area must be a positive number.`);
    }

    const REFERENCE_PERIOD = DANISH_LCA_STANDARDS.REFERENCE_PERIOD;
    
    // 1. Determine Material Multiplier
    const materialMultiplier = MATERIAL_FACTORS[material] || MATERIAL_FACTORS['Default'];
    
    // 2. Determine Age Penalty for Demolition (Buildings pre-1975 often have hazardous waste)
    const agePenalty = yearBuilt < 1975 ? 1.15 : 1.0;

    // Base Embodied Values (kg CO2e / m2)
    const baseEmbodied = {
      renovation: 125,
      newBuild: 450
    };

    // Scenarios Logic
    // Conservation: 0 upfront, but high operational (5.5 kg/m2/yr)
    const conservation = (5.5 * areaM2 * REFERENCE_PERIOD);

    // Renovation: Reduced upfront * material factor + Mid operational (2.5 kg/m2/yr)
    const renovation = (baseEmbodied.renovation * materialMultiplier * areaM2) + 
                       (2.5 * areaM2 * REFERENCE_PERIOD);

    // Demolition: High upfront * material factor * age penalty + Low operational (1.2 kg/m2/yr)
    const demolition = (baseEmbodied.newBuild * materialMultiplier * agePenalty * areaM2) + 
                       (1.2 * areaM2 * REFERENCE_PERIOD);

    // Final result normalized to kg CO2e / m2 / year
    return {
      conservation: parseFloat((conservation / (areaM2 * REFERENCE_PERIOD)).toFixed(1)),
      renovation: parseFloat((renovation / (areaM2 * REFERENCE_PERIOD)).toFixed(1)),
      demolition: parseFloat((demolition / (areaM2 * REFERENCE_PERIOD)).toFixed(1))
    };
  };