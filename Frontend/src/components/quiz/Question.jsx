import React from "react";
import Option from "./Option";

const Question = ({ question }) => {
  return (
    <div className="w-full">
      <div className="question mt-3">
        <h2>
          <span> {question.question}</span>
        </h2>
      </div>
      <div className="options p-4 flex flex-col gap-1.5">
        {question.options.map((option, index) => (
          <Option key={index} option={option.option} />
        ))}
      </div>
    </div>
  );
};

export default Question;
