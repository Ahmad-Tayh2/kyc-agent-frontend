import { BrowserRouter as Router } from "react-router-dom";

import { DashboardLayout } from "./layouts/DashboardLayout";
import { AppRoutes } from "./routes";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <AppRoutes />
      </DashboardLayout>
    </Router>
  );
}

export default App;
