import React from "react";
import { saveAs } from "file-saver";
import qz from "qz-tray";

function App() {
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

  const generatePRN = (printData) => {
    let prnData = "^XA\n";
    printData.forEach(({ company, itemName, barcode, noOfCopies }) => {
      for (let i = 0; i < noOfCopies; i++) {
        prnData += `^FO5,5^A0N,20,20^FD${company}^FS\n`;
        prnData += `^FO5,30^A0N,20,20^FD${itemName}^FS\n`;
        prnData += `^FO5,60^BY1,2,40^BC^FD${barcode}^FS\n`;
        prnData += "^XZ\n";
      }
    });
    return prnData;
  };

  const savePRN = () => {
    const prnContent = generatePRN(printValues);
    const blob = new Blob([prnContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "barcode-labels.prn");
  };

  const printWithQZTray = async () => {
    try {
      await qz.api.setCertificatePromise((resolve, reject) => {
        resolve(); // Accept any certificate
      });
      await qz.api.setSignaturePromise((resolve, reject) => {
        resolve(); // Sign requests (optional)
      });
      await qz.websocket.connect();
      const config = qz.configs.create("Bar-Code-Printer-TT065-50");
      const prnContent = generatePRN(printValues);
      await qz.print(config, [{ data: prnContent }]);
    } catch (error) {
      console.error("Error with QZ Tray:", error);
    } finally {
      qz.websocket.disconnect();
    }
  };

  return (
    <div>
      <h1>Barcode Printer App</h1>
      <button onClick={savePRN}>Save PRN File</button>
      <button onClick={printWithQZTray}>Print with QZ Tray</button>
    </div>
  );
}

export default App;
