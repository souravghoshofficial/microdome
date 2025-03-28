import React from "react";


const Enroll = () => {
  return (
    <div id="testimonial" className="my-8 md:my-16 w-full flex items-center justify-center">
     <div className="w-[90%]">
        <h4 className="text-center text-sm font-bold">Testmonials</h4>
        <h2 className="text-center text-3xl md:text-4xl font-bold">See What Our Students Say</h2>
        <h3 className="mt-16 w-full md:w-[60%] text-center text-lg md:text-xl font-semibold mx-auto">"The Microdome classes transformed my preparation journey! Their 
        resources and support were invaluable in my success."</h3>
        <div className="w-16 h-16 rounded-full overflow-hidden mt-4 bg-gray-300 mx-auto">
          <img className="w-16 h-16 object-cover" src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg" alt="user" />
        </div>
        <p className="mt-2 text-lg text-center mx-auto font-bold">Sourav Ghosh</p>
        <p className="text-sm text-center mx-auto">M.Sc in Biotechnology , IIT Delhi</p>
     </div>
    </div>
  );
};
 
export default Enroll;
