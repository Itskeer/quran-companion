"use client";
import { useState, useEffect } from "react";

interface GeoLocation {
  latitude: number;
  longitude: number;
  error?: string;
  loading: boolean;
}

export function useGeolocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>({
    latitude: 0,
    longitude: 0,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Geolocation not supported",
        loading: false,
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          loading: false,
        });
      },
      (err) => {
        setLocation((prev) => ({
          ...prev,
          error: err.message,
          loading: false,
        }));
      }
    );
  }, []);

  return location;
}
