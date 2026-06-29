import { create } from "zustand";
import type { ChannelWithMeta, FilterState } from "./types";

interface AppState {
  // Player
  currentChannel: ChannelWithMeta | null;
  playerOpen: boolean;
  setCurrentChannel: (channel: ChannelWithMeta | null) => void;
  openPlayer: (channel: ChannelWithMeta) => void;
  closePlayer: () => void;

  // Favorites
  favorites: string[];
  _favoritesHydrated: boolean;
  hydrateFavorites: () => void;
  toggleFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;

  // Filters
  filters: FilterState;
  setSearch: (search: string) => void;
  setCountryFilter: (countries: string[]) => void;
  setCategoryFilter: (categories: string[]) => void;
  setLanguageFilter: (languages: string[]) => void;
  clearFilters: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // View
  activeView: "home" | "countries" | "categories" | "languages" | "favorites" | "sports";
  setActiveView: (
    view: "home" | "countries" | "categories" | "languages" | "favorites" | "sports"
  ) => void;

  // All channels (for navigation)
  allChannels: ChannelWithMeta[];
  setAllChannels: (channels: ChannelWithMeta[]) => void;

  // User country (detected via IP)
  userCountry: string | null;
  userCountryName: string | null;
  userCountryFlag: string | null;
  setUserCountry: (code: string, name: string, flag: string) => void;
}

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("worldflix-favorites");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("worldflix-favorites", JSON.stringify(favorites));
}

export const useAppStore = create<AppState>((set, get) => ({
  // Player
  currentChannel: null,
  playerOpen: false,
  setCurrentChannel: (channel) => set({ currentChannel: channel }),
  openPlayer: (channel) =>
    set({ currentChannel: channel, playerOpen: true }),
  closePlayer: () => set({ playerOpen: false }),

  // Favorites (start empty, hydrate on client)
  favorites: [],
  _favoritesHydrated: false,
  hydrateFavorites: () => {
    if (get()._favoritesHydrated) return;
    set({ favorites: loadFavorites(), _favoritesHydrated: true });
  },
  toggleFavorite: (channelId) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(channelId)
      ? favorites.filter((id) => id !== channelId)
      : [...favorites, channelId];
    saveFavorites(newFavorites);
    set({ favorites: newFavorites });
  },
  isFavorite: (channelId) => get().favorites.includes(channelId),

  // Filters
  filters: {
    search: "",
    countries: [],
    categories: [],
    languages: [],
  },
  setSearch: (search) =>
    set((state) => ({ filters: { ...state.filters, search } })),
  setCountryFilter: (countries) =>
    set((state) => ({ filters: { ...state.filters, countries } })),
  setCategoryFilter: (categories) =>
    set((state) => ({ filters: { ...state.filters, categories } })),
  setLanguageFilter: (languages) =>
    set((state) => ({ filters: { ...state.filters, languages } })),
  clearFilters: () =>
    set({
      filters: { search: "", countries: [], categories: [], languages: [] },
    }),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // View
  activeView: "home",
  setActiveView: (view) => set({ activeView: view }),

  // All channels
  allChannels: [],
  setAllChannels: (channels) => set({ allChannels: channels }),

  // User country
  userCountry: null,
  userCountryName: null,
  userCountryFlag: null,
  setUserCountry: (code, name, flag) =>
    set({ userCountry: code, userCountryName: name, userCountryFlag: flag }),
}));
