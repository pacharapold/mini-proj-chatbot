export interface IPromotionConfig {
  payRate: number;
  limitAmount?: number;
  minimumRollover?: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
}
