import * as Flags from "country-flag-icons/react/3x2";
type CountryCode = keyof typeof Flags;

export interface FlagIconProps {
   /**
   * * The required country identifier for the FlagIcon component. 
   * * @example
   * alias="NG"
   */
  country: CountryCode | 'EU'; 
}

export const FlagIcon = ({ country }: FlagIconProps) => {
  const FlagComponent = Flags[country as keyof typeof Flags];
  if (country === 'EU') {
    return <Flags.EU style={{ width: '18px', height: '12px', borderRadius: '2px' }} />;
  }
  return FlagComponent ? (
    <FlagComponent style={{ width: '18px', height: '12px' }} />
  ) : (
    <div style={{ width: '18px', height: '12px', background: '#eee' }} />
  );
};