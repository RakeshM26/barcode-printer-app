import React, { useState, useEffect } from "react";

function App() {
  const [device, setDevice] = useState(null);
  const [isWebUsbSupported, setIsWebUsbSupported] = useState(true);
  const [zplCode, setZplCode] = useState("");

  useEffect(() => {
    if (!('usb' in navigator)) {
      console.log('WebUSB API is not supported!');
      setIsWebUsbSupported(false);
    }
  }, []);

  const requestDevice = async () => {
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      setDevice(device);
    } catch (e) {
      console.error(e);
    }
  };

  const handleZplCodeChange = (event) => {
    setZplCode(event.target.value);
  };

  const printZplCode = async (device) => {
    if (!zplCode) {
      console.error("No ZPL code to print");
      return;
    }

    try {
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      await device.transferOut(
        device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber,
        new Uint8Array(new TextEncoder().encode(zplCode))
      );
      await device.close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Barcode Printer App</h1>
      {!isWebUsbSupported && <p>WebUSB API is not supported in this browser.</p>}
      {isWebUsbSupported && (
        <>
          <button onClick={requestDevice}>Request Device</button>
          {device && (
            <>
              <textarea
                value={zplCode}
                onChange={handleZplCodeChange}
                placeholder="Enter ZPL code here"
                rows="10"
                cols="50"
              />
              <button onClick={() => printZplCode(device)}>
                Print with '{device.productName}'
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;