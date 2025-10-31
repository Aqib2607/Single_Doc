import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import MedicineTestsPage from "./pages/MedicineTestsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import MedicalRecords from "./pages/MedicalRecords";
import Prescriptions from "./pages/Prescriptions";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AppointmentPage from "./pages/AppointmentPage";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorConsultations from "./pages/doctor/DoctorConsultations";
import DoctorRecords from "./pages/doctor/DoctorRecords";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";
import DoctorMessages from "./pages/doctor/DoctorMessages";
import DoctorMedicineTests from "./pages/doctor/DoctorMedicineTests";
import DoctorBlogs from "./pages/doctor/DoctorBlogs";
import DoctorGallery from "./pages/doctor/DoctorGallery";
import NotFound from "./pages/NotFound";
import FloatingButtons from "@/components/FloatingButtons";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
            <Route path="/" element={<Index />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/medicine-tests" element={<MedicineTestsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/medical-records" element={<MedicalRecords />} />
              <Route path="/prescriptions" element={<Prescriptions />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/appointment" element={<AppointmentPage />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/consultations" element={<DoctorConsultations />} />
              <Route path="/doctor/records" element={<DoctorRecords />} />
              <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
              <Route path="/doctor/messages" element={<DoctorMessages />} />
              <Route path="/doctor/medicine-tests" element={<DoctorMedicineTests />} />
              <Route path="/doctor/blogs" element={<DoctorBlogs />} />
              <Route path="/doctor/gallery" element={<DoctorGallery />} />
              <Route path="/doctor/schedules" element={<DoctorAppointments />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingButtons />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
