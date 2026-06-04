import { create } from 'zustand';
import type { Checkin } from '@/types';

interface CheckinStore {
  checkins: Checkin[];
  addCheckin: (checkin: Checkin) => void;
  getCheckins: (participantId: string) => Checkin[];
}

export const useCheckinStore = create<CheckinStore>((set, get) => ({
  checkins: [],
  addCheckin: (checkin) => set((s) => ({ checkins: [...s.checkins, checkin] })),
  getCheckins: (participantId) =>
    get().checkins.filter((c) => c.participant_id === participantId),
}));
