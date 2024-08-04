import { create } from "zustand"

type ExitModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useExitModal = create<ExitModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))