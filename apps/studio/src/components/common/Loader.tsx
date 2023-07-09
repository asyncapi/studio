'use client';

import { useAppState } from "../../states"

const Loader = () => {
  const initialized = useAppState((state) => state.initialized);

  return(
    initialized ? null : (
    <div id="preloader">
      <div className="text-center bg-gray-800">
        <div>
          <img
          className="inline-block h-20"
          src="/img/logo-studio.svg"
          alt="AsyncAPI Logo"
          />
          <span className="inline-block text-xs text-teal-500 font-normal tracking-wider ml-1 transform translate-y-1.5 -translate-x-1 uppercase">
            beta
          </span>
        </div>
        <div className="w-full text-center h-8 -mt-2">
          <div className="rotating-wheel"></div>
        </div>
      </div>
    </div>
    )
  )
};

export default Loader;