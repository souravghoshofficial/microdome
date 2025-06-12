import React from "react";
import { Link } from "react-router";

const CourseCard = ({
  courseTitle,
  subTitle,
  type,
  language,
  actualPrice,
  discountedPrice,
  courseImg,
  courseTag,
  linkAddress = "#",
  btnText = "View Details",
  imageHeight="h-72"
}) => {

  const discount = Math.trunc(((actualPrice - discountedPrice) / actualPrice) * 100)
  return (
    <Link to={linkAddress} className="w-full cursor-pointer hover:-translate-y-3 transition-all duration-300 flex flex-col overflow-hidden text-black dark:bg-zinc-900 dark:text-white rounded-xl border border-zinc-900/10 dark:border-gray-700/25 bg-white shadow-lg shadow-gray-300 dark:shadow-[0_4px_12px_rgba(0,0,0,0.6)_0_1px_3px_rgba(255,255,255,0.05)]">
      <div className="w-full relative">
        <h5 className={`${courseTag ? "block" : "hidden"} absolute top-3 right-3 text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-sm bg-slate-100 text-black`}>{courseTag}</h5>
        <img className={`w-full object-cover object-center ${imageHeight}`} src={courseImg} alt="course image" />
      </div>
      <div className="p-3 lg:p-4">
        <h2 className="mt-1 text-xl font-bold">{courseTitle}</h2>
        <h3 className="mt-1 text-[14px] text-gray-700 dark:text-gray-300">{subTitle}</h3>
        <div className="w-full mt-2 flex items-center gap-2">
          <div className="py-[4px] px-3 rounded-md bg-slate-200 dark:bg-zinc-700 text-[12px] font-semibold">{type === "LIVE" ? `${type} BATCH` : `${type}`}</div>
          <div className="py-[4px] px-3 rounded-md bg-slate-200 dark:bg-zinc-700 text-[12px] font-semibold">{language}</div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">₹ {discountedPrice}</h3>
            <h3 className={`${actualPrice === discountedPrice ? "hidden" : "block"} text-sm line-through`}>
              ₹ {actualPrice}
            </h3>
          </div>
          <div>
            <h4 className={`${discount ? "block" : "hidden"} text-right px-2 py-0.5 text-sm font-semibold bg-slate-200 dark:bg-white rounded-md text-black`}>{discount}% OFF</h4>
          </div>
        </div>
        <Link to={linkAddress} className="mt-4 block w-full px-3 py-2 text-center text-lg font-semibold cursor-pointer bg-blue-600 text-white rounded-md">
          {btnText}
        </Link>
      </div>
    </Link>
  );
};

export default CourseCard;
