import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import AIChatWidget from './components/AIChatWidget'; // <-- ADDED: Import AI Chat Widget

import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ContactUs from './pages/ContactUs';
import BookInterpreter from './pages/BookInterpreter';
import VideoInterpretation from './pages/VideoInterpretation';
import VideoBooking from './pages/VideoBooking';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Wallet from './pages/Wallet';
import Reviews from './pages/Reviews';
import FAQ from './pages/FAQ';
import Languages from './pages/Languages';
import CorporatePortal from './pages/CorporatePortal';
import CorporateDashboard from './pages/CorporateDashboard';
import ClientPortal from './pages/ClientPortal';
import ClientDashboard from './pages/ClientDashboard';
import InterpreterPortal from './pages/InterpreterPortal';
import InterpreterDashboard from './pages/InterpreterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Careers from './pages/Careers';
import Blog from './pages/Blog';
import CallInterpreter from './pages/CallInterpreter';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/book" element={<BookInterpreter />} />
        <Route path="/video" element={<VideoInterpretation />} />
        <Route path="/video-booking" element={<VideoBooking />} />
        <Route path="/plans" element={<SubscriptionPlans />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/corporate-portal" element={<CorporatePortal />} />
        <Route path="/corporate-dashboard" element={<CorporateDashboard />} />
        <Route path="/client-portal" element={<ClientPortal />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/interpreter-portal" element={<InterpreterPortal />} />
        <Route path="/interpreter-dashboard" element={<InterpreterDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/call-interpreter" element={<CallInterpreter />} />
      </Routes>
      
      {/* GLOBAL FLOATING WIDGETS */}
      <WhatsAppButton /> 
      <AIChatWidget /> {/* <-- ADDED: Renders globally on all pages */}
    </Router>
  );
}

export default App;