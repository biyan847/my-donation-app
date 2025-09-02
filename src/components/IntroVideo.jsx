import React, { useEffect, useRef, useState } from "react";
import videoSrc from "../assets/yanto_ga_transisi.mp4";

const IntroVideo = ({ onShowDashboard, onEnd }) => {
  const videoRef = useRef();
  const [slideUp, setSlideUp] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    videoRef.current && videoRef.current.play();
  }, []);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    // Jika video sudah berjalan lebih dari/atau detik ke-2,
    // atau, jika kamu mau sisa waktu 2 detik, ganti logika di bawah:
    if (vid.currentTime >= 8 && !hasTriggered) {
      setHasTriggered(true);
      onShowDashboard(); // <-- Dashboard mulai render di detik ke-2
      setSlideUp(true);
      setTimeout(() => {
        onEnd();
      }, 700); // waktu slide up, sesuaikan dengan CSS transition
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        transform: slideUp ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.7s cubic-bezier(.7,.3,.3,1)",
        pointerEvents: slideUp ? "none" : "auto",
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          background: "transparent",
        }}
        autoPlay
        muted
        playsInline
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default IntroVideo;
