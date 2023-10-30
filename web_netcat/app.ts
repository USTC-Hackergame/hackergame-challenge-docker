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

  var ping_interval = setInterval(() => {
    ws.ping();
  }, 15000);

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
    clearInterval(ping_interval);
    shell.kill();
  });

  var timeout_killer = setTimeout(() => {
    ws.terminate();
    shell.kill();
  }, 35000);

  ws.on('pong', () => {
    clearTimeout(timeout_killer);

    timeout_killer = setTimeout(() => {
      ws.terminate();
      shell.kill();
    }, 35000);
  });
});

app.listen(3000);
