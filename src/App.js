import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScanner = () => {
  const [videoURL, setVideoURL] = useState(null); // Video URL from QR code
  const webcamRef = useRef(null);

  // Function to handle QR Code scanning
  const handleQRScan = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
  
      // Check if the video dimensions are ready
      if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        // Set canvas dimensions to match the video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
  
        if (code) {
          console.log("QR Code Data:", code.data);
          setVideoURL(code.data); // Set the video URL from the QR code
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
        backgroundImage: "url('https://heidicohen.com/wp-content/uploads/QR-Code-Newspaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!videoURL ? (
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            top: "65%", // Position webcam feed over QR code
            right: "6%",
            width: "15%",
            height: "28%",
            border: "2px solid #fff",
            borderRadius: "10px",
          }}
        />
      ) : (
        <iframe
          src={videoURL}
          title="QR Video"
          style={{
            position: "absolute",
            top: "15%", // Match webcam feed position
            right: "10%",
            width: "15%",
            height: "15%",
            border: "none",
          }}
          allow="autoplay"
        />
      )}
    </div>
  );
};

export default QRScanner;
