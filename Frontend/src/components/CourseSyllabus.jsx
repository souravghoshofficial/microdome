import { useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
const syllabus = [
  {
    subject: "Biology",
    topics: [
      "Cell Biology",
      "Biochemistry",
      "Genetics",
      "Molecular Biology",
      "Evolution",
      "Microbiology",
      "Plant Biology",
      "Animal Biology",
      "Ecology",
      "Biotechnology",
      "Methods in Biology",
      "Molecular biology techniques",
    ],
  },
  {
    subject: "Chemistry",
    topics: [
      "Structure and properties of Atoms",
      "Chemical kinetics, thermodynamics, and equilibrium",
      "Chemistry of organic compounds",
      "Instrumental techniques",
    ],
  },
  {
    subject: "Mathematics",
    topics: [
      "Sets, Relations and Functions",
      "Mathematical Induction",
      "Complex numbers",
      "Linear and Quadratic equations",
      "Sequences and Series",
      "Cartesian System of Rectangular Coordinates",
      "Three-Dimensional Geometry",
      "Permutations and Combinations",
      "Binomial Theorem",
      "Matrices and Determinants",
      "Limits and Continuity",
      "Differentiation and Integration",
      "Probability and Statistics",
    ],
  },
  {
    subject: "Physics",
    topics: [
      "Motion in one and two dimensions",
      "Laws of motion",
      "Conservation of energy",
      "System of particles and rotational motion",
      "Thermal properties of matter",
      "Heat and laws of thermodynamics",
      "Kinetic theory of gases",
    ],
  },
];

const CourseSyllabus = () => {
  const [showMenu, setshowMenu] = useState(
    new Array(syllabus.length).fill(false)
  );
  const openMenu = (index) => {
    const newMenu = [...showMenu];
    newMenu[index] = !newMenu[index];
    setshowMenu(newMenu);
  };
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold">Course Syllabus</h2>
      <div className="mt-4">
        {syllabus.map((item, index) => (
          <div className="w-full md:w-[90%] mb-4">
            <div
              key={index}
              onClick={() => openMenu(index)}
              className="p-3 border cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`${
                    showMenu[index] ? "rotate-180" : "rotate-0"
                  } transition-all duration-300 `}
                >
                  <RiArrowDownSLine size={24} />
                </div>
                <h3 className="text-lg font-semibold ">{item.subject}</h3>
              </div>
            </div>
            <div className={`p-3 border border-t-0 ${
                  showMenu[index] ? "block" : "hidden"}`}>
              <ul>
                {item.topics.map((topic) => (
                  <li key={topic} className="mt-0.5 px-5">
                    <span className="mr-2">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSyllabus;
