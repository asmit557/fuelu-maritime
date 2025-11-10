/**
 * Formatting utilities for display
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatEmissions = (value: number): string => {
  if (value >= 1e9) {
    return `${formatNumber(value / 1e9, 2)} GtCO₂eq`;
  } else if (value >= 1e6) {
    return `${formatNumber(value / 1e6, 2)} MtCO₂eq`;
  } else if (value >= 1e3) {
    return `${formatNumber(value / 1e3, 2)} ktCO₂eq`;
  }
  return `${formatNumber(value, 2)} tCO₂eq`;
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${formatNumber(value, 2)}%`;
};
