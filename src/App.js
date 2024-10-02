import React, { useState, useEffect } from "react";
import printJS from "print-js";

function App() {
  const [isWebUsbSupported, setIsWebUsbSupported] = useState(true);

  useEffect(() => {
    if (!('usb' in navigator)) {
      console.log('WebUSB API is not supported!');
      setIsWebUsbSupported(false);
    }
  }, []);

  const ZplPrinter = () => {
    const zplCode = `
      ^XA
      ^LL0500
      ^LS0
      ^FO10,10
      ^A0,20,20
      N
      ^FS
      ^XZ
    `;

    const handlePrint = () => {
      printJS({
        printable: zplCode,
        type: 'raw',
        header: null,
        footer: null,
      });
    };

    return (
      <div>
        <button onClick={handlePrint}>Print ZPL</button>
      </div>
    );
  };

  return (
    <div>
      <h1>Barcode Printer App</h1>
      {!isWebUsbSupported && <p>WebUSB API is not supported in this browser.</p>}
      <ZplPrinter />
    </div>
  );
}

export default App;