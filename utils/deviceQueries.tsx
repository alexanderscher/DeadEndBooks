import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export function useDeviceQueries() {
  const isSmallDeviceQuery = useMediaQuery({ maxWidth: 700 });
  const isMediumDeviceQuery = useMediaQuery({ maxWidth: 900 });
  const isMobileDeviceQuery = useMediaQuery({ maxWidth: 460 });

  const [isSmallDevice, setIsSmallDevice] = useState<any>(null);
  const [isMediumDevice, setIsMediumDevice] = useState<any>(null);
  const [isMobileDevice, setIsMobileDevice] = useState<any>(null);

  useEffect(() => {
    setIsSmallDevice(isSmallDeviceQuery);
    setIsMediumDevice(isMediumDeviceQuery);
    setIsMobileDevice(isMobileDeviceQuery);
  }, [isSmallDeviceQuery, isMediumDeviceQuery, isMobileDeviceQuery]);

  return { isSmallDevice, isMediumDevice, isMobileDevice };
}
