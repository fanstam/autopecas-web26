import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SubscriptionExpired from "@/pages/SubscriptionExpired";
import Dashboard from "@/pages/Dashboard";
import Sales from "@/pages/Sales";
import Products from "@/pages/Products";
import Stock from "@/pages/Stock";
import Customers from "@/pages/Customers";
import Appointments from "@/pages/Appointments";
import Financial from "@/pages/Financial";
import Reports from "@/pages/Reports";
import AdminSubscriptions from "@/pages/AdminSubscriptions";
import Settings from "@/pages/Settings";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster theme="dark" position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/subscription-expired" element={<SubscriptionExpired />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
