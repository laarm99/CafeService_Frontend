import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../layout/LayoutApp";
import HomePage from "../pages/homePage";
import MultiFormatGridPage from "../pages/multiFormatPage";
import MultiFormatDetailPage from "../pages/multiFormatPage/[multiFormatId]";
import MultiFormatFormPage from "../pages/addMultiFormatPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<App />}>

          <Route index element={<HomePage />} />

          <Route path="multiFormat" element={<MultiFormatGridPage />} />

          <Route path="multiFormat/new" element={<MultiFormatFormPage />} />

          <Route path="multiFormat/:multiFormatId" element={<MultiFormatDetailPage />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
