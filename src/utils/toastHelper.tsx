import type { FormattedApiError } from "@/types/apiErrors";
import { toast } from "sonner";

export function toastError(err: FormattedApiError) {
  toast.error(
    <div>
      <div className="font-bold text-10">Error</div>
      {err?.message && <div>{err?.message}</div>}
    </div>,
    {
      style: {
        display: "flex",
        alignItems: "flex-start",
        background: "#ffdadaff",
        color: "#ff6467",
        fontWeight: "bold",
        border: "1px solid #ff6467",
        borderRadius: "12px",
        fontSize: "normal",
      },
      duration: 5000, // optional
    },
  );
}
