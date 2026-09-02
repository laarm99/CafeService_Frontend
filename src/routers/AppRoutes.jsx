
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage";
//import { Layout } from "antd";
import App from "../layout/LayoutApp";
import RequisitionGridPage from "../pages/requisition/[requisitionId]";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>

          <Route
            index
            element={<HomePage />}
          />

          <Route
          path="requisition/:id"
          element={<RequisitionGridPage/>}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
