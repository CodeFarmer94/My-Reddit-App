import React from "react";
import { RiFireFill } from "react-icons/ri";
import { MdFiberNew } from "react-icons/md";
import { FaBolt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectTheme } from "../../store/store";
import "./optionSelector.css";

export default function OptionSelector({
  selectedSubOption,
  setSelectedSubOption,
  optionsObject,
}) {

   // Update the selected option
  const onClick = (option) => {
    setSelectedSubOption(option);
    
  };
  const theme = useSelector(selectTheme);
  return (
    <div
      className={
        theme === "dark"
          ? "options-container flex-row bg3-dark-color"
          : "options-container flex-row bg3-light-color"
      }
    >
      <button
        className="options-btn"
        onClick={() => onClick(optionsObject.option1)}
        style={{
          backgroundColor:
            selectedSubOption === optionsObject.option1
              ? "##cfd1d4"
              : "##e1e4eb",
          color:
            selectedSubOption === optionsObject.option1 ? "#7a11fa" : "gray",
        }}
      >
        <RiFireFill />
        {optionsObject.option1}
      </button>
      <button
        className="options-btn"
        onClick={() => onClick(optionsObject.option2)}
        style={{
          backgroundColor:
            selectedSubOption === optionsObject.option2
              ? "##cfd1d4"
              : "##e1e4eb",
          color:
            selectedSubOption === optionsObject.option2 ? "#7a11fa" : "gray",
        }}
      >
        <MdFiberNew />
        {optionsObject.option2}
      </button>
      <button
        className="options-btn"
        onClick={() => onClick(optionsObject.option3)}
        style={{
          backgroundColor:
            selectedSubOption === optionsObject.option3
              ? "##cfd1d4"
              : "##e1e4eb",
          color:
            selectedSubOption === optionsObject.option3 ? "#7a11fa" : "gray",
        }}
      >
        <FaBolt />
        {optionsObject.option3}
      </button>
    </div>
  );
}