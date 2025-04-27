import React from 'react';
import Microdome from '../assets/microdome.jpg';
import Sayan from '../assets/sayanpic.png';

const AboutUs = () => {
  return (
    <section className="py-12 px-6 md:px-20  dark:bg-gray-900 transition-all duration-500">
      <div className="max-w-6xl mx-auto mt-16 text-center space-y-16">

        <h2 className="text-5xl font-extrabold text-[#2C7A7B] underline dark:decoration-white decoration-[#23615F] underline-offset-8 drop-shadow-lg">
          About Us
        </h2>

        
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="w-full md:w-1/2 flex justify-center mt-32"> 
            <img
              src={Microdome}
              alt="Microdome Biology Coaching"
              className="rounded-full shadow-2xl w-80 object-contain transition-transform duration-300 hover:scale-105 -mt-4"
            />
          </div>

          <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4">
            <h3 className="text-3xl font-bold text-[#2C7A7B] mb-4">
              About Microdome
            </h3>
            <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
              <strong className='text-pink-500'>Microdome</strong> is a premier biology coaching institute dedicated to nurturing future biologists and curious minds passionate about life sciences. We believe that learning biology should be exciting, insightful, and deeply conceptual.
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
       
        <div className="bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-6">
          <h3 className="text-3xl font-bold text-[#2C7A7B] mb-4 text-center">
            Why Should You Join Microdome?
          </h3>

          <div className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li><strong className='text-2xl font-semibold'>Expert Mentorship:</strong> All our mentors are highly qualified to guide undergraduate students (B.Sc) in the field of biological sciences.</li>
              <li><strong className='text-2xl font-semibold'>Proven Success:</strong> Our mentors have successfully qualified for most major entrance exams, ensuring you're learning from the best.</li>
              <li><strong className='text-2xl font-semibold'>Interactive Learning:</strong> We offer students the opportunity to teach or present topics, promoting deeper understanding and confidence.</li>
            </ul>

            <div>
              <p className="font-semibold">Structured Classes:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>3 dedicated Biology classes every week</li>
                <li>Additional support with PCM (Physics, Chemistry, Mathematics) classes</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Flexible Learning:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Access to recorded sessions via our Telegram channel</li>
                <li>Recorded classes also available on our YouTube channel and directly through the Microdome website</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Online Convenience:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>All classes are conducted online through Google Meet, so you can learn from anywhere!</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold">Affordable Fees:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>First class absolutely free!</li>
                <li>Only ₹500 for the first month</li>
                <li>From the second month onwards, just ₹1200 per month</li>
              </ul>
            </div>

            <p className="font-semibold">Financial Support:</p>
            <p>If you are facing any financial difficulties, we are always ready to help!</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
