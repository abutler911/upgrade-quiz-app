const express = require("express");
const router = express.Router();
// function generateRVRData() {
//   const segments = ["segment1", "segment2", "segment3"];
//   let rvrData = {};

//   segments.forEach((segment) => {
//     const range = Math.floor(Math.random() * 100);
//     rvrData[segment] = {
//       range: range,
//       solution: getSolutionForRange(range),
//     };
//   });

//   return rvrData;
// }

router.get("/rvr", (req, res) => {
  //   const data = generateRVRData();
  res.render("rvr", { title: "RVR Simulator", customCSS: "rvr.css" });
});

module.exports = router;
