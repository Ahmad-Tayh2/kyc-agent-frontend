import {
  useQuery /*, useMutation, useQueryClient */,
} from "@tanstack/react-query";
// import { toast } from "sonner";

import {
  recipientsService,
  //   type CustomerSearchParams,
  //   type CustomerCreateData,
  //   type CustomerIdentityFileData,
  //   type CustomerIncomeFileData,
} from "@/services/recipients";
// import { ROUTES } from "@/constants/routes";
// import { useNavigate } from "react-router-dom";

export function useRecipients(filters: string) {
  return useQuery({
    queryKey: ["get-recipients", filters],
    queryFn: () => recipientsService.getRecipients(filters),
  });
}
