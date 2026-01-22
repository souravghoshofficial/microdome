import React from "react";

const ExamCard = ({ exam }) => {
  return (
    <div
      className="bg-white dark:bg-[#1e2129] border border-gray-200 dark:border-gray-700 
      rounded-xl shadow-md p-8 space-y-6 transition-all duration-500 ease-in-out 
      hover:scale-[1.02] hover:shadow-2xl"
      data-aos="fade-up"
    >
      {/* Exam Heading */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-highlighted">
          {exam.examName}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          {exam.description}
        </p>
      </div>

      {/* Courses Offered (Common) */}
      <div
        className="border border-gray-200 dark:border-gray-600 
        rounded-lg p-4 bg-gray-50 dark:bg-[#262a33]"
      >
        <h4 className="text-lg font-semibold text-black dark:text-white mb-2">
          Courses Offered
        </h4>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          {exam.courses.map((course, idx) => (
            <li key={idx}>{course}</li>
          ))}
        </ul>
      </div>

      {/* Colleges */}
      <div className="space-y-4">
        {exam.colleges.map((college, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-600 
            rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 
            dark:hover:bg-[#262a33]"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <h4 className="text-lg font-semibold text-black dark:text-white">
              {college.collegeName}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamCard;
