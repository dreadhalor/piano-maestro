import React from "react";

export const CardBoxTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <h2 className="text-xl font-bold text-gray-800"> {children}</h2>;
};

export const CardBoxSubtitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <p className="text-sm text-gray-600"> {children}</p>;
};

export const CardBox: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="w-full rounded-lg bg-gray-100 p-4 text-center shadow-inner">
      {children}
    </div>
  );
};
