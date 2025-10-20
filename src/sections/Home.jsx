import { useRef } from "react";
import Fetures from "../components/home/Fetures";
import About from "../components/home/About";
import IconStripe from "../components/home/IconStripe";
import Grades from "../components/home/Grades";
import Hema from "../components/home/Hema";
import { useEffect } from "react";
const Home = () => {
  const featuresRef = useRef(null);
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    document.title = "Home";
  }, []);
  return (
    <>
      <Hema
        scrollToFeatures={scrollToFeatures}
        text={["ازيك  يا باشا عامل ايه 😊", "مش كفايه لعب ويلا  نذاكر 🤓"]}
        image={"/home/hero.png"}
      />
      <About />
      <div>
        <IconStripe />
      </div>
      <div ref={featuresRef}>
        <Fetures />
      </div>
      <Grades />
    </>
  );
};

export default Home;
