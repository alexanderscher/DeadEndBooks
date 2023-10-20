"use client";

import { useMediaQuery } from "react-responsive";
import { useState, useEffect } from "react";

export default function useIsMobileDevice() {
  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isMobileDeviceQuery]);

  return isMobileDevice;
}
