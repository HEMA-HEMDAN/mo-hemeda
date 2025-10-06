import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Book from "./Book.jsx";
import { services } from "../../const/index.js";

const Scene = ({ isMobile }) => {
  const ref = useRef();
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <hemisphereLight args={[0x0099ff, 0xaa5500, 1]} position={[0, 5, 0]} />
      <ambientLight intensity={0.5} />
      <group position={[0, 0, 0]} scale={0.02} ref={ref}>
        <Book />
      </group>
      {!isMobile && <OrbitControls enableZoom={false} />}
    </>
  );
};

const Fetures = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollRef = useRef(null);
  const href = useRef(null);

  return (
    <section>
      <div
        className="flex justify-center flex-row my-10 text-center items-center gap-10 text-black dark:text-white"
        ref={href}
      >
        <div className="w-1/4 md:w-1/3">
          <Canvas
            camera={{
              position: isMobile ? [0, 0, 13] : [0, 0, 9],
              fov: isMobile ? 70 : 65,
            }}
            style={{
              height: isMobile ? "100%" : "30vh",
              width: "100%",
            }}
          >
            <Scene isMobile={isMobile} />
          </Canvas>
        </div>

        <h1 className="text-3xl md:text-7xl text-black dark:text-white">
          <span className="text-blue-500">?..</span> خدماتنا
        </h1>
      </div>

      <div
        className="flex flex-col lg:flex-row gap-10 items-center justify-center"
        ref={scrollRef}
      >
        {services.map((service) => (
          <div
            key={service.id}
            className="w-[300px] md:w-[350px] h-[300px] md:h-[350px] flex flex-col items-center justify-center text-center gap-10 p-5 mx-5 rounded-3xl bg-no-repeat bg-cover bg-contain"
            style={{ backgroundImage: `url(${service.bg})` }}
          >
            <img src={service.icon} className="card w-30 md:w-40" alt="" />
            <h1 className="text-2xl md:text-3xl text-white">
              {service.description}
            </h1>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Fetures;
