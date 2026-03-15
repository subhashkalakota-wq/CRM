const fs = require('fs');

const file = fs.readFileSync('backend/server.js', 'utf8');

const phones = [
  "+91 98765 43210", "+91 98222 33445", "+91 99887 76655", "+91 91234 56789", 
  "+91 97777 88888", "+91 95555 44444", "+91 93333 22222", "+91 91111 00000",
  "+91 99999 11111", "+91 98888 22222"
];
const software = [
  "Aura Analytics Pro", "LogiTrack API", "MedCloud Secure", "RiskPredict Enterprise",
  "Edge AI NodeManager", "OmniCDP Suite", "VideoTagging AI Module", "SolarGrid Monitor",
  "MatchMaker ScaleDB", "SatOptimize Pro"
];

let updatedFile = file;

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
ids.forEach((id, index) => {
  const regex = new RegExp(`(id: ${id},)`);
  updatedFile = updatedFile.replace(regex, `$1\n    phone: "${phones[index]}",\n    software: "${software[index]}",`);
});

fs.writeFileSync('backend/server.js', updatedFile);
console.log("Updated server.js");
