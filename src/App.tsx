import { BookingProvider } from "./context/BookingContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Services } from "./sections/Services";
import { Booking } from "./sections/Booking";
import { Reviews } from "./sections/Reviews";
import { FAQ } from "./sections/FAQ";
import { Contacts } from "./sections/Contacts";
import { Footer } from "./sections/Footer";
import { Chatbot } from "./components/Chatbot";
import { FloatingCTA } from "./components/FloatingCTA";
import { BookingToasts } from "./components/BookingToasts";

export default function App() {
  return (
    <BookingProvider>
      <div className="relative">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Booking />
          <Reviews />
          <FAQ />
          <Contacts />
        </main>
        <Footer />
        <Chatbot />
        <FloatingCTA />
        <BookingToasts />
      </div>
    </BookingProvider>
  );
}
