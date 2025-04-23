import React from 'react';
import Microdome from '../assets/microdome.jpg';
import Sayan from '../assets/sayanpic.png';

const AboutUs = () => {
  return (
    <section className="py-12 px-6 md:px-20 bg-[#F1F8FF] dark:bg-gray-900 transition-all duration-500">
      <div className="max-w-6xl mx-auto mt-16 text-center space-y-16">

        <h2 className="text-5xl font-extrabold text-[#2C7A7B] underline dark:decoration-white decoration-[#23615F] underline-offset-8 drop-shadow-lg">
          About Us
        </h2>

        {/* About Microdome Section */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <img
              src={Microdome}
              alt="Microdome Biology Coaching"
              className="rounded-2xl shadow-2xl mx-auto w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4">
            <h3 className="text-3xl font-semibold text-[#2C7A7B] underline dark:decoration-white decoration-[#23615F] underline-offset-4 mb-4">
              About Microdome
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              <strong>Microdome</strong> is a premier biology coaching institute dedicated to nurturing future biologists and curious minds passionate about life sciences. We believe that learning biology should be exciting, insightful, and deeply conceptual.
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              We guide students in the field of biological sciences, with a focus on M.Sc entrance exams like IIT JAM, GAT-B, CUET-PG, and more. We also provide academic support for BSc Microbiology (Hons.) students of Kalyani and Calcutta University.
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              With expert faculty, structured content, and a student-first approach, we provide the perfect space for deep learning and academic growth.
            </p>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              Join us and be part of the Microdome family — where science meets mentorship, and dreams find direction.
            </p>
          </div>
        </div>

        {/* About Me Section */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2 space-y-3">
            <img
              src={Sayan}
              alt="photo of the founder of microdome"
              className="rounded-2xl shadow-2xl w-full max-w-xs mx-auto object-contain transition-transform duration-300 hover:scale-105"
            />
            <p className="text-sm text-[#2C7A7B] font-semibold italic text-center">
              Founder of Microdome Classes
            </p>
          </div>

          <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4">
            <h3 className="text-3xl font-semibold text-[#2C7A7B] underline dark:decoration-white decoration-[#23615F] underline-offset-4 mb-4">
              About Me
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              Hi, I’m <strong>Sayan Ganguly</strong>, the founder of <strong>Microdome Classes,</strong> a passionate educator with a strong background in biology and an unwavering commitment to student success.
            </p>

            <div className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed space-y-2">
              <p><strong>Qualification:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>B.Sc. Microbiology (Hons), Kalyani Mahavidyalaya, Kalyani</li>
                <li>M.Sc. Virology, ICMR-National Institute of Virology, Pune</li>
              </ul>

              <p className="mt-4"><strong>Achievements:</strong></p>
              <ul className="list-disc list-inside ml-4">
                <li>Qualified: IIT-JAM, GATE, GAT-B, CUET-PG, SPPU OEE</li>
                <li>Selected for: Pondicherry University, BHU, SPPU, ICMR-NIV</li>
              </ul>
            </div>

            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              My mission is to ignite curiosity and help students truly fall in love with biology.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
