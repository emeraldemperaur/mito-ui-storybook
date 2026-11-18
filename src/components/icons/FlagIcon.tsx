import React from "react";
import * as Flags from "country-flag-icons/react/3x2";

type CountryCode = keyof typeof Flags;

export interface FlagIconProps {
  /**
   * The required country identifier for the FlagIcon component.
   * @example "NG"
   */
  country: CountryCode | 'EU';
  /**
   * Dynamic control of the flag's width. Accepts standard CSS width values.
   * @default '18px'
   */
  width?: string | number;
  /**
   * Dynamic control of the flag's height. Accepts standard CSS height values.
   * @default '12px'
   */
  height?: string | number;
  /**
   * Optional inline styles to merge with the base flag element.
   */
  style?: React.CSSProperties;
}

export const FlagIcon = ({ 
  country, 
  width = '18px', 
  height = '12px',
  style 
}: FlagIconProps) => {
  const FlagComponent = Flags[country as keyof typeof Flags];
  
  const baseStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '2px',
    flexShrink: 0, 
    ...style
  };

  if (country === 'EU') {
    return <Flags.EU style={baseStyle} />;
  }

  return FlagComponent ? (
    <FlagComponent style={baseStyle} />
  ) : (
    <div style={{ ...baseStyle, background: '#eee' }} />
  );
};