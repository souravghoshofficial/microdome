import React from "react";

const Landing = () => {
  return (
    <div className="mt-48 w-full flex items-center justify-center">
      <div className="w-[90%] flex flex-col items-center justify-center">
        <div className="mt-4 w-[60%]">
          <h1 className="text-center text-6xl font-bold">Unlock Your Potential With Microdome Classes</h1>
        </div>
        <div className="mt-4 w-[50%]">
          <p className="text-center ">
            At Microdome Classes, we specialize in online coaching for M.Sc
            entrance exams, including IIT JAM and CUET PG. Our comprehensive
            courses provide students with the tools they need to excel in their
            biology studies and achieve their academic goals.
          </p>
        </div>
        <div className="mt-4 w-[50%] flex items-center justify-center gap-4">
          <a href="#" className="px-4 py-2 bg-black border border-black text-white">Enroll</a>
          <a href="#" className="px-4 py-2 border">Learn More</a>
        </div>
        <div className="w-full mt-16">
        <iframe className="w-full h-[620px]" src="https://www.youtube.com/embed/P-gZSzOaPp0?si=tMeyJUu-AEjK0B0H" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </div>
    </div>
  );
};

export default Landing;
