import { useQuery } from "@tanstack/react-query";

import { remittanceMethodService } from "@/services/remittanceMethod";

export function useGetRemittanceMethods() {
  return useQuery({
    queryKey: ["get-all-remittance-methods"],
    queryFn: () => remittanceMethodService.getRemittanceMethods(),
  });
}
