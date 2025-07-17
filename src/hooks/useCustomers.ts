import { useQuery } from "@tanstack/react-query";
import { customersService } from "@/services/customers";

export function useGetCustomers(filters: string) {
  return useQuery({
    queryKey: ["get-customers", filters],
    queryFn: () => customersService.getCustomers(filters),
  });
}
