/**
 * Utility functions for text manipulation
 */

export const truncateDescription = (description: string, maxLength: number = 25): string => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + '...';
};
