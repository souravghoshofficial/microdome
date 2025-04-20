import React from 'react';
import microdome from '../assets/microdome.jpg';
import sayan from '../assets/sayanpic.png';
 
 const AboutUs = () => {
   return (
     <section className="bg-gradient-to-br from-green-50 to-green-100 py-12 px-6 md:px-20 animate-fadeIn">
       <div className="max-w-4xl mx-auto mt-16 text-center space-y-16">
 
         {/* Top image - real image with rounded corners only */}
         <div className="w-full">
           <img
             src={microdome}
             alt="Microdome Biology Coaching"
             className="rounded-2xl shadow-lg mx-auto w-sm object-contain transition-transform duration-300 hover:scale-105"
           />
         </div>
 
         {/* Title */}
         <h2 className="text-5xl font-extrabold text-green-800 underline decoration-green-500 underline-offset-8 drop-shadow-md">
           About Us
         </h2>
 
         {/* About Microdome Section */}
         <div className="bg-white rounded-2xl shadow-xl p-8 text-left space-y-4">
           <h3 className="text-3xl font-semibold text-green-700 underline decoration-green-400 underline-offset-4 mb-4">
             About Microdome
           </h3>
           <p className="text-gray-700 text-lg leading-relaxed">
             <strong>Microdome</strong> is a premier biology coaching institute dedicated to nurturing future biologists and curious minds passionate about life sciences. We believe that learning biology should be exciting, insightful, and deeply conceptual.
           </p>
           <p className="text-gray-700 text-lg leading-relaxed">
             <strong>Microdome</strong> is a growing coaching initiative dedicated to guiding students in the field of biological sciences, with a strong focus on M.Sc entrance exam preparation. We offer comprehensive support for exams such as IIT JAM, GAT-B, CUET-PG, AIIMS MSc, SPPU OEE, JGEEBILS, and more. Alongside entrance coaching, we also provide semester-wise academic support exclusively for BSc Microbiology (Hons.) students of Kalyani University and Calcutta University, West Bengal. The idea behind MicroDome was born out of a passion for teaching and simplifying complex biological concepts for students.
           </p>
           <p className="text-gray-700 text-lg leading-relaxed">
             With expert faculty, well-structured content, and a student-first approach, we provide the perfect environment for in-depth learning and academic success.
           </p>
           <p className="text-gray-700 text-lg leading-relaxed">
             Join us and be a part of the Microdome family — where science meets mentorship, and dreams meet direction.
           </p>
         </div>
 
         {/* Founder image + caption */}
         <div className="space-y-3">
           <img
             src={sayan}
             alt="photo of the founder of microdome"
             className="rounded-2xl shadow-lg mx-auto w-full max-w-xs object-contain transition-transform duration-300 hover:scale-105"
           />
           <p className="text-sm text-green-700 font-semibold italic">Founder of Microdome Classes</p>
         </div>
 
         {/* About Me Section */}
         <div className="bg-white rounded-2xl shadow-xl p-8 text-left space-y-4">
           <h3 className="text-3xl font-semibold text-green-700 underline decoration-green-400 underline-offset-4 mb-4">
             About Me
           </h3>
           <p className="text-gray-700 text-lg leading-relaxed">
             Hi, I’m <strong>Sayan Ganguly</strong>, the founder of <strong>Microdome Classes,</strong> a passionate educator with a strong background in biology and an unwavering commitment to student success. I believe in blending conceptual clarity with real-world applications.
           </p>
 
           <div className="text-gray-700 text-lg leading-relaxed space-y-2">
             <p>🎓 <strong>Qualification:</strong></p>
             <ul className="list-disc list-inside ml-4">
               <li>B.Sc. Microbiology (Hons), Kalyani Mahavidyalaya, Kalyani</li>
               <li>M.Sc. Virology, ICMR-National Institute of Virology, Pune</li>
             </ul>
 
             <p className="mt-4">🎓 <strong>Achievements:</strong></p>
             <ul className="list-disc list-inside ml-4">
               <li>Qualified: IIT-JAM, GATE, GAT-B, CUET-PG, SPPU OEE</li>
               <li>Selected for: Pondicherry University, BHU, SPPU, ICMR-NIV</li>
             </ul>
           </div>
 
           <p className="text-gray-700 text-lg leading-relaxed">
             My mission is to ignite curiosity and help students truly fall in love with biology.
           </p>
         </div>
       </div>
     </section>
   );
 };

 export default AboutUs