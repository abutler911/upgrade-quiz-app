const categories = [
  { id: 1, name: "Limitations", value: "limitations" },
  { id: 2, name: "Deice", value: "deice" },
  { id: 3, name: "Human Factors", value: "human-factors" },
  { id: 4, name: "Memory Items", value: "memory-items" },
  { id: 5, name: "FOM Chap. 5", value: "fom-chap-5" },
  { id: 6, name: "FOM Chap. 3", value: "fom-chap-3" },

  { id: 7, name: "Warning Systems", value: "warning-systems" },
  { id: 8, name: "Emergency Equipment", value: "emergency-equipment" },
  { id: 9, name: "Engines", value: "engines" },
  { id: 10, name: "Electrical Systems", value: "electrical-systems" },
  { id: 11, name: "Air Management System", value: "air-management-system" },
  { id: 12, name: "APU", value: "APU" },
  { id: 13, name: "Hydraulic System", value: "hydraulic-system" },
  { id: 14, name: "Landing Gear and Brakes", value: "landing-gear-and-brakes" },
  { id: 15, name: "Fuel Systems", value: "fuel-systems" },
  {
    id: 16,
    name: "Flight Controls & Stall Prot.",
    value: "flight-controls-and-stall-protection",
  },
  {
    id: 17,
    name: "Communications Equipment",
    value: "communications-equipment",
  },
  { id: 18, name: "Flight Instruments", value: "flight-instruments" },
  { id: 19, name: "Navigation Systems", value: "navigation-systems" },
  { id: 20, name: "AFCS", value: "AFCS" },
  { id: 21, name: "Fire Protection", value: "fire-protection" },
  { id: 22, name: "Ice & Rain Protection", value: "ice-rain-protection" },
  { id: 23, name: "Administration", value: "administration" },
  { id: 24, name: "Org & Chain-of-Command", value: "org-chain-of-command" },
  { id: 25, name: "Human Factors", value: "human-factors" },
  {
    id: 26,
    name: "Flight Crew Requirements",
    value: "Flight Crew Requirements",
  },
  { id: 27, name: "Flight Operations", value: "Flight Operations" },
  { id: 28, name: "Airworthiness", value: "Airworthiness" },
  { id: 29, name: "Adverse Weather", value: "Adverse Weather" },
  { id: 30, name: "International Ops", value: "International Ops" },
  { id: 31, name: "Supplemental Ops", value: "Supplemental Ops" },
  { id: 32, name: "Non-Routine Ops", value: "Non-Routine Ops" },
  { id: 33, name: "Emergency/Irreg Ops", value: "Emergency/Irreg Ops" },
  {
    id: 34,
    name: "Aircraft Security Procedures",
    value: "Aircraft Security Procedures",
  },
];

categories.sort((a, b) => a.name.localeCompare(b.name));

categories.forEach((category, index) => {
  category.id = index + 1;
});

module.exports = categories;
