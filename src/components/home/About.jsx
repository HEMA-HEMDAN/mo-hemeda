import React from "react";

const About = () => {
  return (
    <section className="relative z-20 -mt-10 md:-mt-16 mb-10 md:mb-20">
      <div className="mx-3 md:mx-8">
        <div className="rounded-[28px] bg-[#1b232e] text-gray-200 shadow-2xl border border-white/10 px-6 md:px-10 py-10 md:py-14 relative overflow-hidden">
          {/* chrome stars placeholders */}
          <div className="hidden md:block absolute -left-6 top-1/2 -translate-y-1/2 opacity-70">
            <img src="/features/brain.png" alt="decor-left" className="w-24 h-24 object-contain rotate-12" />
          </div>
          <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 opacity-70">
            <img src="/features/lamp.png" alt="decor-right" className="w-24 h-24 object-contain -rotate-12" />
          </div>

          <h2 className="text-center text-white text-2xl md:text-3xl font-extrabold tracking-wide mb-4">About Us</h2>
          <p className="text-center text-gray-300/90 max-w-3xl mx-auto leading-7">
          أوفر دوز ماث بتساعد الطلبة يتقنوا الرياضيات من خلال دروس تفاعلية، وتمارين منظمة، وشرح بسيط وواضح. إحنا بنجمع بين التصميم العصري وطريقة التدريس الفعّالة علشان الطلبة يفضلوا متحمسين ويتقدموا خطوة بخطوة.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;


