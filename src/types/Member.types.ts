export interface Member {
    account: string;
    activityMultiplier: number;
    secondsActive: number;
    startDate: number;
    percAlloc?: number;
  };

  export type StagingMember = {
    account: string;
    activityMultiplier: number;
    startDate: number;
    isNewMember: boolean;
  };
