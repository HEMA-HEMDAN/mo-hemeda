import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const icons = [
  "🎮",
  "📱",
  "🧠",
  "🎲",
  "📊",
  "🧩",
  "👾",
  "🛰️",
  "⚙️",
  "🎧",
  "💡",
  "🚀",
];

const IconStripe = () => {
  const mobileTrackRef = useRef(null);
  const desktopTrackRef = useRef(null);

  useGSAP(() => {
    const setup = (el) => {
      if (!el) return null;
      const halfWidth = el.scrollWidth / 2;
      return gsap.to(el, {
        x: -halfWidth,
        ease: "none",
        duration: 15,
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % -halfWidth),
        },
      });
    };

    // Only animate the visible track
    const mobileTrack = mobileTrackRef.current;
    const desktopTrack = desktopTrackRef.current;

    let tl = null;
    if (window.innerWidth < 768 && mobileTrack) {
      tl = setup(mobileTrack);
    } else if (window.innerWidth >= 768 && desktopTrack) {
      tl = setup(desktopTrack);
    }

    return () => tl && tl.kill();
  }, []);

  return (
    <div className="relative  w-[100vw] ">
      {/* Mobile version (last update): fixed-height wrapper, absolute centered band */}
      <div className="block md:hidden relative overflow-hidden h-24">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[135vw] bg-white text-[#1b232e] rotate-2 px-10 py-6 select-none origin-center shadow-xl">
          <div className="whitespace-nowrap flex items-center">
            <div
              ref={mobileTrackRef}
              className="inline-flex gap-10 text-xl will-change-transform"
            >
              {Array.from({ length: 2 }).map((_, idx) => (
                <React.Fragment key={idx}>
                  {icons.map((ic, i) => (
                    <span key={`${idx}-m-${i}`} className="opacity-90">
                      {ic}
                    </span>
                  ))}
                  {icons.map((ic, i) => (
                    <span key={`dup-${idx}-m-${i}`} className="opacity-90">
                      {ic}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop version (first approach): overflow-visible wide band */}
      <div className="hidden md:block relative overflow-visible">
        <div className="relative left-1/2 -translate-x-1/2 w-[130vw] bg-white text-[#1b232e] rotate-2 px-16 py-8 select-none origin-center shadow-xl">
          <div className="whitespace-nowrap flex items-center">
            <div
              ref={desktopTrackRef}
              className="inline-flex gap-12 text-2xl will-change-transform"
            >
              {Array.from({ length: 2 }).map((_, idx) => (
                <React.Fragment key={idx}>
                  {icons.map((ic, i) => (
                    <span key={`${idx}-d-${i}`} className="opacity-90">
                      {ic}
                    </span>
                  ))}
                  {icons.map((ic, i) => (
                    <span key={`dup-${idx}-d-${i}`} className="opacity-90">
                      {ic}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* shadow divider below */}
      {/* <div className="h-8 -mt-2 bg-[#0f141b]"></div> */}
    </div>
  );
};

export default IconStripe;
