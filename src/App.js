import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const QRScanner = () => {
  const [videoURL, setVideoURL] = useState(""); // Video URL from QR code
  const [isFrontCamera, setIsFrontCamera] = useState(true); // State to toggle between front and back camera
  const [qrPosition, setQrPosition] = useState(null); // Store QR position
  const webcamRef = useRef(null);
  const [qrDetected, setQrDetected] = useState(false); // Track if QR code is detected

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
          setQrDetected(true);
          setVideoURL("https://apisindia.s3.ap-south-1.amazonaws.com/homeBanner/f70925c7-972d-4c27-83bf-d82477e3202e_Jam+1440-698.mp4"); // Set video URL from QR code scanning
          
          // Update QR position to overlay video at that location
          setQrPosition({
            top: code.location.topLeft.y / canvas.height * 100,
            left: code.location.topLeft.x / canvas.width * 100,
            width: (code.location.topRight.x - code.location.topLeft.x) / canvas.width * 100,
            height: (code.location.bottomLeft.y - code.location.topLeft.y) / canvas.height * 100
          });
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(handleQRScan, 500);
    return () => clearInterval(interval);
  }, []);

  // Toggle front/back camera
  const toggleCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height:"100vh",
        objectFit: "cover",
        backgroundImage: qrDetected ? "url('./new1.jpeg')" : "none",
        backgroundSize: "cover",
      }}
    >
      
      {!videoURL ? (
        <>
          <Webcam
            ref={webcamRef}
            screenshotFormat
            videoConstraints={{
              facingMode: isFrontCamera ? "user" : "environment", // Switch between front and back cameras
            }}
            style={{
              position: "absolute",
              top: "62%", // Position webcam feed over QR code
              right: "6%",
              width: "85%",
              height: "28%",
              border: "2px solid #fff",
              borderRadius: "10px",
            }}
          />
          <button
            onClick={toggleCamera}
            style={{
              position: "absolute",
              top: "5%",
              left: "5%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              border: "none",
              padding: "10px",
              cursor: "pointer",
            }}
          >
            Switch Camera
          </button>
        </>
      ) : (
        <video
          src={videoURL}
          autoPlay
          muted
          controls
          style={{
            position: "absolute",
              top: "62%", // Position webcam feed over QR code
              right: "6%",
              width: "85%",
              height: "28%",
              border: "2px solid #fff",
              borderRadius: "10px",
          }}
        />
      )}
      
      {qrPosition && (
        <video
          src={videoURL}
          autoPlay
          muted
          controls
          style={{
            top: "62%", // Position webcam feed over QR code
              right: "6%",
              width: "85%",
              height: "28%",
              border: "2px solid #fff",
              borderRadius: "10px",
              padding:"10px 0px"
          }}
        />
      )}
    </div>
  );
};

export default QRScanner;