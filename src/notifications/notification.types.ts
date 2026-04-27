/* eslint-disable prettier/prettier */

export interface NotificationPayload {
  userId: string;
  jobId?: string;
  status: 'DONE' | 'FAILED';
  output?: string;
}