#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('♔ Chesster - Starting Complete Chess Game Environment ♔');
console.log('=====================================================\n');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Check if directories exist
function checkDirectories() {
  const requiredDirs = ['server', 'web'];
  const missingDirs = [];

  for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
      missingDirs.push(dir);
    }
  }

  if (missingDirs.length > 0) {
    logError(`Missing required directories: ${missingDirs.join(', ')}`);
    logInfo('Please ensure you are in the correct project directory');
    process.exit(1);
  }

  logSuccess('Project structure verified');
}

// Check if dependencies are installed
function checkDependencies() {
  const packageFiles = [
    'package.json',
    'server/package.json',
    'web/package.json'
  ];

  const missingFiles = [];

  for (const file of packageFiles) {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length > 0) {
    logError(`Missing package files: ${missingFiles.join(', ')}`);
    process.exit(1);
  }

  logSuccess('Package files found');
}

// Install dependencies for a directory
function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    logInfo(`Installing dependencies for ${name}...`);
    
    const installProcess = spawn('pnpm', ['install'], {
      cwd: dir,
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    installProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    installProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    installProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess(`${name} dependencies installed`);
        resolve();
      } else {
        logError(`Failed to install ${name} dependencies`);
        logError(errorOutput);
        reject(new Error(`Installation failed with code ${code}`));
      }
    });
  });
}

// Build the main project
function buildMainProject() {
  return new Promise((resolve, reject) => {
    logInfo('Building main project...');
    
    const buildProcess = spawn('pnpm', ['run', 'build'], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    buildProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    buildProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    buildProcess.on('close', (code) => {
      if (code === 0) {
        logSuccess('Main project built successfully');
        resolve();
      } else {
        logError('Failed to build main project');
        logError(errorOutput);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
}

// Start the server
function startServer() {
  return new Promise((resolve, reject) => {
    logInfo('Starting backend server...');
    
    const serverProcess = spawn('pnpm', ['run', 'dev'], {
      cwd: 'server',
      stdio: 'pipe',
      shell: true
    });

    let serverReady = false;

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Server] ${output.trim()}`);
      
      if (output.includes('Server running on port 5000') || output.includes('Stockfish engine initialized successfully')) {
        if (!serverReady) {
          serverReady = true;
          logSuccess('Backend server started successfully');
          resolve(serverProcess);
        }
      }
    });

    serverProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('Warning')) { // Ignore warnings
        console.log(`[Server Error] ${error.trim()}`);
      }
    });

    serverProcess.on('error', (error) => {
      logError(`Server error: ${error.message}`);
      reject(error);
    });

    serverProcess.on('close', (code) => {
      if (code !== 0) {
        logError(`Server process exited with code ${code}`);
      }
    });

    // Timeout for server startup
    setTimeout(() => {
      if (!serverReady) {
        logWarning('Server startup timeout - continuing anyway');
        resolve(serverProcess);
      }
    }, 10000);
  });
}

// Start the web UI
function startWebUI() {
  return new Promise((resolve, reject) => {
    logInfo('Starting web UI...');
    
    const webProcess = spawn('pnpm', ['run', 'web:dev'], {
      stdio: 'pipe',
      shell: true
    });

    let webReady = false;

    webProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(`[Web] ${output.trim()}`);
      
      if (output.includes('Local:') && output.includes('http://localhost:3000')) {
        if (!webReady) {
          webReady = true;
          logSuccess('Web UI started successfully');
          resolve(webProcess);
        }
      }
    });

    webProcess.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('Warning')) { // Ignore warnings
        console.log(`[Web Error] ${error.trim()}`);
      }
    });

    webProcess.on('error', (error) => {
      logError(`Web UI error: ${error.message}`);
      reject(error);
    });

    webProcess.on('close', (code) => {
      if (code !== 0) {
        logError(`Web UI process exited with code ${code}`);
      }
    });

    // Timeout for web UI startup
    setTimeout(() => {
      if (!webReady) {
        logWarning('Web UI startup timeout - continuing anyway');
        resolve(webProcess);
      }
    }, 15000);
  });
}

// Check if ports are available
function checkPorts() {
  return new Promise((resolve) => {
    logInfo('Checking port availability...');
    
    const net = require('net');
    const ports = [3000, 5000];
    let availablePorts = 0;

    ports.forEach(port => {
      const server = net.createServer();
      server.listen(port, () => {
        server.close();
        logSuccess(`Port ${port} is available`);
        availablePorts++;
        
        if (availablePorts === ports.length) {
          resolve();
        }
      });
      
      server.on('error', () => {
        logWarning(`Port ${port} is already in use`);
        availablePorts++;
        
        if (availablePorts === ports.length) {
          resolve();
        }
      });
    });
  });
}

// Main startup function
async function startChesster() {
  try {
    log('Starting Chesster chess game environment...', 'bright');
    
    // Step 1: Check project structure
    checkDirectories();
    checkDependencies();
    
    // Step 2: Check ports
    await checkPorts();
    
    // Step 3: Install dependencies if needed
    const nodeModulesExist = fs.existsSync('node_modules') && 
                            fs.existsSync('server/node_modules') && 
                            fs.existsSync('web/node_modules');
    
    if (!nodeModulesExist) {
      logInfo('Installing dependencies...');
      await installDependencies('.', 'main project');
      await installDependencies('server', 'server');
      await installDependencies('web', 'web UI');
    } else {
      logSuccess('Dependencies already installed');
    }
    
    // Step 4: Build main project
    await buildMainProject();
    
    // Step 5: Start server and web UI
    logInfo('Starting services...');
    
    const serverProcess = await startServer();
    const webProcess = await startWebUI();
    
    // Step 6: Display success message
    console.log('\n' + '='.repeat(60));
    logSuccess('🎉 Chesster is now running!');
    console.log('='.repeat(60));
    logInfo('Web UI: http://localhost:3000', 'cyan');
    logInfo('Backend API: http://localhost:5000', 'cyan');
    logInfo('Press Ctrl+C to stop all services', 'yellow');
    console.log('='.repeat(60) + '\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logInfo('Shutting down services...');
      serverProcess.kill();
      webProcess.kill();
      logSuccess('All services stopped');
      process.exit(0);
    });
    
    process.on('SIGTERM', () => {
      logInfo('Shutting down services...');
      serverProcess.kill();
      webProcess.kill();
      logSuccess('All services stopped');
      process.exit(0);
    });
    
  } catch (error) {
    logError(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the startup script
startChesster(); 