//TASK 3
import fs from "fs";
import csv from "csvtojson";
const csvFilePath = "homework3/input.csv";
const readStream = fs.createReadStream(csvFilePath)

csv()
  .fromStream(readStream)
  .subscribe(
    (json) => {
      return new Promise((resolve, reject) => {
        // long operation for each json e.g. transform / write into database.
        fs.appendFile("output.txt", JSON.stringify(json) + "\n", (err) => {
          if (err) {
            console.log(err);
          }
        });
        resolve();
      });
    },
    () => console.log("error"),
    () => console.log("completed")
  );