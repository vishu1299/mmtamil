import { useState, useEffect } from "react";

export default function ProfileButton() {
  const [progress, setProgress] = useState(100); // Start with full width (100%)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0; // Stop the timer once it reaches 0
          }
          return prev - 1; // Decrease progress over time
        });
      }, 50); // Decrease progress every 50ms (adjust timing for smoother or faster progress)

      return () => clearInterval(interval); // Cleanup the interval on unmount or state change
    }
  }, [isLoading]);

  const handleClick = () => {
    setIsLoading(true); // Start the loading process
  };

  return (
    <button
      onClick={handleClick}
      className="relative bg-orange-500 text-white py-4 px-6 h-full flex items-center justify-center"
    >
      {/* Reverse Loading Bar */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-orange-700"
        style={{
          width: `${progress}%`, // Width decreases as progress decreases
          transition: "width 0.05s linear", // Smooth animation for width change
        }}
      ></div>

      {/* Button Text and Arrow */}
      {!isLoading ? (
        <>
          <span className="font-medium">View profile</span>
          <span className="ml-1">→</span>
        </>
      ) : (
        <span className="font-medium">Loading...</span>
      )}
    </button>
  );
}
