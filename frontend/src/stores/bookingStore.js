import { create } from 'zustand'

export const useBookingStore = create((set) => ({
  activeBooking: null,
  bookingHistory: [],
  
  setActiveBooking: (booking) => set({ activeBooking: booking }),
  
  updateBooking: (booking) => set({ activeBooking: booking }),
  
  clearActiveBooking: () => set({ activeBooking: null }),
  
  addToHistory: (booking) => set((state) => ({
    bookingHistory: [...state.bookingHistory, booking]
  })),
}))
