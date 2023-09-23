"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _fs = _interopRequireDefault(require("fs"));
var _csvtojson = _interopRequireDefault(require("csvtojson"));
//TASK 3

var csvFilePath = "homework3/input.csv";
var readStream = _fs["default"].createReadStream(csvFilePath);
(0, _csvtojson["default"])().fromStream(readStream).subscribe(function (json) {
  return new Promise(function (resolve, reject) {
    // long operation for each json e.g. transform / write into database.
    _fs["default"].appendFile("output.txt", JSON.stringify(json) + "\n", function (err) {
      if (err) {
        console.log(err);
      }
    });
    resolve();
  });
}, function () {
  return console.log("error");
}, function () {
  return console.log("completed");
});