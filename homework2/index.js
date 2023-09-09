#! /usr/bin/env node
const childProcess = require('child_process');

const isWindows = process.platform == 'win32';

const commands = isWindows ? {
    command: `powershell "Get-Process | Sort-Object CPU -Descending | Select-Object -Property Name, CPU, WorkingSet -First 1 | ForEach-Object { $_.Name + ' ' + $_.CPU + ' ' + $_.WorkingSet }"`
} : {
    command: 'ps -A -o %cpu,%mem,comm | sort -nr | head -n 1'
}

const hrtime = process.hrtime;
console.log(hrtime)
// const execProcess = (command, tsh) => {
//     childProcess.exec(command.command).stdout.on('data', (data) => {
//         const dataStr = Buffer.isBuffer(data) ? data.toString().replace('\r', '') : data;
//         console.log(`${dataStr} Executed: ${Number(hrtime() - tsh) / 1e6 | 0} ms`);
//     });
//   }
  
// execProcess(commands, hrtime());


const execProcess = (command) => {
    childProcess.exec(command, (error, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
  
      if (error !== null) {
        console.log(`error: ${error}`);
      }
    });
  }
  
  execProcess(commands.command);
