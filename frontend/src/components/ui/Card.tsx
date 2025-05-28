// import React from 'react'

type CardProps =  {
   text : string;
   textSize? : "small" | "medium" | "large";
   color?: string;
   textColor?: string;

};

const cardStyles = {
  textSize: {
    small: "text-xl sm:text-2xl md:text-3xl",
    medium: "text-2xl sm:text-3xl md:text-4xl",
    large: "text-4xl sm:text-5xl md:text-6xl",

  } as const,
};

const Card = ({ text = "Bikash", textSize = "medium", color = "bg-black", textColor = "text-white" }) => {
  return (
    <div className={`${color} ${textColor} ${cardStyles.textSize[textSize]} mx-auto md:w-[35rem] w-80 mt-40 min-h-40 py-20 rounded-lg shadow-md p-4 text-center`}>
      {text}
    </div>
  );
};

export default Card
