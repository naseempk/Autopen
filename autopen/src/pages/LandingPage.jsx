import React from "react";
import FeatureImage from "../assets/feature-image.png"; 
import HowItWorksImage from "../assets/how-it-works.png"; 
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center scroll-smooth  ">
      
      <section className="w-full text-center py-20 bg-[#F9FAFB] text-[#1F2937]">
        <h1 className="text-4xl font-bold">Unleash Your Creativity with AI</h1>
        <p className="mt-4 text-lg">Enhance your writing with AutoPen, your AI-powered assistant.</p>
        <button className="mt-6 bg-[#4F46E5] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#4338CA]">
          <a href="#cta">Get Started</a> 
        </button>
      </section>

      {/* Features Section */}
      <section className="w-3/4 my-12 flex items-center bg-gradient-to-r from-[#F9FAFB] to-[#E5E7EB] p-8 rounded-lg shadow-md">
        <img src={FeatureImage} alt="Features" className="w-2/7" />
        <div className="ml-30 w-1/2 text-[#1F2937]">
          <h2 className="text-2xl font-bold">Why Choose AutoPen?</h2>
          <p className="mt-2 text-gray-600">Discover how AutoPen can improve your writing.</p>
          <ul className="mt-4 space-y-2">
            <li className="text-[#22C55E] font-semibold">✓ AI-Powered Suggestions</li>
            <li className="text-[#22C55E] font-semibold">✓ Grammar & Tone Check</li>
            <li className="text-[#22C55E] font-semibold">✓ Overcome Writer's Block</li>
          </ul>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-3/4 my-12 flex items-center bg-white p-8 rounded-lg shadow-md">
        <div className="w-1/2 text-[#1F2937]">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="flex mt-6 space-x-5">
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-[#4F46E5] text-white rounded-full font-bold">1</div>
              <p className="mt-2 text-sm">Sign Up</p>
            </div>
            <div className="w-1/6 h-1 bg-[#22C55E] self-center"></div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-[#4F46E5] text-white rounded-full font-bold">2</div>
              <p className="mt-2 text-sm">Start Writing</p>
            </div>
            <div className="w-1/6 h-1 bg-[#22C55E] self-center"></div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center bg-[#4F46E5] text-white rounded-full font-bold">3</div>
              <p className="mt-2 text-sm">Refine & Publish</p>
            </div>
          </div>
        </div>
        <img src={HowItWorksImage} alt="How It Works" className="w-2/7 ml-25" />
      </section>

      {/* Testimonials Section */}
      <section className="w-3/4 my-12 bg-[#F9FAFB] p-8 rounded-lg shadow-md text-[#1F2937]">
        <h2 className="text-2xl font-bold">What Writers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p className="text-gray-500">"AutoPen transformed the way I write. Highly recommended!"</p>
            <h4 className="mt-2 font-semibold">- Alex, Novelist</h4>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p className="text-gray-500">"Fantastic AI-powered tool for content creation!"</p>
            <h4 className="mt-2 font-semibold">- Sarah, Content Creator</h4>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full text-center py-10 bg-[#F9FAFB] text-[#1F2937]" id="cta">
        <h2 className="text-2xl font-bold">Start Writing Smarter with AutoPen</h2>
        <div className="mt-4 space-x-4">
          <button onClick={() => navigate("/signup")}
          className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#4338CA]">
            Sign Up
          </button>
          <button onClick={() => navigate("/login")} 
          className="bg-[#22C55E] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-[#16A34A]">
            Login
          </button>

        </div>
      </section>
    </div>
  );
};

export default LandingPage;
