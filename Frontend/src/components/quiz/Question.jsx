import React from "react";
import Option from "./Option";

const Question = ({ question, selected, onSelect }) => {
  return (
    <div className="w-full">
      <div className="question mt-3 mb-4">
        <h2 className="text-lg font-semibold">{question.questionText}</h2>
      </div>
      <div className="options flex flex-col gap-2">
        {question.options.map((option, index) => (
          <Option
            key={index}
            option={option}
            selected={selected === index}
            onSelect={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Question;
