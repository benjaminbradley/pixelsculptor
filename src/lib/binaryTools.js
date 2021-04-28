export function bitArrayToBase64(bitArray) {
  console.log("bitArrayToBase64, got bitArray=",bitArray);
  // convert bitstream to binary data
  let binaryData = '';
  while (bitArray.length > 0) {
    // get the next 8 bits
    const eightbits = bitArray.splice(0, 8);
    console.log("spliced: ",eightbits);
    // convert these 8 bits to a byte
    let byte=0;
    for (let i=0; i<8 && i<eightbits.length; i++) {
      const n = eightbits[i] * 2**(7-i);
      byte += n;
      console.log(`Adding ${eightbits[i]} * (2**(7-${i})=${2**(7-i)}) }=${n} to byte, now=${byte}`);
    }
    binaryData += String.fromCharCode(byte);
    console.log(`Appending byte ${byte} to binaryData,  now='${binaryData}'`);
  }
  // convert binary data to base64 string
  const base64 = btoa(binaryData);
  console.log(`returning base64='${base64}'`);
  return base64;
}