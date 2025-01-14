import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScannerWithVideo = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(scanQRCode, 100); // Scan every 100ms
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const scanQRCode = () => {
    if (
      webcamRef.current &&
      webcamRef.current.video.readyState === 4 // Ensure the video is ready
    ) {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code) {
        console.log("QR Code detected:", code.data);
        setIsVideoPlaying(true);
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#fff100", // Yellow background
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {isVideoPlaying ? (
        <iframe
          src="https://www.youtube.com/embed/M2khW5YZdH8?autoplay=1"
          title="YouTube Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{
            width: "300px",
            height: "300px",
            borderRadius: "15px",
          }}
        ></iframe>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            style={{
              position: "absolute",
              width: "300px",
              height: "300px",
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          ></canvas>
          <div
            style={{
              position: "absolute",
              bottom: "-50px",
              textAlign: "center",
              color: "#000",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            Point the camera at a QR Code
          </div>
        </>
      )}
    </div>
  );
};

export default QRScannerWithVideo;
