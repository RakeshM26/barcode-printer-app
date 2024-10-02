import React, { useState } from "react";

function App() {
  const [device, setDevice] = useState(null);

  const printValues = [
    {
      company: "LOGIC TRADERS",
      itemName: "Item1",
      barcode: "12345",
      noOfCopies: 4,
    },
    {
      company: "LOGIC TRADERS",
      itemName: "Item1",
      barcode: "12345",
      noOfCopies: 4,
    },
    {
      company: "LOGIC TRADERS",
      itemName: "Item1",
      barcode: "12345",
      noOfCopies: 4,
    },
    {
      company: "LOGIC TRADERS",
      itemName: "Item1",
      barcode: "12345",
      noOfCopies: 4,
    },
  ];

  const requestDevice = async () => {
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      setDevice(device);
    } catch (e) {
      console.error(e);
    }
  };

  const testPrint = async (device) => {
    const cmds = [
      'SIZE 48 mm,25 mm',
      'CLS',
      `TEXT 30,10,"4",0,1,1,"${printValues[0].company}"`,
      `TEXT 30,50,"2",0,1,1,"${printValues[0].itemName}"`,
      `BARCODE 30,80,"128",70,1,0,2,2,"${printValues[0].barcode}"`,
      'PRINT 1',
      'END',
    ];

    try {
      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);
      await device.transferOut(
        device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber,
        new Uint8Array(new TextEncoder().encode(cmds.join('\r\n')))
      );
      await device.close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Barcode Printer App</h1>
      <button onClick={requestDevice}>Request Device</button>
      {device && (
        <button onClick={() => testPrint(device)}>
          Print with '{device.productName}'
        </button>
      )}
    </div>
  );
}

export default App;