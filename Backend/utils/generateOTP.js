function generateOTP(n) {
  let otp = "";
  for (let i = 0; i < n; i++) {
    otp += Math.floor(Math.random() * 10); // generates digit 0–9
  }
  return otp;
}

export {generateOTP}