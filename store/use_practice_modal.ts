import { create } from "zustand"

type PracticeModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const usePracticeModal = create<PracticeModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))