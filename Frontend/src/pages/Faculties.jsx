import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import sayanImg from "../assets/sayanpic.png";
import rupayanImg from "../assets/Rupayanpic.png";
import subhadeepImg from "../assets/Subhadeep.png";
import akashImg from "../assets/Akashpic.jpg";
import krishnenduImg from "../assets/krishnendupic.jpg";

const faculties = [
  {
    id: 1,
    facultyName: "Sayan Ganguly",
    facultyTitle: "Founder Of Microdome Classes | Life Science Researcher",
    facultyImage: sayanImg,
    facultyDescription:
      "Sayan holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya and an M.Sc. in Virology from ICMR-National Institute of Virology, Pune. He has qualified top national-level exams including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE. He received admission offers from reputed institutions like Pondicherry University, BHU, SPPU, and ICMR-NIV.",
    experties: ["Molecular Biology", "Cell Biology", "Bio-Physics Techniques"],
  },
  {
    id: 2,
    facultyName: "Rupayan Bhattacharjee ",
    facultyTitle: "Actogen Batch Mentor | Life Science Educator ",
    facultyImage: rupayanImg,
    facultyDescription:
      "Rupayan holds a B.Sc. (Hons) in Biochemistry from Gurudas College, Kolkata, and an M.Sc. in Virology from ICMR-NIV, Pune. He has qualified CUET-PG, AIIMS, and SPPU OEE, and secured admission offers from Pondicherry University, BHU, AIIMS, and ICMR-NIV.",
    experties: ["Biochemistry", "Metabolism", "Plant Physiology "],
  },
  {
    id: 3,
    facultyName: "Subhadeep Podder",
    facultyTitle: "Actogen Batch Mentor | DST INSPIRE Scholar ",
    facultyImage: subhadeepImg,
    facultyDescription:
      "Subhadeep holds a B.Sc. (Hons) in Microbiology from St. Xavier's College, Kolkata, and an M.Sc. in Virology from ICMR-NIV, Pune. He is a recipient of the DST INSPIRE Scholarship for his academic excellence and research potential.",
    experties: ["Genetics", "Ecology & Evolution", "Animal Physiology "],
  },
  {
    id: 4,
    facultyName: "Akash Biswas ",
    facultyTitle: "Semester Batch Mentor | Biotechnology Educator ",
    facultyImage: akashImg,
    facultyDescription:
      "Akash holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya and is currently pursuing postgraduation at Gujarat Biotechnology University. He has qualified TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
    experties: [
      "Microbiology",
      "Industrial Microbiology",
      "Agricultural Microbiology ",
    ],
  },
];

const adjunctFaculties = [
  {
    id: 5,
    facultyName: "Krishnendu Das ",
    facultyTitle: "Actogen Batch Mentor | Bioinformatics Educator",
    facultyImage: krishnenduImg,
    facultyDescription:
      "Krishnendu holds a B.Sc. (Hons) in Microbiology from Ramakrishna Mission Vidyamandira, Belur, and an M.Sc. in Virology from ICMR-NIV, Pune. He has qualified IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
    experties: ["Bioinformatics"],
  },
];

const Faculties = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true, easing: "ease-in-out" });
  }, []);

  const renderFacultyCard = (faculty, index) => (
    <div
      key={faculty.id}
      data-aos="fade-up"
      data-aos-delay={index * 150}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2"
    >
      <div className="flex flex-col items-center p-6 text-center">
        <img
          src={faculty.facultyImage}
          alt={faculty.facultyName}
          className="w-40 h-40 rounded-full object-cover object-center border-4 border-[#3eb5a2] shadow-md transition-transform duration-700 hover:scale-105"
        />
        <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">
          {faculty.facultyName}
        </h3>
        <p className="text-sm font-medium text-green-600">
          {faculty.facultyTitle}
        </p>
        <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {faculty.facultyDescription}
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-4">
          {faculty.experties.map((exp, i) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-green-600 text-white"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-gray-50 dark:bg-[#0f172a] transition-all duration-500">
      {/* Hero Section */}
      <div className="text-center pt-24 md:pt-32 pb-12">
        <h4
          data-aos="fade-down"
          data-aos-delay="200"
          className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide"
        >
          Meet
        </h4>
        <h2
          data-aos="zoom-in"
          data-aos-delay="400"
          className="text-3xl md:text-5xl font-extrabold text-green-600"
        >
          Our Faculties
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="600"
          className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base"
        >
          Learn from highly qualified mentors who have cracked top national
          exams and bring rich academic and research experience to guide you
          towards success.
        </p>
      </div>

      {/* Faculties Grid */}
      <div className="w-[90%] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {faculties.map((faculty, index) => renderFacultyCard(faculty, index))}
      </div>

      {/* Adjunct Faculty Section */}
      <div className="mt-20">
        <h3
          data-aos="fade-up"
          className="text-2xl md:text-4xl font-bold text-center text-green-600"
        >
          Adjunct Faculty
        </h3>
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center text-sm md:text-base"
        >
          Our adjunct faculty members bring additional expertise and diverse
          research experience to strengthen our academic environment.
        </p>
        <div className="w-[90%] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {adjunctFaculties.map((faculty, index) =>
            renderFacultyCard(faculty, index)
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculties;
