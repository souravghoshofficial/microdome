import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import examsData from "../assets/examsData";
import ExamCard from "../components/ExamCard";
import { Helmet } from "react-helmet-async";

const Exam = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 120 });
  }, []);

  return (
    <>
      <Helmet>
        <title>Exams & Colleges | Microdome Classes</title>
        <meta
          name="description"
          content="Explore exams like IIT JAM, GAT-B, CUET-PG and discover colleges and courses available through each exam."
        />
      </Helmet>

      <section className="py-32 px-6 md:px-12 lg:px-24 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Heading */}
          <div className="text-center space-y-3" data-aos="fade-down">
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
              Exams & <span className="text-highlighted">Colleges</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Explore top national entrance exams and discover the{" "}
              <span className="font-semibold">colleges & courses</span>{" "}
              available through each exam.
            </p>
          </div>

          {/* Exam Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {examsData.map((exam, index) => (
              <ExamCard key={index} exam={exam} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Exam;
