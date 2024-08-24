import {create} from 'zustand';

export const useFormStore = create((set) => ({
  jsonform: null,
  setJsonForm: (form) => set({ jsonform: form }),
}));
