export type EventStatus = 'active' | 'closed' | 'cancelled';
export type ParticipantType = 'vip' | 'normal';
export type ParticipantStatus = 'inside' | 'outside';
export type CheckinAction = 'entry' | 'exit';
export type CheckinErrorReason = 'already_checked_in' | 'event_closed' | null;

export interface Event {
  id: string; // e.g. "EVT-001"
  name: string;
  date: string; // ISO date string
  location: string;
  status: EventStatus;
  description: string;
  expected_count: number;
  checkin_count: number;
  error_count: number;
  entry_rate: number; // percentual 0–100
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
}

export interface Checkin {
  id: string;
  event_id: string;
  participant_id: string;
  timestamp: string; // ISO date string
  success: boolean;
  action: CheckinAction;
  error_reason: CheckinErrorReason;
}

export interface EventDetail extends Event {
  participants: Participant[];
  checkins: Checkin[];
}

// Estado local gerenciado pelo Zustand (simulação client-side)
export interface LocalCheckinState {
  // participant_id → lista de check-ins simulados
  [participantId: string]: Checkin[];
}
