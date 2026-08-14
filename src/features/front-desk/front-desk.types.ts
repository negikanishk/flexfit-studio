export type DailyScheduleItem = {
  classId: string;
  title: string;
  category: string;
  startTime: string;
  room: string;
  trainerName: string;
  capacity: number;
  confirmedCount: number;
  attendeeList: {
    bookingId: string;
    memberId: string;
    memberName: string;
    email: string;
    status: string;
    checkInTime: string | null;
  }[];
};
