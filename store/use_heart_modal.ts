import { create } from "zustand"

type HeartModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useHeartModal = create<HeartModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))