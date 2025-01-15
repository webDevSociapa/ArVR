import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import './index.css'; // Import the custom drawer styles

const QRScanner = () => {
  const [videoURL, setVideoURL] = useState("");
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [qrPosition, setQrPosition] = useState(null);
  const [qrDetected, setQrDetected] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false); // State to control drawer visibility

  const webcamRef = useRef(null);

  const handleQRScan = () => {
    if (webcamRef.current) {
      const video = webcamRef.current.video;
      if (video.readyState === 4 && video.videoWidth > 0 && video.videoHeight > 0) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          console.log("QR Code Data:", code.data);
          setQrDetected(true);
          setVideoURL("https://apisindia.s3.ap-south-1.amazonaws.com/homeBanner/f70925c7-972d-4c27-83bf-d82477e3202e_Jam+1440-698.mp4");
          setQrPosition({
            top: (code.location.topLeft.y / canvas.height) * 100,
            left: (code.location.topLeft.x / canvas.width) * 100,
            width: ((code.location.topRight.x - code.location.topLeft.x) / canvas.width) * 100,
            height: ((code.location.bottomLeft.y - code.location.topLeft.y) / canvas.height) * 100,
          });
        }
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(handleQRScan, 500);
    return () => clearInterval(interval);
  }, []);

  const toggleCamera = () => setIsFrontCamera((prev) => !prev);

  // Handle drawer button click
  const handlePlayWithSociapa = () => setShowDrawer(true);

  // Close the drawer
  const closeDrawer = () => setShowDrawer(false);

  return (
    <>
      {!showDrawer ? (
        <button
          style={{
            position: "absolute",
            top: "70%",
            left: "50%",
            background: "green",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            fontSize: "20px",
            cursor: "pointer",
            zIndex: 1
          }}
          onClick={handlePlayWithSociapa}
        >
          Play with Sociapa
        </button>
      ) : (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            objectFit: "cover",
            backgroundImage: qrDetected ? "url('./neww.jpg')" : "none",
            backgroundSize: "cover",
            overflow: "hidden"
          }}
        >
          {/* Video element */}
          {qrPosition && (
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

          {/* Custom Bottom Drawer */}
          <div className={`custom-drawer ${showDrawer ? "open" : ""}`}>
            <div className="custom-drawer-content">
              <button className="close-drawer" onClick={closeDrawer}>
                X
              </button>
              <h2>Welcome to Sociapa!</h2>
              <p>Enjoy your experience with Sociapa.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRScanner;
