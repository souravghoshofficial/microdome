import React from "react";
import Sayan from '../assets/sayanpic.png';
import Rupayan from '../assets/Rupayanpic.png';
import Subhadeep from '../assets/Subhadeep.png';
import Akash from '../assets/Akashpic.jpg';

const Faculties=()=>{
  return (
  <div>
    <h2 className="text-black text-3xl text-center font-bold pt-25 dark:text-white">Our <span className="text-button">Faculties</span></h2>

     <div className="flex flex-col md:flex-row items-center gap-5 pt-20 pr-35">
              <div className="w-full md:w-1/2">
                <img
                  src={Sayan}
                  alt="sayan's image"
                  className="rounded-2xl shadow-2xl mx-auto w-80 object-contain transition-transform duration-300 hover:scale-105 "
                />

               <h3 className="text-3xl font-bold text-[#2C7A7B]  mb-4 pl-58 mt-3">Sayan Ganguly</h3>
              </div>

              <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4">
                
                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-2">Founder | Life Science Researcher</h3>

                <h3 className="text-1xl font-bold mb-2 text-pink-500">Expertise in - Molecular Biology, Cell Biology, Biophysical Techniques</h3>

              <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                Sayan holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya and an M.Sc. in Virology from ICMR–National Institute of Virology, Pune.

                He has qualified top national-level exams including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.
                He received admission offers from reputed institutions like Pondicherry University, BHU, SPPU, and ICMR-NIV.

                With a strong academic background and passion for science, Sayan founded this platform to support and guide aspiring students in the life sciences field.
              </p>
            </div>
          </div> 



            <div className="flex flex-col md:flex-row items-center gap-5 pt-20 pr-35">
              <div className="w-full md:w-1/2">
                <img
                  src={Rupayan}
                  alt="rupayan's image"
                  className="rounded-2xl shadow-2xl mx-auto w-80 object-contain transition-transform duration-300 hover:scale-105"
                />

                  <h3 className="text-3xl font-bold text-[#2C7A7B] mb-4 pl-44 mt-3">Rupayan Bhattacharjee </h3> 
              </div>

              <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4 ">
                
                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-4">Actogen Batch Mentor | Life Science Educator</h3>
              
                <h3 className="text-1xl font-bold mb-2 text-pink-500">Expertise in - Biochemistry, Metabolism, Plant Physiology</h3>

                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                Rupayan holds a B.Sc. (Hons) in Biochemistry from Gurudas College, Kolkata, and an M.Sc. in Virology from the renowned ICMR–National Institute of Virology, Pune.

                He has qualified prestigious national-level exams such as CUET-PG, AIIMS, and SPPU OEE, and secured admission offers from top institutions including Pondicherry University, BHU, AIIMS, and ICMR-NIV.

                With a strong academic background and a passion for mentoring, Rupayan plays a key role in guiding students through their academic and research journeys.
                </p>
              </div>
            </div> 



            <div className="flex flex-col md:flex-row items-center gap-5 pt-20 pr-35">
              <div className="w-full md:w-1/2">
                <img
                  src={Subhadeep}
                  alt="subhadeep's image"
                  className="rounded-2xl shadow-2xl mx-auto w-80 object-contain transition-transform duration-300 hover:scale-105"
                />

                   <h3 className="text-3xl font-bold text-[#2C7A7B] mb-4 pl-52 mt-3">Subhadeep Podder </h3>
              </div>

              <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4 ">
                
                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-4">Actogen Batch Mentor | DST INSPIRE Scholar</h3>
                <h3 className="text-1xl font-bold mb-2 text-pink-500">Expertise in - Genetics, Ecology & Evolution, Animal Physiology</h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                Subhadeep holds a B.Sc. (Hons) in Microbiology from St. Xavier’s College, Kolkata, and an M.Sc. in Virology from the esteemed ICMR–National Institute of Virology, Pune.

                He is a proud recipient of the prestigious DST INSPIRE Scholarship, awarded by the Department of Science and Technology, Government of India, in recognition of his academic excellence and research potential.

                Subhadeep brings both knowledge and mentorship to the platform, guiding students with dedication and insight in the field of life sciences.
                </p>
              </div>
            </div> 

            <div className="flex flex-col md:flex-row items-center gap-5 pt-20 pr-35">
              <div className="w-full md:w-1/2">
                <img
                  src={Akash}
                  alt="akash's image"
                  className="rounded-2xl shadow-2xl mx-auto w-80 object-contain transition-transform duration-300 hover:scale-105"
                />

                 <h3 className="text-3xl font-bold text-[#2C7A7B] mb-4 pl-62 mt-3">Akash Biswas</h3>
              </div>

              <div className="w-full md:w-1/2 bg-white dark:bg-[#232B38] rounded-2xl shadow-xl p-8 text-left space-y-4 ">

                <h3 className="text-2xl font-bold text-[#2C7A7B] mb-4">Semester Batch Member | Biotechnology Aspirant</h3>
                <h3 className="text-1xl font-bold mb-2 text-pink-500">Expertise in - Microbiology, Industrial Microbiology, Agricultural Microbiology</h3>

                <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                Akash holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya, Kalyani, and is currently pursuing his postgraduation at Gujarat Biotechnology University, Gujarat.

                He has successfully qualified several top national-level exams, including TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE.

                Akash received admission offers from prestigious institutions such as BHU, SPPU, GBU, ICMR–NIV, and IBAB, showcasing his academic dedication and strong foundation in life sciences.
                </p>
              </div>
            </div> 
  </div>
  )
}

export default Faculties;