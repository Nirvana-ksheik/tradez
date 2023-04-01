import React, { useState, useEffect } from 'react';

function Ribbon({text, setShowValue, isSuccess}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setShowValue(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="w-50 text-center"
      style={{
        display: isVisible ? 'block' : 'none',
        backgroundColor: isSuccess == false ? 'red' : 'green',
        color: 'white',
        padding: '10px',
        position: 'fixed',
        top: '50px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        alignItems: 'center',
        fontSize: '2rem'
      }}
    >
      {text}
    </div>
  );
}

export default Ribbon;