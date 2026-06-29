"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useTranslation } from "@/i18n/useTranslation";
import {
  calculateQiblaDirection,
  getQiblaDirectionName,
  getQiblaDistance,
  getCurrentPosition,
} from "@/services/qibla";
import {
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi";

export default function QiblaPage() {
  const { t } = useTranslation();
  usePageTitle(t("qibla.title"));

  const [heading, setHeading] = useState(0);
  const [qiblaDir, setQiblaDir] = useState(0);
  const [distance, setDistance] = useState(0);
  const [hasCompass, setHasCompass] = useState(true);
  const [permissionNeeded, setPermissionNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const requestPermission = useCallback(async () => {
    try {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const state = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (state === "granted") {
          setPermissionNeeded(false);
          window.addEventListener("deviceorientation", (e: DeviceOrientationEvent) => {
            if (e.alpha !== null) setHeading(e.alpha);
          });
        }
      }
    } catch {
      setHasCompass(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    getCurrentPosition()
      .then((pos) => {
        if (cancelled) return;
        const { latitude: la, longitude: lo } = pos.coords;
        setLat(la);
        setLng(lo);
        setQiblaDir(calculateQiblaDirection(la, lo));
        setDistance(getQiblaDistance(la, lo));
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Unable to get location");
        setLoading(false);
      });

    const handler = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setHeading(e.alpha);
      }
    };

    if ("DeviceOrientationEvent" in window) {
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        setPermissionNeeded(true);
      } else {
        window.addEventListener("deviceorientation", handler);
      }
    } else {
      setHasCompass(false);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("deviceorientation", handler);
    };
  }, []);

  const directionName = getQiblaDirectionName(qiblaDir);
  const rotation = heading - qiblaDir;

  const formatDistance = (km: number): string => {
    return km.toLocaleString();
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dark dark:text-white mb-2">
            🕋 {t("qibla.title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("qibla.findDirection")}
          </p>
        </motion.div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-12 h-12 border-4 border-emerald/30 border-t-emerald rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {t("qibla.gettingLocation")}
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center mb-8"
          >
            <HiOutlineExclamationCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
              {error}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("qibla.enableLocation")}
            </p>
          </motion.div>
        )}

        {!loading && !error && (
          <>
            {permissionNeeded && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-center mb-8"
              >
                <HiOutlineInformationCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                  {t("qibla.compassPermission")}
                </p>
                <button
                  onClick={requestPermission}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  {t("qibla.grantPermission")}
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-col items-center mb-8"
            >
              <div className="relative w-72 h-72">
                <svg viewBox="0 0 300 300" className="w-full h-full">
                  <defs>
                    <radialGradient id="compassGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop offset="100%" stopColor="#f3f4f6" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="compassGradDark" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1f2937" stopOpacity="1" />
                      <stop offset="100%" stopColor="#111827" stopOpacity="1" />
                    </radialGradient>
                  </defs>

                  <circle
                    cx="150"
                    cy="150"
                    r="145"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-gray-200 dark:text-gray-700"
                  />

                  <circle cx="150" cy="150" r="140" className="fill-white dark:fill-gray-800" />

                  {hasCompass && (
                    <g
                      transform={`rotate(${-heading}, 150, 150)`}
                      className="transition-transform"
                      style={{ transition: "transform 0.15s ease-out" }}
                    >
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                        (deg) => (
                          <line
                            key={deg}
                            x1="150"
                            y1={deg % 90 === 0 ? 18 : 22}
                            x2="150"
                            y2={deg % 90 === 0 ? 28 : 26}
                            stroke="currentColor"
                            strokeWidth={deg % 90 === 0 ? "2" : "1"}
                            transform={`rotate(${deg}, 150, 150)`}
                            className="text-gray-300 dark:text-gray-600"
                          />
                        )
                      )}

                      <text
                        x="150"
                        y="48"
                        textAnchor="middle"
                        className="fill-red-500 font-bold text-sm"
                        fontWeight="bold"
                      >
                        N
                      </text>
                      <text
                        x="150"
                        y="262"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        S
                      </text>
                      <text
                        x="258"
                        y="155"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        E
                      </text>
                      <text
                        x="42"
                        y="155"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        W
                      </text>

                      <line
                        x1="150"
                        y1="150"
                        x2={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y2={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180)}
                        stroke="#0F5132"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <line
                        x1="150"
                        y1="150"
                        x2={150 - 50 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y2={150 + 50 * Math.cos((qiblaDir * Math.PI) / 180)}
                        stroke="#0F5132"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.3"
                      />

                      <circle
                        cx={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        cy={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180)}
                        r="16"
                        className="fill-emerald dark:fill-emerald-400"
                      />

                      <text
                        x={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180) + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-xl"
                      >
                        🕋
                      </text>
                    </g>
                  )}

                  {!hasCompass && (
                    <g transform={`rotate(${rotation}, 150, 150)`}>
                      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                        (deg) => (
                          <line
                            key={deg}
                            x1="150"
                            y1={deg % 90 === 0 ? 18 : 22}
                            x2="150"
                            y2={deg % 90 === 0 ? 28 : 26}
                            stroke="currentColor"
                            strokeWidth={deg % 90 === 0 ? "2" : "1"}
                            transform={`rotate(${deg}, 150, 150)`}
                            className="text-gray-300 dark:text-gray-600"
                          />
                        )
                      )}

                      <text
                        x="150"
                        y="48"
                        textAnchor="middle"
                        className="fill-red-500 font-bold text-sm"
                        fontWeight="bold"
                      >
                        N
                      </text>
                      <text
                        x="150"
                        y="262"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        S
                      </text>
                      <text
                        x="258"
                        y="155"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        E
                      </text>
                      <text
                        x="42"
                        y="155"
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400 text-sm"
                      >
                        W
                      </text>

                      <line
                        x1="150"
                        y1="150"
                        x2={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y2={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180)}
                        stroke="#0F5132"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      <line
                        x1="150"
                        y1="150"
                        x2={150 - 50 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y2={150 + 50 * Math.cos((qiblaDir * Math.PI) / 180)}
                        stroke="#0F5132"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.3"
                      />

                      <circle
                        cx={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        cy={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180)}
                        r="16"
                        className="fill-emerald dark:fill-emerald-400"
                      />

                      <text
                        x={150 + 95 * Math.sin((qiblaDir * Math.PI) / 180)}
                        y={150 - 95 * Math.cos((qiblaDir * Math.PI) / 180) + 1}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-xl"
                      >
                        🕋
                      </text>

                      <polygon
                        points="150,16 146,28 154,28"
                        fill="#EF4444"
                      />
                    </g>
                  )}

                  <circle
                    cx="150"
                    cy="150"
                    r="145"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-200 dark:text-gray-700"
                  />

                  <circle cx="150" cy="150" r="5" className="fill-emerald dark:fill-emerald-400" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {t("qibla.direction")}
                </p>
                <p className="text-3xl font-bold text-emerald dark:text-emerald-400 mb-1">
                  {Math.round(qiblaDir)}° {directionName}
                </p>
                <div className="w-12 h-px bg-gray-200 dark:bg-gray-700 mx-auto my-4" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {t("qibla.distance")}
                </p>
                <p className="text-2xl font-bold text-dark dark:text-white">
                  {formatDistance(distance)} km
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  📍 {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              </div>
            </motion.div>

            {!hasCompass && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 text-center mb-6"
              >
                <HiOutlineInformationCircle className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t("qibla.compassUnavailable")}
                </p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <h3 className="text-sm font-semibold text-dark dark:text-white mb-3 flex items-center gap-2">
                <HiOutlineInformationCircle className="w-4 h-4 text-emerald dark:text-emerald-400" />
                {t("qibla.howToUse")}
              </h3>
              <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">1.</span>
                  <span>{t("qibla.instruction1")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">2.</span>
                  <span>
                    {t("qibla.instruction2")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">3.</span>
                  <span>
                    {t("qibla.instruction3")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">4.</span>
                  <span>
                    {t("qibla.instruction4")}
                  </span>
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
