const express = require('express')
const app = express();
const expressWs = require('express-ws')(app);
const pty = require('node-pty');

app.use(express.static('static'));

app.ws('/shell', (ws, req) => {
  var shell;
  if (Number(process.env.nc_raw)) {
    shell = pty.spawn('/bin/bash', ['-c', 'stty raw -echo; nc ' + process.env.nc_host + ' ' + process.env.nc_port]);
  } else {
    shell = pty.spawn('/bin/nc', [process.env.nc_host, process.env.nc_port]);
  }
  shell.on('data', (data) => {
    ws.send(data);
  });
  ws.on('message', (msg) => {
    shell.write(msg);
  });
  shell.on('close', () => {
    ws.close();
  });
  ws.on('close', () => {
    shell.kill();
  });
});

app.listen(3000);
