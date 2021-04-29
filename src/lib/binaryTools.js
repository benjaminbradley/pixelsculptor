const DEBUG_BINARYTOOLS = false;

export function bitArrayToBase64(bitArray) {
  if (DEBUG_BINARYTOOLS) console.log("bitArrayToBase64, got bitArray=",bitArray);
  // convert bitstream to binary data
  let binaryData = '';
  while (bitArray.length > 0) {
    // get the next 8 bits
    const eightbits = bitArray.splice(0, 8);
    if (DEBUG_BINARYTOOLS) console.log("spliced: ",eightbits);
    // convert these 8 bits to a byte
    let byte=0;
    for (let i=0; i<8 && i<eightbits.length; i++) {
      const n = eightbits[i] * 2**(7-i);
      byte += n;
      if (DEBUG_BINARYTOOLS) console.log(`Adding ${eightbits[i]} * (2**(7-${i})=${2**(7-i)}) }=${n} to byte, now=${byte}`);
    }
    binaryData += String.fromCharCode(byte);
    if (DEBUG_BINARYTOOLS) console.log(`Appending byte ${byte} to binaryData,  now='${binaryData}'`);
  }
  // convert binary data to base64 string
  const base64 = btoa(binaryData);
  if (DEBUG_BINARYTOOLS) console.log(`returning base64='${base64}'`);
  return base64;
}

export function base64toBitArray(base64) {
  if (DEBUG_BINARYTOOLS) console.log(`base64toBitArray, got base64='${base64}'`);
  let binaryData = atob(base64);
  if (DEBUG_BINARYTOOLS) console.log(`binaryData='${binaryData}'`);
  let bitArray=[];
  while (binaryData.length > 0) {
    // Shift off the next byte of the string
    const byte = binaryData.substring(0,1);
    binaryData = binaryData.slice(1);
    if (DEBUG_BINARYTOOLS) console.log(`Looking at next byte='${byte}'`)
    const byteInt = byte.charCodeAt(0);
    if (DEBUG_BINARYTOOLS) console.log(`next byte numerical value is ${byteInt}`);
    for (let i=7; i>=0; i--) {
      const bit = (byteInt & (2**i)) > 0 ? 1 : 0;
      bitArray.push(bit);
      if (DEBUG_BINARYTOOLS) console.log(`Adding ${bit} to the bitArray`);
    }
  }
  // trim 0s from the trailing end
  while (bitArray[bitArray.length-1] === 0) bitArray.pop();
  if (DEBUG_BINARYTOOLS) console.log("Returning bitArray=",bitArray);
  return bitArray;
}

export function parseBitStream(bitstream, depth) {
  if (bitstream.length === 0) return [[0,0], []];
  if (DEBUG_BINARYTOOLS) console.log("\t".repeat(depth)+"parseBitStream:",bitstream)
  const sculptPath = [];
  let cellCount = 0;
  while (cellCount < 2 && bitstream.length > 0) {
    // Shift off the first element for myself
    const thisBit = bitstream.shift();
    if (DEBUG_BINARYTOOLS) console.log("\t".repeat(depth)+`parseBitStream: (processing ${thisBit})`);
    cellCount++;
    if (thisBit) {
      let childPath;
      [childPath, bitstream] = parseBitStream(bitstream, depth+1);
      if (DEBUG_BINARYTOOLS) console.log("\t".repeat(depth)+"parseBitStream: adding child path",childPath);
      sculptPath.push(childPath);
    } else {
      sculptPath.push(thisBit);
    }
  }
  if (DEBUG_BINARYTOOLS) console.log("\t".repeat(depth)+"parseBitStream returning sculptPath:",sculptPath,", and remainder=",bitstream);
  return [sculptPath, bitstream];
}
