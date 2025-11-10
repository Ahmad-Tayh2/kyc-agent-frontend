import { payoutLocationService } from '@/services/payoutLocation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export const usePayoutLocations = (filtersString?: string) => {
  return useQuery({
    queryKey: ['payoutLocations', filtersString],
    queryFn: () => payoutLocationService.getPayoutLocations(filtersString),
  });
};

/**
 * Hook for infinite scrolling payout locations with filters support
 * @param filtersString - Filter string for payout locations (should start with ?)
 * @param enabled - Whether the query should be enabled
 */
export const useInfinitePayoutLocations = (
  filtersString: string = '',
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: ['infinite-payout-locations', filtersString],
    queryFn: async ({ pageParam = 1 }) => {
      // Remove any existing page parameter from filtersString to avoid duplicates
      let cleanFilters = filtersString;
      if (cleanFilters) {
        // Remove page parameter if it exists
        cleanFilters = cleanFilters.replace(/[&?]page=\d+/g, '');
        // Clean up any double & or trailing &
        cleanFilters = cleanFilters.replace(/&&/g, '&').replace(/&$/, '');
      }

      // Build the final filter string with the current page
      let filters: string;
      if (!cleanFilters || cleanFilters === '' || cleanFilters === '?') {
        filters = `?page=${pageParam}`;
      } else if (cleanFilters.startsWith('?')) {
        filters = `${cleanFilters}&page=${pageParam}`;
      } else {
        filters = `?${cleanFilters}&page=${pageParam}`;
      }

      return await payoutLocationService.getPayoutLocations(filters);
    },
    getNextPageParam: (lastPage) => {
      // Assuming the API returns pagination info in the meta object
      if (lastPage?.meta?.current_page < lastPage?.meta?.last_page) {
        return lastPage.meta.current_page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });
};
