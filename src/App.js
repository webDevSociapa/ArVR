"use client";

import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScanner = () => {
  const [videoURL, setVideoURL] = useState(""); // Video URL to play
  const [qrDetected, setQrDetected] = useState(false); // Track QR code detection
  const [facingMode, setFacingMode] = useState("environment"); // Camera facing mode
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
          setVideoURL("https://apisindia.s3.ap-south-1.amazonaws.com/homeBanner/f70925c7-972d-4c27-83bf-d82477e3202e_Jam+1440-698.mp4"); // Specify your video URL
          setQrDetected(true);
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(handleQRScan, 500);
    return () => clearInterval(interval);
  }, []);

  // Function to toggle between front and back cameras
  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "user" ? "environment" : "user"
    );
  };

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
        <div>
          <Webcam
            ref={webcamRef}
            videoConstraints={{ facingMode }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "auto",
            }}
          />
          <button
            onClick={toggleCamera}
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 20px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Switch Camera
          </button>
        </div>
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
