import { useQuery } from "@tanstack/react-query";

import { remittanceCartsService } from "@/services/remittanceCart";

export function useGetRemittanceCarts() {
  return useQuery({
    queryKey: ["get-remittance-carts"],
    queryFn: () => remittanceCartsService.getRemittanceCarts(),
  });
}
