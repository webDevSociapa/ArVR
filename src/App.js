"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScanner = () => {
  const [videoURL, setVideoURL] = useState(""); // Video URL to play
  const [qrDetected, setQrDetected] = useState(false); // Track QR code detection
  const webcamRef = useRef(null);

  // Function to handle QR code scanning
  const handleQRScan = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;

      if (video.readyState === 4) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data === "a1.jpeg") {
          console.log("QR Code Data:", code.data);
          setVideoURL("/path-to-your-video.mp4"); // Specify your video URL
          setQrDetected(true);
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(handleQRScan, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: qrDetected ? "url('./new1.jpeg')" : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!qrDetected ? (
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "auto",
          }}
        />
      ) : (
        <video
          src={videoURL}
          autoPlay
          controls
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
          }}
        />
      )}
    </div>
  );
};

export default QRScanner;
