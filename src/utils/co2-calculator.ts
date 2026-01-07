/**
 * Danish Building Regulation (BR18) & LCAbyg based constants.
 * Metrics: kg CO2e / m2 / year (calculated over a 50-year period).
 */
export const DANISH_LCA_STANDARDS = {
    REFERENCE_PERIOD: 50, // Standard Danish calculation period
    TARGET_2025_LIMIT: 7.1, // New Danish limit for buildings > 1000m2
    
    // Upfront embodied carbon per m2
    EMBODIED_CARBON: {
      CONSERVATION: 0,      
      RENOVATION: 125,      
      DEMOLITION_NEW: 450   
    },
  
    // Yearly operational emissions per m2
    OPERATIONAL_YEARLY: {
      EXISTING_OLD: 5.5,    
      MODERN_RETROFIT: 2.5, 
      NEW_STANDARDS: 1.2    
    }
  };
  
  export interface CarbonAnalysis {
    conservation: number;
    renovation: number;
    demolition: number;
  }
  
  /**
   * Main calculation engine for the three scenarios.
   * @param areaM2 - Building area in square meters. Must be > 0.
   * @returns CarbonAnalysis object with CO2 impact values
   * @throws Error if areaM2 is <= 0
   */
  export const calculateCarbonImpact = (areaM2: number): CarbonAnalysis => {
    // Type guard: ensure area is valid
    if (!isFinite(areaM2) || areaM2 <= 0) {
      throw new Error(`Invalid area: ${areaM2}. Area must be a positive number.`);
    }

    const { REFERENCE_PERIOD, EMBODIED_CARBON, OPERATIONAL_YEARLY } = DANISH_LCA_STANDARDS;
  
    const getScenarioTotal = (embodied: number, yearlyOps: number): number => {
      const totalLifetimeCarbon = (embodied * areaM2) + (yearlyOps * areaM2 * REFERENCE_PERIOD);
      // Normalize to the standard Danish unit: kg CO2e / m2 / year
      // Division by areaM2 * REFERENCE_PERIOD is safe here because we've validated areaM2 > 0
      const result = totalLifetimeCarbon / (areaM2 * REFERENCE_PERIOD);
      return parseFloat(result.toFixed(2));
    };
  
    return {
      conservation: getScenarioTotal(EMBODIED_CARBON.CONSERVATION, OPERATIONAL_YEARLY.EXISTING_OLD),
      renovation: getScenarioTotal(EMBODIED_CARBON.RENOVATION, OPERATIONAL_YEARLY.MODERN_RETROFIT),
      demolition: getScenarioTotal(EMBODIED_CARBON.DEMOLITION_NEW, OPERATIONAL_YEARLY.NEW_STANDARDS)
    };
  };