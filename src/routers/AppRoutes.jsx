
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/homePage";
//import { Layout } from "antd";
import App from "../layout/App";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>

          <Route
            index
            element={<HomePage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
