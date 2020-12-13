import { spawn } from 'child_process';
import http from 'http';

let isServerRunning = false;

const [debug = false] = process.argv.slice(2);

function serve() {
  const serve = spawn('express-compression-server', [
    '--build=dist',
    '--port=1000',
  ], { stdio: 'inherit' });

  serve.on('message', event => {
    if (debug) console.log(event);
  });

  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(process.cwd());
  });
  
  server.listen(1000);

  isServerRunning = true;
}

const watch = spawn('nodemon', [
  '--delay', '1000ms',
  '--ext', 'js,ts,jsx,tsx',
  '--quiet',
  '--watch', './src',
  './server/build.js',
], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });

watch.on('message', event => {
  if (debug) console.log(event);
  if (event.type === 'exit' && !isServerRunning) serve();
});
