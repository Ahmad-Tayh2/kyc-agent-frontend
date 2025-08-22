# Pagination Integration Guide

This guide explains how to integrate the new pagination system with your data tables and API calls.

## Overview

The new pagination system consists of:

1. **`usePagination`** - Basic pagination hook
2. **`usePaginationWithFilters`** - Advanced hook that integrates pagination with filters
3. **Updated `DataTable`** - Component that handles pagination UI

## Basic Usage with `usePagination`

```typescript
import { usePagination } from "@/hooks/utils/usePagination";

const MyComponent = () => {
  const pagination = usePagination({
    total: 100, // Total items from API
    perPage: 10,
    initialPage: 1,
    onPaginationChange: (page, perPage) => {
      // Handle pagination changes
      console.log(`Page: ${page}, Per Page: ${perPage}`);
    },
  });

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        enable: true,
        page: pagination.page,
        per_page: pagination.per_page,
        total: pagination.total,
        last_page: pagination.last_page,
        onChangeRowsPerPage: pagination.setPerPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        setPage: pagination.setPage,
      }}
    />
  );
};
```

## Advanced Usage with `usePaginationWithFilters`

This hook automatically integrates pagination with your filter system:

```typescript
import { usePaginationWithFilters } from "@/hooks/utils/usePagination";

const MyComponent = () => {
  const initialFilters = {
    search: "",
    status: [],
    page: "1",
    per_page: "10",
  };

  const { filters, pagination, updateFilters } = usePaginationWithFilters(
    initialFilters,
    (newFilters) => {
      // This callback is called whenever filters change
      // Use it to trigger API calls or update your filter string
      console.log("Filters updated:", newFilters);
    }
  );

  // Update specific filters
  const handleSearchChange = (search: string) => {
    updateFilters({ search }); // Automatically resets to page 1
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        enable: true,
        page: pagination.page,
        per_page: pagination.per_page,
        total: pagination.total,
        last_page: pagination.last_page,
        onChangeRowsPerPage: pagination.setPerPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        setPage: pagination.setPage,
      }}
    />
  );
};
```

## Integration with Existing Filter Hooks

### Step 1: Update your filter hook

```typescript
// Before
export const useMyFilters = () => {
  const [filters, setFilters] = useState({...});
  // ... other logic

  return { filters, /* other values */ };
};

// After
export const useMyFilters = () => {
  const { filters, pagination, updateFilters } = usePaginationWithFilters(
    {
      search: "",
      status: [],
      page: "1",
      per_page: "10",
    },
    (newFilters) => {
      // Handle filter changes (e.g., build filter string, trigger API call)
      const filterString = buildFilterString(newFilters);
      setFilterString(filterString);
    }
  );

  // Update functions that reset pagination
  const updateSearchTerm = useCallback((search: string) => {
    updateFilters({ search }); // Automatically resets to page 1
  }, [updateFilters]);

  return {
    filters,
    pagination,
    updateSearchTerm,
    // ... other functions
  };
};
```

### Step 2: Update your component

```typescript
const MyPage = () => {
  const { filters, pagination } = useMyFilters();
  const { data, isLoading } = useGetMyData(filtersString);

  const tablePagination = {
    enable: true,
    page: pagination.page,
    per_page: pagination.per_page,
    total: data?.meta?.total || 0,
    last_page: data?.meta?.last_page || 1,
    onChangeRowsPerPage: pagination.setPerPage,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
    setPage: pagination.setPage,
  };

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination={tablePagination}
      isLoading={isLoading}
    />
  );
};
```

## Key Features

1. **Automatic Page Reset**: When filters change, pagination automatically resets to page 1
2. **Filter Integration**: Pagination state is automatically included in your filter object
3. **API Ready**: Pagination parameters are ready to be sent with your API calls
4. **Reusable**: Can be used across different modules with minimal changes
5. **Type Safe**: Full TypeScript support

## Migration from Old System

1. Replace `usePagination` calls with `usePaginationWithFilters`
2. Update your filter state to include `page` and `per_page` fields
3. Remove manual pagination state management
4. Update your DataTable pagination prop structure

## Example: Complete Integration

```typescript
// hooks/useMyData.ts
export const useMyData = () => {
  const { filters, pagination, updateFilters } = usePaginationWithFilters(
    {
      search: "",
      category: "",
      page: "1",
      per_page: "10",
    },
    (newFilters) => {
      // Build filter string and trigger API call
      const filterString = buildFilterString(newFilters);
      // Your existing logic to handle filter changes
    }
  );

  const { data, isLoading } = useQuery({
    queryKey: ["my-data", filters],
    queryFn: () => myDataService.getData(filters),
  });

  return {
    data,
    isLoading,
    filters,
    pagination,
    updateFilters,
  };
};

// components/MyPage.tsx
const MyPage = () => {
  const { data, isLoading, pagination } = useMyData();

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination={{
        enable: true,
        page: pagination.page,
        per_page: pagination.per_page,
        total: data?.meta?.total || 0,
        last_page: data?.meta?.last_page || 1,
        onChangeRowsPerPage: pagination.setPerPage,
        nextPage: pagination.nextPage,
        prevPage: pagination.prevPage,
        setPage: pagination.setPage,
      }}
      isLoading={isLoading}
    />
  );
};
```

This system ensures that pagination is always in sync with your filters and API calls, making it easy to maintain and extend across your application.
