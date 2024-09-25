export const generatePRNFile = (printValues) => {
    let prnData = "^XA\n"; // Start of ZPL command
  
    printValues.forEach((value, index) => {
      for (let i = 0; i < value.noOfCopies; i++) {
        const offsetX = (index % 3) * 240; // Adjust label position horizontally
        prnData += `
          ^FO${offsetX + 5},5
          ^A0N,20,20
          ^FD${value.company}^FS
          ^FO${offsetX + 5},30
          ^A0N,20,20
          ^FD${value.itemName}^FS
          ^FO${offsetX + 5},60
          ^BY1,2,40
          ^BC
          ^FD${value.barcode}^FS
          ^FO${offsetX + 5},110
          ^A0N,20,20
          ^FDPrice^FS\n`;
      }
    });
  
    prnData += "^XZ\n"; // End of ZPL command
    return prnData;
  };
  