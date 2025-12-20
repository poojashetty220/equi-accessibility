/**
 * @fileoverview Utility functions for class name management in Accessibility components
 * @module Accessibility/utils
 * 
 * These utilities help merge and combine CSS class names, ensuring custom classes
 * can override default styles. This is essential for the library's customization feature.
 */

/**
 * Merges multiple class name strings into a single string
 * Filters out falsy values (null, undefined, empty strings) before joining
 * 
 * @param classes - Variable number of class name strings to merge
 * @returns A single space-separated string of all valid class names
 * 
 * @example
 * mergeClasses('btn', 'btn-primary', null, 'active')
 * // Returns: 'btn btn-primary active'
 */
export const mergeClasses = (...classes: (string | null | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Combines default classes with custom classes
 * Custom classes are appended after defaults, allowing Tailwind CSS to override
 * default styles when the same utility class is used
 * 
 * @param defaultClasses - Default/base class names (required)
 * @param customClasses - Custom class names to override defaults (optional)
 * @returns Combined class string with defaults first, then custom classes
 * 
 * @example
 * combineClasses('bg-primary-600 text-white', 'bg-red-500')
 * // Returns: 'bg-primary-600 text-white bg-red-500'
 * // Tailwind will use bg-red-500 (last one wins)
 */
export const combineClasses = (defaultClasses: string, customClasses: string = ''): string => {
  if (!customClasses) return defaultClasses;
  return mergeClasses(defaultClasses, customClasses);
};

