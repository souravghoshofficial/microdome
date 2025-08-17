import React, { useEffect } from "react";
import { FacultyCard } from "../components";

import sayanImg from "../assets/sayanpic.png";
import rupayanImg from "../assets/Rupayanpic.png";
import subhadeepImg from "../assets/Subhadeep.png";
import akashImg from "../assets/Akashpic.jpg";
import krishnenduImg from "../assets/krishnendupic.jpg";

import AOS from "aos";
import "aos/dist/aos.css";

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
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="w-full bg-white dark:bg-black transition-all duration-500">
      {/* Hero Section */}
      <div className="text-center pt-24 md:pt-32 pb-12">
        <h4 className="text-sm md:text-base font-bold text-gray-500 dark:text-gray-300">
          Meet
        </h4>
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#3eb5a2]">
          Our Faculties
        </h2>
      </div>

      {/* Faculties Grid */}
      <div className="w-[90%] mx-auto grid md:grid-cols-2 gap-10">
        {faculties.map((faculty, index) => (
          <div
            key={faculty.id}
            data-aos="fade-up"
            data-aos-delay={index * 150}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={faculty.facultyImage}
                alt={faculty.facultyName}
                className="w-full md:w-[250px] h-[250px] object-cover object-center"
              />
              <div className="p-6 space-y-3 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {faculty.facultyName}
                </h3>
                <p className="text-sm font-medium text-[#3eb5a2]">
                  {faculty.facultyTitle}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {faculty.facultyDescription}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {faculty.experties.map((exp, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-[#3eb5a2] text-white"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Adjunct Faculty Section */}
      <div className="mt-20">
        <h3 className="text-2xl md:text-4xl font-bold text-center text-[#3eb5a2]">
          Adjunct Faculty
        </h3>
        <div className="w-[90%] mx-auto grid md:grid-cols-2 gap-10 mt-12">
          {adjunctFaculties.map((faculty, index) => (
            <div
              key={faculty.id}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-2"
            >
              <div className="flex flex-col md:flex-row">
                <img
                  src={faculty.facultyImage}
                  alt={faculty.facultyName}
                  className="w-full md:w-[250px] h-[250px] object-cover object-center"
                />
                <div className="p-6 space-y-3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {faculty.facultyName}
                  </h3>
                  <p className="text-sm font-medium text-[#3eb5a2]">
                    {faculty.facultyTitle}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {faculty.facultyDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {faculty.experties.map((exp, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-[#3eb5a2] text-white"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faculties;
