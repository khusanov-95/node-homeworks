#! /usr/bin/env node
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');

const logFile = "activityMonitor.log";
const refreshRate = 100; // 10 times per second
let lastLogTime = Date.now();

function getSystemCommand() {
  switch (os.platform()) {
    case "win32":
      return "powershell \"Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }\"";
    case "linux":
    case "darwin":
    default:
      return "ps -A -o %cpu,%mem,comm | sort -nr | head -n 1";
  }
}

function logToFile(data) {
  const unixTime = Math.floor(Date.now() / 1000);
  const logData = `${unixTime} : ${data}\n`;
  fs.appendFile(logFile, logData, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

function displayProcessInfo() {
  childProcess.exec(getSystemCommand(), (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing command:", error);
      return;
    }
    if (stderr) {
      console.error("Error in command output:", stderr);
      return;
    }

    const processInfo = stdout.trim();
    process.stdout.write(`\r${processInfo}`);

    const currentTime = Date.now();
    if (currentTime - lastLogTime >= 60000) {
      logToFile(processInfo);
      lastLogTime = currentTime;
    }
  });
}

setInterval(displayProcessInfo, refreshRate);

