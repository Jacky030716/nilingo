import { create } from "zustand"

type SettingModalState = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useSettingModal = create<SettingModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))