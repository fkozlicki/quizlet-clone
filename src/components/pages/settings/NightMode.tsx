import { MoonIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";

const NightMode = () => {
  return (
    <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:gap-8">
      <div className="mb-2 flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <MoonIcon width={32} height={32} />
        <p className="text-xl font-semibold">Night Mode</p>
      </div>
      <div className="flex-1 rounded-lg bg-white p-4 shadow">
        <div className="flex gap-8">
          <div>
            <button>
              <Image src="/switch-on.png" alt="" width={96} height={96} />
            </button>
            <div className="text-center font-bold">On</div>
          </div>
          <div>
            <button>
              <Image src="/switch-off.png" alt="" width={96} height={96} />
            </button>
            <div className="text-center font-bold">Off</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NightMode;
