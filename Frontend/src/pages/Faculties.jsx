import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import sayanImg from "../assets/sayanpic.png";
import rupayanImg from "../assets/Rupayanpic.png";
import subhadeepImg from "../assets/Subhadeep.png";
import akashImg from "../assets/Akashpic.jpg";
import krishnenduImg from "../assets/krishnendupic.jpg";
import Microdome from "../assets/microdome.jpg";

import { Helmet } from "react-helmet-async";

const faculties = [
  {
    id: 1,
    facultyName: "Sayan Ganguly",
    facultyTitle: "Founder Of Microdome Classes | Molecular Biology, Cell Biology Educator",
    facultyImage: sayanImg,
    facultyDescription:
      "Sayan Ganguly is currently a Research Scholar at CSIR–IICB. He holds an M.Sc. degree in Virology from the ICMR–National Institute of Virology, Pune, and previously earned a B.Sc. (Hons.) degree in Microbiology from Kalyani Mahavidyalaya. He has qualified top national-level examinations including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE, and received admission offers from reputed institutions such as Pondicherry University, BHU, SPPU, and ICMR–NIV.",
    experties: ["Molecular Biology", "Cell Biology", "Bio-Physics Techniques"],
  },
  {
    id: 2,
    facultyName: "Rupayan Bhattacharjee ",
    facultyTitle: "Actogen Batch Mentor |  Biochemistry, Plant Biology Educator ",
    facultyImage: rupayanImg,
    facultyDescription:
      "Rupayan Bhattacharjee is currently a Research Scholar at IIT Kharagpur. He holds an M.Sc. in Virology degree from ICMR–National Institute of Virology, Pune, and previously earned a B.Sc. (Hons.) degree in Biochemistry from Gurudas College, Kolkata. He has qualified national-level examinations including CUET-PG, AIIMS, and SPPU OEE, and received admission offers from reputed institutions such as Pondicherry University, BHU, AIIMS, and ICMR–NIV.",
    experties: ["Biochemistry", "Metabolism", "Plant Physiology "],
  },
  {
    id: 3,
    facultyName: "Subhadeep Podder",
    facultyTitle: "Actogen Batch Mentor |  Genetics, Evolution Educator ",
    facultyImage: subhadeepImg,
    facultyDescription:
      "Subhadeep holds an M.Sc. degree in Virology from ICMR–National Institute of Virology, Pune, and previously earned a B.Sc. (Hons.) degree in Microbiology from St. Xavier’s College, Kolkata. He is a recipient of the DST INSPIRE Scholarship, awarded for his academic excellence and research potential.",
    experties: ["Genetics", "Ecology & Evolution", "Animal Physiology "],
  },
  {
    id: 4,
    facultyName: "Akash Biswas ",
    facultyTitle: "Semester Batch Mentor | Biotechnology Educator ",
    facultyImage: akashImg,
    facultyDescription:
      "Akash is currently a Research Scholar at Gujarat Biotechnology University. He holds a B.Sc. (Hons.) degree in Microbiology from Kalyani Mahavidyalaya and is pursuing his postgraduate studies at Gujarat Biotechnology University. He has qualified several national-level examinations, including TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
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
      "Krishnendu is currently a Research Scholar at ICMR–National Institute of Virology. He holds an M.Sc. degree in Virology from ICMR–NIV, Pune, and previously earned a B.Sc. (Hons.) degree in Microbiology from Ramakrishna Mission Vidyamandira, Belur. He has qualified several national-level examinations, including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.",
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
      className="bg-white dark:bg-[#1E1F26] border border-gray-200 dark:border-gray-700 
      rounded-xl shadow-lg p-4 transition-all duration-500 ease-in-out transform 
      hover:scale-[1.02] hover:shadow-2xl max-w-md mx-auto"
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <img
          src={faculty.facultyImage}
          alt={faculty.facultyName}
          className="w-28 h-28 rounded-full object-cover border-4 border-highlighted shadow-md transition-transform duration-500 hover:scale-105"
        />
        <h3 className="text-xl font-bold text-black dark:text-white">
          {faculty.facultyName}
        </h3>
        <p className="text-xs font-medium text-highlighted">
          {faculty.facultyTitle}
        </p>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {faculty.facultyDescription}
        </p>
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {faculty.experties.map((exp, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1 rounded-full bg-highlighted text-white"
            >
              {exp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>Faculties | Microdome Classes</title>
        <meta
          name="description"
          content="Meet our expert faculties at Microdome Classes, dedicated to nurturing future biologists with mentorship and interactive learning."
        />
        <meta
          name="keywords"
          content="Microdome, Microdome Classes, Biology Coaching, Faculties, Life Sciences, IIT JAM, GAT-B, CUET-PG, Biology Classes"
        />
        <meta name="author" content="Microdome" />
        {/* Open Graph (Facebook/LinkedIn) */}
        <meta property="og:title" content="Faculties | Microdome Classes" />
        <meta
          property="og:description"
          content="Learn from highly qualified mentors who have cracked top national exams and bring rich academic and research experience to guide you towards success."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://microdomeclasses.in/faculties"
        />
        <meta property="og:image" content={Microdome} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Faculties | Microdome Classes" />
        <meta
          name="twitter:description"
          content="Meet our expert faculties at Microdome Classes, dedicated to nurturing future biologists with mentorship and interactive learning."
        />
        <meta name="twitter:image" content={Microdome} />
        <link rel="canonical" href="https://microdomeclasses.in/faculties" />
        <link rel="icon" href="/microdomeLogo.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Helmet>

      <section className="py-32 px-6 md:px-12 lg:px-24 transition-all duration-500">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Heading */}
          <div className="text-center space-y-3">
            <h3
              data-aos="fade-down"
              className="text-3xl md:text-4xl font-bold text-black dark:text-white"
            >
              Meet Our <span className="text-highlighted">Faculties</span>
            </h3>
            <p
              data-aos="fade-up"
              className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
            >
              Learn from highly qualified mentors who have cracked top national
              exams and bring rich academic and research experience to guide you
              towards success.
            </p>
          </div>

          {/* Faculties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {faculties.map((faculty, index) =>
              renderFacultyCard(faculty, index)
            )}
          </div>

          {/* Adjunct Faculty Section */}
          <div className="space-y-6">
            <h3
              data-aos="fade-up"
              className="text-2xl md:text-4xl font-bold text-center text-black dark:text-white"
            >
              Adjunct <span className="text-highlighted">Faculty</span>
            </h3>
            <p
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-center text-lg"
            >
              Our adjunct faculty members bring additional expertise and diverse
              research experience to strengthen our academic environment.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {adjunctFaculties.map((faculty, index) =>
                renderFacultyCard(faculty, index)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faculties;
