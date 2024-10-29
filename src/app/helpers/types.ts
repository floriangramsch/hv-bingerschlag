export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  registered: boolean;
  telegram_id: string;
  is_active: boolean;
};

export type TSelectUser = {
  value: number;
  label: string;
  first_name: string;
  registered: boolean;
  is_active: boolean;
};

export type DShift = {
  id: number;
  worker1_id: number;
  worker2_id: number;
  date: Date;
  special_event: number;
  special_name: string;
  end_date: Date;
};

export type TShift = {
  id: number;
  date: Date;
  end_date: Date;
  specialEvent: number;
  specialName: string;
  availability: number;
};

export type TAssignedShifts = {
  id: number;
  date: Date;
  end_date: Date;
  special_event: number;
  special_name: string;
  worker1_name: string;
  worker2_name: string;
};

export type TSurvey = {
  id: number;
  first_name: string;
  last_name: string;
  date: Date;
  end_date: Date;
  special_event: number;
  special_name: string;
  availability: number;
};

export type TSurveys = {
  [key: string]: {
    userId: number;
    user: string;
    availability: number;
    assigned: boolean;
  };
};

export type TShiftsToAssign = {
  [key: string]: TShift & { surveys: TSurveys };
};

export type TEvent = {
  date: Date;
  endDate: Date;
  eventName: string;
};

export type TCombinedEvents = {
  id: string;
  title: string;
  start: Date;
  end: Date;
}[];

export type TEvents = {
  shifts: Record<number, TEvent>;
  usage: Record<number, TEvent>;
};
