import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import { TestimonialCard } from "../components";
import Microdome from "../assets/microdome.jpg";
import RoshniBanerjee from "../assets/RoshniBanerjee.webp";
import DeeptakBiswas from "../assets/DeeptakBiswas.png";
import SumiChakraborty from "../assets/Sumi_Chakraborty.jpg";

const studentsReview = [
  {
    name: "Shrestha Mandal",
    message:
      '"Microdome changed the way I look at this subject — what once felt hard now feels easy, I always thought this subject was tough, but thanks to my mentor’s way of teaching, everything feels so much easier now! Their learning skills and the way they simplify even complex topics are truly inspiring. There’s no fear or hesitation when asking questions — it feels like talking to an elder sibling who genuinely cares. Thanks to Sayan Da n Akash da!"',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Roshni Banerjee",
    message:
      '"Microdome is a great experience...... The mentors at Microdome consistently support us by explaining concepts, providing detailed notes, and sharing class recordings. They also help us by informing us about entrance exam notices and guiding us through the process. Moreover, they patiently explain things as many times as needed until we fully understand......"',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: RoshniBanerjee,
  },
  {
    name: "Mouli Sarma",
    message:
      '"The experience is awesome till now...The mentors are so friendly and they are helping us in every way they can. Quality of the online classes are increasing day by day and many more to come I wish "',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Deeptak Biswas",
    message:
      "My experience with MicroDome has been truly fantastic and inspiring. It is not all about making it through the syllabus—it is about actually understanding the subject and learning how to think like a scientist. The atmosphere is relaxed but intense, and it really inspires me to do better without stressing me out. The mentors, particularly Sayan Da, have assisted me in many ways that extend far beyond the mere act of teaching. They deconstruct abstract subjects into straightforward concepts and ensure that we know the 'why' behind things and not merely the 'what'. They have always been present and willing to listen, and their commitment makes me want to remain strong, to obey them, and devoted to my ambitions. My theoretical knowledge has increased significantly since I have joined MicroDome. I have become more analytical in approach to questions, and I feel more confident in theoretical and practical subjects. I am much better equipped for competitive examinations and classworks. Above all, I have become more interested in molecular biology, microbiology and more systematic, consistent in approach to studying in general.",
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: DeeptakBiswas,
  },
  {
    name: "Simran Chowdhury",
    message:
      '"Great!! Mentors are skilled, approachable, and teach with precision."',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Sayantika Pal",
    message:
      '"I am grateful to my two mentors at Microdome for their clear explanations and patience. The PDF notes are extremely helpful and easy to remember, and I have improved a lot since joining Microdome."',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
  {
    name: "Sumi Chakraborty",
    message:
      '"I am really happy to join MicroDome..mentors are truly awesome ,so helpful and friendly,  I am improving my knowledge through it and Microdome is also truly inspiring✨️✨️😇"',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: SumiChakraborty,
  },
  {
    name: "SHUVAM ROY",
    message:
      '"Three Mentors- 1) Sayan Da 2) Subhadeep Da 3) Rupayan Da.Deadly Combination of trios. Everyone especially My Lovable Sayan Da not Only a teacher, mentor but also    Friend, philosopher and Guide remaining to me Always. Concepts are learned from scratch. You choosed an Applied Subject but they decreased its toughness to us. Also Competitive Batch, there is Strictly Followed schedule. And Also there, Concepts are given. The Result Will Give the answer I Hope."',
    presentCourseOfStudy: "B.Sc in Microbiology",
    instituteName: "Kalyani Mahavidyalaya",
    imageUrl: Microdome,
  },
];

const Testimonial = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div
      id="testimonials"
      className="my-8 md:my-16 w-full flex items-center justify-center"
    >
      <div className="w-[90%]">
        {/* Headings */}
        <h4
          className="text-center text-sm font-bold"
          data-aos="fade-up"
        >
          Testimonials
        </h4>
        <h2
          className="text-center text-3xl md:text-4xl font-bold"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          See What Our{" "}
          <span className="highlighted-text">Students</span> Say
        </h2>

        {/* Marquee Container */}
        <div
          id="marquee"
          className="my-16 flex gap-[var(--gap)] w-[100%] mx-auto overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
            {studentsReview.map((student, idx) => (
              <div data-aos="zoom-in" data-aos-delay={idx * 100} key={student.name}>
                <TestimonialCard
                  name={student.name}
                  message={student.message}
                  imageUrl={student.imageUrl}
                  presentCourseOfStudy={student.presentCourseOfStudy}
                  instituteName={student.instituteName}
                />
              </div>
            ))}
          </div>

          <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
            {studentsReview.map((student, idx) => (
              <div data-aos="zoom-in" data-aos-delay={idx * 100} key={student.name}>
                <TestimonialCard
                  name={student.name}
                  message={student.message}
                  imageUrl={student.imageUrl}
                  presentCourseOfStudy={student.presentCourseOfStudy}
                  instituteName={student.instituteName}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
