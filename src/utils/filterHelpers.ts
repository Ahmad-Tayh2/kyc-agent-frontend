import { buildFilterString } from "./queryHelpers";

export interface BaseFilterState {
  search_term?: string;
}

export interface BaseFilterActions<T> {
  filters: T;
  filtersString: string;
  updateSearchTerm: (term: string) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  hasActiveFilters?: boolean;
}

export function createFilterReset<T extends BaseFilterState>(
  filters: T,
  setFilters: (filters: T) => void,
  setFilterString: (filterString: string) => void,
  keepFields: (keyof T)[] = ['search_term']
) {
  return () => {
    const keptValues: Partial<T> = {};
    keepFields.forEach(field => {
      if (filters[field] !== undefined && filters[field] !== null && filters[field] !== '') {
        keptValues[field] = filters[field];
      }
    });

    const resetFilters = { ...filters };
    Object.keys(resetFilters).forEach(key => {
      if (!keepFields.includes(key as keyof T)) {
        if (Array.isArray(resetFilters[key as keyof T])) {
          resetFilters[key as keyof T] = [] as any;
        } else if (typeof resetFilters[key as keyof T] === 'string') {
          resetFilters[key as keyof T] = '' as any;
        } else {
          resetFilters[key as keyof T] = undefined as any;
        }
      }
    });

    setFilters(resetFilters);

    // Build filter string with kept values
    const filterString = buildFilterString(keptValues);
    setFilterString(filterString);
  };
}

export function createFilterApply<T extends Record<string, any>>(
  filters: T,
  setFilterString: (filterString: string) => void
) {
  return () => {
    const filterString = buildFilterString(filters);
    setFilterString(filterString);
  };
}

export function createHasActiveFilters<T extends Record<string, any>>(filters: T, excludeFields: (keyof T)[] = ['search_term']) {
  return Object.entries(filters).some(([key, value]) => {
    if (excludeFields.includes(key as keyof T)) {
      return false;
    }
    
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    
    if (typeof value === 'string') {
      return value !== '';
    }
    
    return value !== undefined && value !== null;
  });
} 