"use client";
import React from "react";
import { Atom, BlinkBlur } from "react-loading-indicators";

const LoadingOverlay = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 scale-100 backdrop-blur-md z-50">
      <BlinkBlur color={["#32cd32"]} />
    </div>
  );
};

export default LoadingOverlay;
