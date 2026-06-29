"use client";
import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [done, setDone] = useState(false);

  const handleComplete = useCallback(() => {
    if (done) return;
    setDone(true);
    const moods = searchParams.get("moods") || "";
    const note = searchParams.get("note") || "";
    const params = new URLSearchParams();
    if (moods) params.set("moods", moods);
    if (note) params.set("note", note);
    router.replace(`/results?${params.toString()}`);
  }, [router, searchParams, done]);

  return <LoadingScreen onComplete={handleComplete} />;
}

export default function ProcessingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-900">
          <div className="w-8 h-8 rounded-full border-2 border-emerald/30 border-t-emerald animate-spin" />
        </div>
      }
    >
      <ProcessingContent />
    </Suspense>
  );
}
