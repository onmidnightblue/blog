import { create } from "zustand";
import { SORT_CYCLE, VISIBLE_CYCLE, SELECTION_CYCLE } from "@constants";
import {
  RestaurantType,
  SortFilterType,
  TimeType,
  VisibleFilterType,
  SelectionFilterType,
} from "@types";

export interface RestaurantStoreState {
  restaurants: RestaurantType[];
  categories: string[];
  selectedCategory: string | null;
  selectedCategories: string[];
  searchTerm: string;
  sortOrder: SortFilterType;
  visibleOrder: VisibleFilterType;
  targetTimeFilter: TimeType | null;
  visibleCount: number;
  isRoomRequired: boolean;
  isCourseRequired: boolean;
  selectionOrder: SelectionFilterType;
}

interface RestaurantStoreActions {
  setFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    value: RestaurantStoreState[K]
  ) => void;
  cycleFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    cycle: RestaurantStoreState[K][]
  ) => void;
  resetFilters: () => void;
  loadMore: () => void;
  setTargetTimeFilter: (filter: TimeType | null) => void;
  toggleCategory: (category: string) => void;
}

export const useRestaurantStore = create<
  RestaurantStoreState & RestaurantStoreActions
>((set) => ({
  // states
  restaurants: [],
  categories: [],
  selectedCategory: null,
  selectedCategories: [],
  searchTerm: "",
  sortOrder: SORT_CYCLE[0],
  visibleOrder: VISIBLE_CYCLE[0],
  selectionOrder: SELECTION_CYCLE[0],
  targetTimeFilter: null,
  visibleCount: 20,
  isRoomRequired: false,
  isCourseRequired: false,

  // actions
  setFilter: (key, value) =>
    set(() => {
      const newState: Partial<RestaurantStoreState> = {
        [key]: value,
      };
      if (key !== "restaurants") {
        newState.visibleCount = 20;
      }
      if (key === "restaurants" && Array.isArray(value)) {
        const restaurants = value as RestaurantType[];
        const uniqueCategories = Array.from(
          new Set(
            restaurants
              .filter((r) => r.is_visible && r.status_number === "01")
              .map((r) => r.category)
              .filter(Boolean)
          )
        ).sort();
        newState.categories = uniqueCategories;
      }
      return newState;
    }),

  cycleFilter: <K extends keyof RestaurantStoreState>(
    key: K,
    cycle: RestaurantStoreState[K][]
  ) =>
    set((state) => {
      const currentIndex = cycle.indexOf(state[key]);
      const nextIndex = (currentIndex + 1) % cycle.length;
      return {
        [key]: cycle[nextIndex],
        visibleCount: 20,
      } as Partial<RestaurantStoreState & RestaurantStoreActions>;
    }),

  loadMore: () => set((state) => ({ visibleCount: state.visibleCount + 20 })),

  resetFilters: () =>
    set({
      selectedCategory: null,
      searchTerm: "",
      sortOrder: SORT_CYCLE[0],
      visibleCount: 20,
      isRoomRequired: false,
      isCourseRequired: false,
    }),

  toggleCategory: (category) =>
    set((state) => {
      // const nextCategory =
      //   !title || state.selectedCategory === title ? null : title;
      // return { selectedCategory: nextCategory, visibleCount: 20 };

      if (category === "") return { selectedCategories: [], visibleCount: 20 };
      const isSelected = state.selectedCategories.includes(category);
      const nextCategories = isSelected
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category];
      return { selectedCategories: nextCategories, visibleCount: 20 };
    }),

  setTargetTimeFilter: (filter) =>
    set({ targetTimeFilter: filter, visibleCount: 20 }),
}));
