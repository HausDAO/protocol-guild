export interface Member {
    account: string;
    activityMultiplier: number;
    secondsActive: number;
    startDate: number;
    percAlloc?: number;
  }

  export interface StagingMember {
    account: string;
    activityMultiplier: number;
    startDate: number;
    newMember: boolean;
  }