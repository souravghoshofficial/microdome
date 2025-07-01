import { TestimonialCard } from "../components";
import Microdome from '../assets/microdome.jpg';
import RoshniBanerjee from '../assets/RoshniBanerjee.webp';
import DeeptakBiswas from '../assets/DeeptakBiswas.png';

const studentsReview = [
  {
    name: "Shrestha Mandal",
    message: '"Microdome changed the way I look at this subject — what once felt hard now feels easy, I always thought this subject was tough, but thanks to my mentor’s way of teaching, everything feels so much easier now! Their learning skills and the way they simplify even complex topics are truly inspiring. There’s no fear or hesitation when asking questions — it feels like talking to an elder sibling who genuinely cares. Thanks to Sayan Da n Akash da!"',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Roshni Banerjee",
    message: '"Microdome is a great experience...... The mentors at Microdome consistently support us by explaining concepts, providing detailed notes, and sharing class recordings. They also help us by informing us about entrance exam notices and guiding us through the process. Moreover, they patiently explain things as many times as needed until we fully understand......"',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: RoshniBanerjee,
  },
  {
    name: "Mouli Sarma",
    message: '"The experience is awesome till now...The mentors are so friendly and they are helping us in every way they can. Quality of the online classes are increasing day by day and many more to come I wish "',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Deeptak Biswas",
    message: "My experience with MicroDome has been truly fantastic and inspiring. It is not all about making it through the syllabus—it is about actually understanding the subject and learning how to think like a scientist. The atmosphere is relaxed but intense, and it really inspires me to do better without stressing me out. The mentors, particularly Sayan Da, have assisted me in many ways that extend far beyond the mere act of teaching. They deconstruct abstract subjects into straightforward concepts and ensure that we know the 'why' behind things and not merely the 'what'. They have always been present and willing to listen, and their commitment makes me want to remain strong, to obey them, and devoted to my ambitions. My theoretical knowledge has increased significantly since I have joined MicroDome. I have become more analytical in approach to questions, and I feel more confident in theoretical and practical subjects. I am much better equipped for competitive examinations and classworks. Above all, I have become more interested in molecular biology, microbiology and more systematic, consistent in approach to studying in general.",
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: DeeptakBiswas,
  },
  {
    name: "Simran Chowdhury",
    message: '"Great!! Mentors are skilled, approachable, and teach with precision."',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
];



const Testimonial = () => {
 
  return (
    <div id="testimonial" className="my-8 md:my-16 w-full flex items-center justify-center">
     <div className="w-[90%]">
        <h4 className="text-center text-sm font-bold">Testmonials</h4>
        <h2 className="text-center text-3xl md:text-4xl font-bold">See What Our <span className="highlighted-text">Students</span> Say</h2>
    <div id="marquee" className=" my-16 flex gap-[var(--gap)] w-[100%] mx-auto overflow-hidden">
      <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
      {studentsReview.map((student) => <TestimonialCard key={student.name} name={student.name} message={student.message} imageUrl={student.imageUrl} presentCourseOfStudy={student.presentCourseOfStudy} instituteName={student.instituteName} />)}
      </div>
      <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
      {studentsReview.map((student) => <TestimonialCard key={student.name} name={student.name} message={student.message} imageUrl={student.imageUrl} presentCourseOfStudy={student.presentCourseOfStudy} instituteName={student.instituteName}/>)}
      </div>
    </div>
     </div>
    </div>
  );
};
 
export default Testimonial;