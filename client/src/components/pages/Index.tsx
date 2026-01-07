import Hero from "../LandingPage/Hero";
import Features from "../LandingPage/Features";
import HowItWorks from "../LandingPage/HowItWorks";
import Footer from "../LandingPage/Footer";

const Index = () => {
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
