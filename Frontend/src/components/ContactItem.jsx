import React from "react";

const ContactItem = ({ contactType, logo, desc }) => {
  return (
    <div className="mt-2 w-full flex gap-4">
      <div className="mt-1">
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
