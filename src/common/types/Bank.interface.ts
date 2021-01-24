export interface Bank {
  code: string;
  abbr: string[];
  length: number;
  swiftCode: number;
}

export const BANKS: Record<string, Bank> = {
  SCB: { code: 'SCB', abbr: [], length: 10, swiftCode: 14 },
  KBANK: { code: 'KBANK', abbr: ['KBNK'], length: 10, swiftCode: 4 },
  BAY: { code: 'BAY', abbr: ['BAYA', 'BAY2'], length: 10, swiftCode: 25 },
  TMB: { code: 'TMB', abbr: ['TMBA'], length: 10, swiftCode: 11 },
  BBL: { code: 'BBL', abbr: ['BBLA'], length: 10, swiftCode: 2 },
  GSB: { code: 'GSB', abbr: ['GSBA'], length: 12, swiftCode: 30 },
  KTB: { code: 'KTB', abbr: ['KTBA'], length: 10, swiftCode: 6 },
  BAAC: { code: 'BAAC', abbr: ['BAACA'], length: 12, swiftCode: 34 },
  CIMB: { code: 'CIMB', abbr: ['CIMBT'], length: 10, swiftCode: 22 },
  UOB: { code: 'UOB', abbr: ['UOBT'], length: 10, swiftCode: 24 },
  TBANK: {
    code: 'TBANK',
    abbr: ['TBANKA', 'TBANK', 'TBNK'],
    length: 10,
    swiftCode: 65,
  },
};

export const getBankByAbbr = (abbr: string): Bank | null => {
  const keys = Object.keys(BANKS);
  for (const k of keys) {
    const b = BANKS[k];
    if (b.code === abbr || b.abbr.includes(abbr)) return b;
  }
  return null;
};

export const getSwiftCodeByNum = (num: string): Bank | null => {
  const keys = Object.keys(BANKS);
  for (const k of keys) {
    const b = BANKS[k];
    if (b.swiftCode === Number(num)) return b;
  }
  return null;
};
