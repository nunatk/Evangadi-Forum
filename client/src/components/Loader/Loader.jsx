import React from "react";
import { FadeLoader } from "react-spinners";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <FadeLoader size={50} color="#ff9900" />
    </div>
  );
}
