import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LayoutApp from './layout/LayoutApp.jsx'
import LoginPage from './pages/login/LoginPage.jsx'
import ProtectedRouteComponent from './pages/login/ProtectedRouteComponent.jsx'
import AuthProvider from './pages/login/AuthProvider.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FooPage from './pages/foo/index.jsx'
import HomePage from './pages/homePage/index.jsx'
import { App } from 'antd'
import AppErrorBoundary from "./common/components/ErrorBoundary/AppErrorBoundary";
import "./i18n.js"
import styles from "../src/pages/login/styles/LoginPage.module.css"

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

                <Route
                  path="/homePage"
                  element={<HomePage />}
                />

                <Route
                  path="/fooPage"
                  element={<FooPage />}
                />

              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </AppErrorBoundary>
    </App>
  </StrictMode>,
)
