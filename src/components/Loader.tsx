import { useState } from "react";
import { HashLoader } from "react-spinners";

const override: any = {
  display: "block",
  margin: "0 auto",
  borderColor: "#18acac",
};
export default function (/*props: any*/) {
  //   const { loading = true, color = "#18acac" } = props;

  return (
    <div className="h-full w-full flex items-center justify-center">
      <HashLoader color="#18acac" size="100" speedMultiplier={1} />
    </div>
  );
}
