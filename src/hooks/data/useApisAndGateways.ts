import { useQuery } from "@tanstack/react-query";
import { apisAndGatewaysService } from "@/services/apisAndGateways";

export function useGetApisAndGateways() {
  return useQuery({
    queryKey: ["get-apis-and-gateways"],
    queryFn: () => apisAndGatewaysService.getApisAndGateways(),
  });
}
