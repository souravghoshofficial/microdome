import React, { useEffect, useState } from "react";
import axios from "axios";
import { TestimonialCard } from "../components";

const studentsReview = [
  {
    name: "Sourav Ghosh",
    message: '"The Microdome classes transformed my preparation journey! Their resources and support were invaluable in my success."',
    designation: "M.Sc in Biotechnology , IIT Delhi",
    imageUrl : "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    name: "Abhijit Rabidas",
    message: '"Microdome classes played a crucial role in my success! Their well-structured resources and dedicated support made my preparation journey smooth and effective. Highly recommended!"',
    designation: "M.Sc in Microbiology , Banaras Hindu University",
    imageUrl : "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    name: "Rohit Gupta",
    message: '"An absolute game-changer! The Microdome classes provided exceptional guidance and top-notch resources that significantly boosted my confidence and performance."',
    designation: "M.Sc in Biotechnology , Delhi University",
    imageUrl : "https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    name: "Sayan Ganguly",
    message: '"An absolute game-changer! The Microdome classes provided exceptional guidance and top-notch resources that significantly boosted my confidence and performance."',
    designation: "M.Sc in Biotechnology , Delhi University",
    imageUrl : "https://images.pexels.com/photos/1861594/pexels-photo-1861594.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
];


const Enroll = () => {
 
  // const [studentsReview, setStudentsReview] = useState([])
  
  // useEffect(() => {
  //   axios.get('/api/testimonial')
  //   .then((response) => {setStudentsReview(response.data)})
  //   .catch((error) => {console.log(error);
  //   })
  // }, [])
  

  return (
    <div id="testimonial" className="my-8 md:my-16 w-full flex items-center justify-center">
     <div className="w-[90%]">
        <h4 className="text-center text-sm font-bold">Testmonials</h4>
        <h2 className="text-center text-3xl md:text-4xl font-bold">See What Our <span className="highlighted-text">Students</span> Say</h2>
    <div id="marquee" className=" my-16 flex gap-[var(--gap)] w-[100%] mx-auto overflow-hidden">
      <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
      {studentsReview.map((student) => <TestimonialCard key={student.name} name={student.name} message={student.message} imageUrl={student.imageUrl} designation={student.designation} />)}
      </div>
      <div className="testimonial-container flex shrink-0 gap-[var(--gap)]">
      {studentsReview.map((student) => <TestimonialCard key={student.name} name={student.name} message={student.message} imageUrl={student.imageUrl} designation={student.designation} />)}
      </div>
    </div>
     </div>
    </div>
  );
};
 
export default Enroll;