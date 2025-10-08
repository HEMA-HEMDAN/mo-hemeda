import Typewriter from "./Text";

const Hema = ({ scrollToFeatures, text, image }) => {
  return (
    <>
      <div className="relative flex flex-col lg:flex-row items-center justify-end  gap-5 lg:gap-15  pb-10 lg:pb-0 min-h-screen overflow-hidden w-full">
        <div
          id="home"
          className="flex items-center justify-center absolute top-0 left-0 right-0 lg:w-1/2  z-[-1]"
        >
          <img
            src={image}
            alt=""
            className="h-[50vh] lg:h-[80vh] object-cover rounded-full hover:scale-105 transition-transform duration-500 mt-20"
          />
        </div>
        <video
          src="/home/bgVed1.mp4"
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-[-2] opacity-50"
        ></video>
        <div
          id="text"
          className="flex items-center justify-center flex-col h-full lg:w-1/2 p-4"
        >
          <h1 className="split text-4xl lg:text-6xl text-white mb-5 lg:mb-10 text-center lg:text-right">
            <span className="text-black dark:text-white"> الاستاذ </span>
            <span className="bg-[linear-gradient(to_bottom,#a3c20b_0%,#c5f10f_50%,#e0ff4f_100%)] bg-clip-text text-transparent">
              محمد حميده
            </span>
          </h1>

          <Typewriter texts={text} />

          <div
            onClick={scrollToFeatures}
            className="shake flex items-center justify-center bg-[linear-gradient(to_bottom,#121821_0%,#1b232e_40%,#141b24_64%,#0f141b_100%)] py-2 px-4 md:px-6 rounded-lg mt-5 md:mt-10
             text-white text-lg md:text-2xl font-bold hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer"
          >
            <img
              src="/home/yala-pena.png"
              alt=""
              className="w-8 md:w-12 mr-4"
            />
            <button className="bg-[linear-gradient(to_bottom,#a3c20b_0%,#c5f10f_60%,#e0ff4f_100%)] bg-clip-text text-transparent text-white">
              يلا بينا
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hema;
