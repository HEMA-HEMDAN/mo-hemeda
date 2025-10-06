import { useRef } from "react";
import Fetures from "../components/home/Fetures";
import Grades from "../components/home/Grades";
import Hema from "../components/home/Hema";
import Loading from "../components/rusable/Loading";
const Home = () => {
  const featuresRef = useRef(null);
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Loading />
      <Hema
        scrollToFeatures={scrollToFeatures}
        text={["ازيك  يا باشا عامل ايه 😊", "مش كفايه لعب ويلا  نذاكر 🤓"]}
        image={"/home/hero.png"}
      />
      <div ref={featuresRef}>
        <Fetures />
      </div>
      <Grades />
    </>
  );
};

export default Home;
