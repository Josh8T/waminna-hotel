import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Home from '@/pages/Home';
import RoomListing from '@/pages/RoomListing';
import RoomDetail from '@/pages/RoomDetail';
import BookingFlow from '@/pages/BookingFlow';
import BookingConfirmation from '@/pages/BookingConfirmation';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MyBookings from '@/pages/MyBookings';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import AdminOverview from '@/pages/admin/Overview';
import AdminBookings from '@/pages/admin/Bookings';
import AdminRooms from '@/pages/admin/Rooms';
import AdminUsers from '@/pages/admin/Users';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'user' | 'staff' | 'owner' }) {
  const { user, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomListing />} />
      <Route path="/rooms/:id" element={<RoomDetail />} />
      <Route path="/booking" element={<BookingFlow />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute requiredRole="user">
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="staff">
            <AdminOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute requiredRole="staff">
            <AdminBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute requiredRole="staff">
            <AdminRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRole="owner">
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
