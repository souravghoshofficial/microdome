import React from "react";

const ContactItem = ({ contactType, logo, desc }) => {
  return (
    <div className="mt-4 w-full flex gap-4">
      <div className="mt-1 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center ">
        {/* <img className="w-6 h-6" src={logo} alt={`${contactType} icon`} /> */}
        {logo}
      </div>
      <div>
        <h3 className="text-lg font-bold">{contactType}</h3>
        <p>{desc}</p>
      </div>
    </div>
  );
};

export default ContactItem;
