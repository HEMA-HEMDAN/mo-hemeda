import { useParams, Link } from "react-router-dom";
import { Grade } from "../../const/index.js";
import Hema from "../../components/home/Hema.jsx";
import { useRef } from "react";
// import{exam1,exam2,exam3} from "../const/exams.js"
const AcademicYears = () => {
  const scrollRef = useRef();
  const { params } = useParams();
  const matchedGrade = Grade.find((grade) => grade.params === params);
  function scrollTonext() {
    scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <section>
      <div>
        <Hema
          scrollToFeatures={scrollTonext}
          text={[`${matchedGrade.name}`]}
          image={"/grades/hero.png"}
        />
      </div>
      <div ref={scrollRef}></div>
    </section>
  );
};

export default AcademicYears;
