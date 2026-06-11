// Tax calculation utilities for YumPOS V2
// Handles dynamic tax rates for service items vs retail items

/**
 * Round number to 2 decimal places
 * @param {number} num
 * @returns {number}
 */
export const roundTo2 = (num) => {
  return Math.round(num * 100) / 100;
};

/**
 * Get tax configuration from location data
 * @param {Object} locationData - Location data with tax rates
 * @returns {Object} Tax configuration
 */
export const getTaxConfiguration = (locationData) => {
  console.log(locationData);

  // Handle different data structure formats
  let taxRates = null;

  if (Array.isArray(locationData)) {
    // Direct array format: [{ name: "Sales Tax", rate: "5" }, ...]
    taxRates = locationData;
  } else if (locationData && locationData.taxRates) {
    // Nested format: { taxRates: [{ name: "CGST", rate: "9" }, ...] }
    taxRates = locationData.taxRates;
  } else if (locationData && (locationData.default_tax_1_rate || locationData.default_tax_2_rate)) {
    // Legacy format: { default_tax_1_rate: "9", default_tax_1_name: "CGST", ... }
    taxRates = [
      { name: locationData.default_tax_1_name || "CGST", rate: locationData.default_tax_1_rate || "9" },
      { name: locationData.default_tax_2_name || "SGST", rate: locationData.default_tax_2_rate || "9" }
    ];
  }

  if (!taxRates || taxRates.length < 2) {
    // Default fallback to 18% (9% + 9%)
    return {
      rate1: 9,
      name1: "CGST",
      rate2: 9,
      name2: "SGST",
      totalRate: 18,
    };
  }

  const rate1 = parseFloat(taxRates[0]?.rate) || 9;
  const rate2 = parseFloat(taxRates[1]?.rate) || 9;

  return {
    rate1,
    name1: "CGST",
    name2: "SGST",
    rate2,
    totalRate: rate1 + rate2,
  };
};

/**
 * Calculate tax for items with tax-inclusive pricing (MRP)
 * Works for both service and retail items using provided tax configuration
 * @param {number} itemPrice - Tax-inclusive price (MRP)
 * @param {Object} taxConfig - Tax configuration (from location or item-specific)
 * @returns {Object} Tax calculation result
 */
export const calculateItemTax = (itemPrice, taxConfig) => {
  const totalTaxRate = taxConfig.totalRate;

  // Tax-inclusive price breakdown (reverse calculation from MRP)
  const basePrice = itemPrice / (1 + totalTaxRate / 100);
  const totalTaxAmount = itemPrice - basePrice;

  // Split based on individual tax rates
  const tax1Amount = basePrice * (taxConfig.rate1 / 100);
  const tax2Amount = basePrice * (taxConfig.rate2 / 100);

  return {
    basePrice: roundTo2(basePrice),
    taxAmount: roundTo2(totalTaxAmount),
    cgst: roundTo2(tax1Amount),
    sgst: roundTo2(tax2Amount),
    totalAmount: itemPrice,
  };
};

/**
 * @deprecated Use calculateItemTax instead. Kept for backward compatibility.
 */
export const calculateServiceItemTax = (
  itemPrice,
  taxConfig,
  isService = true
) => {
  // Now uses the same logic for both service and retail
  return calculateItemTax(itemPrice, taxConfig);
};

/**
 * @deprecated Use calculateItemTax instead. Kept for backward compatibility.
 */
export const calculateRetailItemTax = (itemPrice, taxConfig = null) => {
  // If no config provided, use default 18%
  const config = taxConfig || {
    rate1: 9,
    name1: "CGST",
    rate2: 9,
    name2: "SGST",
    totalRate: 18,
  };
  return calculateItemTax(itemPrice, config);
};

/**
 * Calculate base price from tax-inclusive price (MRP)
 * Uses item-specific taxes if available, otherwise location taxes
 * @param {number} unitPrice - Tax-inclusive unit price (MRP)
 * @param {Array} itemTaxes - Array of item taxes [{name, percent}, ...]
 * @param {Object} taxConfig - Location tax configuration (fallback)
 * @param {boolean} isService - Whether item is a service (kept for compatibility)
 * @returns {number} Base price
 */
export const calculateBasePrice = (
  unitPrice,
  itemTaxes,
  taxConfig,
  isService = true
) => {
  // Calculate total tax rate from item taxes if available
  let totalTax;
  if (itemTaxes && itemTaxes.length > 0) {
    totalTax = itemTaxes.reduce((sum, tax) => sum + (tax.percent || 0), 0);
  } else if (taxConfig) {
    totalTax = taxConfig.totalRate;
  } else {
    totalTax = 18; // Default fallback
  }

  return unitPrice / (1 + totalTax / 100);
};

/**
 * Calculate cart taxes with dynamic tax rates
 * Uses item-specific taxes where available, falls back to location taxes
 * @param {Array} cartItems - Array of cart items
 * @param {Object} taxConfig - Location tax configuration (fallback)
 * @param {number} subtotal - Cart subtotal
 * @returns {Array} Array of tax objects
 */
export const calculateCartTaxes = (cartItems, taxConfig, subtotal) => {
  // Exclude discount products as they're not taxable items
  const taxableItems = cartItems.filter((item) => item.type !== "discount");

  // Group taxes by rate for proper display
  const taxTotals = {};

  taxableItems.forEach((item) => {
    // Get item's tax rates
    const itemTaxes = item.itemTaxes && item.itemTaxes.length > 0
      ? item.itemTaxes
      : [
          { name: taxConfig.name1 || "CGST", percent: taxConfig.rate1 },
          { name: taxConfig.name2 || "SGST", percent: taxConfig.rate2 },
        ];

    const itemTotalTaxRate = itemTaxes.reduce((sum, tax) => sum + (tax.percent || 0), 0);
    const discountPercent = item._isService ? (item.discountPercent || 0) : 0;

    // Calculate base price and tax amount
    let taxAmount = 0;
    if (item._taxIncluded) {
      // For tax-inclusive items (MRP), reverse calculate
      const discountedPrice = item.itemUnitPrice * (1 - discountPercent / 100);
      const basePrice = discountedPrice / (1 + itemTotalTaxRate / 100);
      taxAmount = (discountedPrice - basePrice) * item.quantityPurchased;
    } else {
      // For tax-exclusive items
      const basePrice = item.itemUnitPrice * (1 - discountPercent / 100);
      taxAmount = (basePrice * item.quantityPurchased * itemTotalTaxRate) / 100;
    }

    // Split tax amount proportionally among tax components
    itemTaxes.forEach((tax) => {
      const taxKey = `${tax.percent}% ${tax.name}`;
      const proportion = tax.percent / itemTotalTaxRate;
      const taxPortion = taxAmount * proportion;

      if (!taxTotals[taxKey]) {
        taxTotals[taxKey] = { id: taxKey, total: 0 };
      }
      taxTotals[taxKey].total += taxPortion;
    });
  });

  // Convert to array and round values
  const taxLines = Object.values(taxTotals).map((tax) => ({
    id: tax.id,
    total: roundTo2(tax.total),
  }));

  // If no taxes calculated, return empty defaults
  if (taxLines.length === 0) {
    return [
      { id: `${taxConfig.rate1}% ${taxConfig.name1 || "CGST"}`, total: 0 },
      { id: `${taxConfig.rate2}% ${taxConfig.name2 || "SGST"}`, total: 0 },
    ];
  }

  return taxLines;
};

/**
 * Get tax breakdown for display
 * @param {Object} taxCalculation - Tax calculation result
 * @param {Object} taxConfig - Tax configuration
 * @returns {Array} Tax breakdown array
 */
export const getTaxBreakdown = (taxCalculation, taxConfig) => {
  return [
    {
      name: taxConfig.name1,
      rate: taxConfig.rate1,
      amount: taxCalculation.cgst,
    },
    {
      name: taxConfig.name2,
      rate: taxConfig.rate2,
      amount: taxCalculation.sgst,
    },
  ];
};

/**
 * Validate tax configuration
 * @param {Object} taxConfig - Tax configuration to validate
 * @returns {boolean} Whether configuration is valid
 */
export const validateTaxConfiguration = (taxConfig) => {
  // CGST and SGST should be equal
  if (taxConfig.rate1 !== taxConfig.rate2) {
    return false;
  }

  // Total should be either 5% or 18%
  const validTotals = [5, 18];
  return validTotals.includes(taxConfig.totalRate);
};

/**
 * Generate tax data for API submission
 * Uses item-specific taxes if available, otherwise uses tax configuration
 * @param {Array} itemTaxes - Item-specific taxes array
 * @param {number} itemPrice - Item price (MRP/tax-inclusive)
 * @param {Object} taxConfig - Location tax configuration (fallback)
 * @param {boolean} isService - Whether item is a service (kept for compatibility)
 * @returns {Object} Tax data for API
 */
export const generateItemTaxData = (
  itemTaxes,
  itemPrice,
  taxConfig,
  isService
) => {
  // Use item-specific taxes if available, otherwise use location tax config
  const taxes = itemTaxes && itemTaxes.length > 0
    ? itemTaxes
    : [
        { name: taxConfig.name1 || "CGST", percent: taxConfig.rate1 },
        { name: taxConfig.name2 || "SGST", percent: taxConfig.rate2 },
      ];

  const totalTaxPercent = taxes.reduce((sum, tax) => sum + (tax.percent || 0), 0);
  const basePrice = itemPrice / (1 + totalTaxPercent / 100);

  return {
    itemTaxes: taxes.map((tax) => ({
      id: null,
      itemId: null,
      name: tax.name,
      percent: tax.percent,
      cumulative: 0,
      item: null,
      amount: roundTo2(basePrice * (tax.percent / 100)),
    })),
  };
};
