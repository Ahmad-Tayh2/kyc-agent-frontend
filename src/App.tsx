import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster, type ToasterProps } from "sonner";
import { SessionProvider } from "@/components/shared/SessionProvider";

// Create a client outside the component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const ToasterPropss: ToasterProps = {
  position: "top-center",
  toastOptions: {
    duration: 3000,
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SessionProvider>
          <AppRoutes />
          <Toaster {...ToasterPropss} />
        </SessionProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
