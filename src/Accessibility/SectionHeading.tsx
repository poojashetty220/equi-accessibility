/**
 * @fileoverview Section Heading Component
 * @module Accessibility/SectionHeading
 * 
 * A reusable section heading component for accessibility option sections.
 * 
 * @component
 * @example
 * ```tsx
 * <SectionHeading id="font-size-heading" isDarkMode={false}>
 *   Font Size
 * </SectionHeading>
 * ```
 */

import React from 'react';
import { combineClasses } from './utils';

export interface SectionHeadingProps {
  id: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
  className?: string;
}

/**
 * SectionHeading Component
 * 
 * A reusable section heading component with consistent styling.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  children,
  isDarkMode = false,
  className = ''
}) => {
  return (
    <h3 
      id={id}
      className={combineClasses(
        `text-sm font-semibold uppercase tracking-wider text-left ${
          isDarkMode ? 'text-white' : 'text-secondary-900'
        }`,
        className
      )}
    >
      {children}
    </h3>
  );
};

export default SectionHeading;

