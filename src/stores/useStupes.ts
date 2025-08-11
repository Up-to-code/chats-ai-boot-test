import { create } from "zustand";

interface Stupes {
  step: number;
  totalSteps: number;
  userType: string;
  name: string;
  email: string;
  password: string;
  setStep: (step: number) => void;
  nextStep: () => void;
  setUserType: (type: string) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  reset: () => void;
}

export const useStupes = create<Stupes>((set, get) => ({
  step: 1,
  totalSteps: 4,
  userType: "",
  name: "",
  email: "",
  password: "",
  setStep: (step) => set({ step }),
  nextStep: () => {
    const { step, totalSteps } = get();
    if (step < totalSteps) {
      set({ step: step + 1 });
    }
  },
  setUserType: (type) => set({ userType: type }),
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  reset: () =>
    set({
      step: 1,
      totalSteps: 4,
      userType: "",
      name: "",
      email: "",
      password: "",
    }),
}));
