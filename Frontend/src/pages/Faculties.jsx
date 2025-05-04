import React from 'react'
import { FacultyCard } from '../components'

import sayanImg from "../assets/sayanpic.png"
import rupayanImg from "../assets/Rupayanpic.png"
import subhadeepImg from "../assets/Subhadeep.png"
import akashImg from "../assets/Akashpic.jpg"
import krishnenduImg from "../assets/krishnendupic.jpg"

const faculties = [
  {
    id: 1,
    facultyName: "Sayan Ganguly",
    facultyTitle: "Founder Of Microdome Classes | Life Science Researcher",
    facultyImage: sayanImg,
    facultyDescription: "Sayan holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya and an M.Sc. in Virology from ICMR-National Institute of Virology, Pune. He has qualified top national-level exams including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE. He received admission offers from reputed institutions like Pondicherry University, BHU, SPPU, and ICMR-NIV. With a strong academic background and passion for science, Sayan founded this platform to support and guide aspiring students in the life sciences field.",
    experties: ["Molecular Biology" , "Cell Biology" , "Bio-Physics Techniques"],
    bgColor: '#F4CCCC',
  },
  {
    id: 2,
    facultyName: "Rupayan Bhattacharjee ",
    facultyTitle: "Actogen Batch Mentor | Life Science Educator ",
    facultyImage: rupayanImg,
    facultyDescription: "Rupayan holds a B.Sc. (Hons) in Biochemistry from Gurudas College, Kolkata, and an M.Sc. in Virology from the renowned ICMR-National Institute of Virology, Pune. He has qualified prestigious national-level exams such as CUET-PG, AIIMS, and SPPU OEE, and secured admission offers from top institutions including Pondicherry University, BHU, AIIMS, and ICMR-NIV. With a strong academic background and a passion for mentoring, Rupayan plays a key role in guiding students through their academic and research journeys.",
    experties: ["Biochemistry" , "Metabolism" , "Plant Physiology "],
    bgColor: '#A8E6CF',
  },
  {
    id: 3,
    facultyName: "Subhadeep Podder",
    facultyTitle: "Actogen Batch Mentor | DST INSPIRE Scholar ",
    facultyImage: subhadeepImg,
    facultyDescription: "Subhadeep holds a B.Sc. (Hons) in Microbiology from St. Xavier's College, Kolkata, and an M.Sc. in Virology from the esteemed ICMR-National Institute of Virology, Pune. He is a proud recipient of the prestigious DST INSPIRE Scholarship, awarded by the Department of Science and Technology, Government of India, in recognition of his academic excellence and research potential. Subhadeep brings both knowledge and mentorship to the platform, guiding students with dedication and insight in the field of life sciences.",
    experties: ["Genetics" , "Ecology & Evolution" , "Animal Physiology "],
    bgColor: '#EA9999',
  },
  {
    id: 4,
    facultyName: "Akash Biswas ",
    facultyTitle: "Semester Batch Mentor | Biotechnology Educator ",
    facultyImage: akashImg,
    facultyDescription: "Akash holds a B.Sc. (Hons) in Microbiology from Kalyani Mahavidyalaya, Kalyani, and is currently pursuing his postgraduation at Gujarat Biotechnology University, Gujarat. He has successfully qualified several top national-level exams, including TIFR, IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE. Akash received admission offers from prestigious institutions such as BHU, SPPU, GBU, ICMR-NIV, and IBAB, showcasing his academic dedication and strong foundation in life sciences.",
    experties: ["Microbiology" , "Industrial Microbiology" , "Agricultural Microbiology "],
    bgColor: '#E0BBE4',
  },
]

const adjunctFactulties = [
  {
    id: 5,
    facultyName: "Krishnendu Das ",
    facultyTitle: "Actogen Batch Mentor | Bioinformatics Educator",
    facultyImage: krishnenduImg,
    facultyDescription: "Krishnendu holds a B.Sc. (Hons) in Microbiology from Ramakrishna Mission Vidyamandira, Belur, and an M.Sc. in Virology from ICMR-National Institute of Virology, Pune. He has qualified top national-level exams including IIT-JAM, GATE, GAT-B, CUET-PG, and SPPU OEE. He received admission offers from reputed institutions like CSIR-CFTRI, Mysuru and Centre for Human Genetics, Bangalore SPPU, and ICMR-NIV. With a strong academic background and passion for science, Krishnendu founded this platform to support and guide aspiring students in the life sciences field.",
    experties: ["Bioinformatics"],
    bgColor: '#BFEFFF',
  },
]

const Faculties = () => {
  return (
    <div className="w-full flex items-center justify-center">
       <div className="my-24 md:my-32 w-[90%]">
       <h4 className="text-center text-sm font-bold">Meet</h4>
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Our Faculties
        </h2>
        <div className="w-full mt-8">
            {faculties.map((faculty , index) => (<FacultyCard key={faculty.id} index={index} facultyName={faculty.facultyName} facultyTitle={faculty.facultyTitle} facultyImage={faculty.facultyImage} facultyDescription={faculty.facultyDescription} experties={faculty.experties} bgColor={faculty.bgColor}/>))}
            <h3 className='mt-12 -mb-6 w-full lg:w-[84%]  mx-auto text-xl md:text-2xl font-semibold'>Adjunct Faculty : </h3>
            {adjunctFactulties.map((faculty , index) => (<FacultyCard key={faculty.id} index={index} facultyName={faculty.facultyName} facultyTitle={faculty.facultyTitle} facultyImage={faculty.facultyImage} facultyDescription={faculty.facultyDescription} experties={faculty.experties} bgColor={faculty.bgColor}/>))}
        </div>
       </div>
    </div>
  )
}

export default Faculties