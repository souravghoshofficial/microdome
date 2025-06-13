const ContactItem = ({ contactType, logo, desc }) => {
  return (
    <div className="mt-4 w-full flex gap-4">
      <div className="mt-1 h-10 w-10 bg-slate-200 dark:bg-gray-700 rounded-full flex items-center justify-center ">
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
