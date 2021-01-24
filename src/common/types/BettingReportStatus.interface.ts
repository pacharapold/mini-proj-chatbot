export interface IBettingReportStatus {
  id: number;
  createDstamp: Date;
  completed: boolean;
  completedTstamp?: Date;
  updatedAt: Date;
}
