import React from "react";
import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center">
      <div>
        <h2 className="text-center text-2xl">Wait a second please</h2>
        <p className="text-center text-lg">
          We are preparing cards set for you
        </p>
        <div className="flex justify-center">
          <Loader size={32} className="animate-spin" />
        </div>
      </div>
    </div>
  );
}
