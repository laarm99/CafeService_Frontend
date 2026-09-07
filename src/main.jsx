import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LayoutApp from './layout/LayoutApp.jsx'
import LoginPage from './pages/login/LoginPage.jsx'
import ProtectedRouteComponent from './pages/login/ProtectedRouteComponent.jsx'
import AuthProvider from './pages/login/AuthProvider.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/homePage/index.jsx'
import MultiFormatGridPage from './pages/multiFormatPage/index.jsx'
import MultiFormatDetailPage from './pages/multiFormatPage/[multiFormatId].jsx'
import MultiFormatFormPage from './pages/addMultiFormatPage/index.jsx'
import { App } from 'antd'
import AppErrorBoundary from "./common/components/ErrorBoundary/AppErrorBoundary";
import "./i18n.js"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App>
      <AppErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Ruta de Login */}
              <Route path="/login" element={<LoginPage />} />

              <Route path="/" element={
                <ProtectedRouteComponent>
                  <LayoutApp />
                </ProtectedRouteComponent>
              } >

                <Route index element={<Navigate to="/homePage" replace />} />

                <Route
                  path="/homePage"
                  element={<HomePage />}
                />

                {/* Formato Multiple */}
                <Route
                  path="/multiFormat"
                  element={<MultiFormatGridPage />}
                />

                <Route
                  path="/multiFormat/new"
                  element={<MultiFormatFormPage />}
                />

                <Route
                  path="/multiFormat/:multiFormatId"
                  element={<MultiFormatDetailPage />}
                />

                {/* Rutas anteriores: se conservan como redireccion para no romper enlaces guardados */}
                <Route path="/requisition" element={<Navigate to="/multiFormat" replace />} />
                <Route path="/add-requisition" element={<Navigate to="/multiFormat/new" replace />} />

              </Route>

              {/* Cualquier otra ruta cae al inicio */}
              <Route path="*" element={<Navigate to="/homePage" replace />} />

            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AppErrorBoundary>
    </App>
  </StrictMode>,
)
