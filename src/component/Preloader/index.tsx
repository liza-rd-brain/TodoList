import React, { FC } from "react";
import "./index.less";

export const Preloader: FC<{ type: "big" | "small" }> = ({ type }) => {
  switch (type) {
    case "big": {
      return <div className=" preloader-big"></div>;
    }
    case "small": {
      return <div className="preloader-small"></div>;
    }
    default: {
      return null;
    }
  }
};
