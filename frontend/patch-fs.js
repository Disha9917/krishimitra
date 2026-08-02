const fs = require('fs');
const pathModule = require('path');
const Module = require('module');

// 1. Intercept module resolution to bridge paths for files executed in the Temp directory
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (parent && parent.id && parent.id.includes('Temp\\krishimitra-next')) {
    // If it's a module package requirement (e.g. react, next, etc.)
    if (!request.startsWith('.') && !request.startsWith('/') && !request.includes(':')) {
      const projectNodeModules = pathModule.resolve(__dirname, 'node_modules');
      if (parent.paths) {
        if (!parent.paths.includes(projectNodeModules)) {
          parent.paths.unshift(projectNodeModules);
        }
      } else {
        parent.paths = [projectNodeModules];
      }
    }
  }
  return originalResolveFilename.apply(this, arguments);
};

// Helper to safely resolve path
function safeResolve(path) {
  return pathModule.resolve(path);
}

// 2. Patch fs.realpathSync to catch and handle OneDrive reparse point EINVAL errors on Windows
const originalRealpathSync = fs.realpathSync;
fs.realpathSync = function (path, options) {
  try {
    return originalRealpathSync(path, options);
  } catch (err) {
    if (err.code === 'EINVAL') {
      return safeResolve(path);
    }
    throw err;
  }
};

// Patch fs.realpathSync.native
if (fs.realpathSync.native) {
  const originalRealpathSyncNative = fs.realpathSync.native;
  fs.realpathSync.native = function (path, options) {
    try {
      return originalRealpathSyncNative(path, options);
    } catch (err) {
      if (err.code === 'EINVAL') {
        return safeResolve(path);
      }
      throw err;
    }
  };
}

// Patch fs.realpath
const originalRealpath = fs.realpath;
fs.realpath = function (path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  originalRealpath(path, options, (err, resolvedPath) => {
    if (err && err.code === 'EINVAL') {
      if (callback) return callback(null, safeResolve(path));
    }
    if (callback) callback(err, resolvedPath);
  });
};

// Patch fs.realpath.native
if (fs.realpath.native) {
  const originalRealpathNative = fs.realpath.native;
  fs.realpath.native = function (path, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    originalRealpathNative(path, options, (err, resolvedPath) => {
      if (err && err.code === 'EINVAL') {
        if (callback) return callback(null, safeResolve(path));
      }
      if (callback) callback(err, resolvedPath);
    });
  };
}

// Patch fs.promises.realpath
if (fs.promises && fs.promises.realpath) {
  const originalPromisesRealpath = fs.promises.realpath;
  fs.promises.realpath = async function (path, options) {
    try {
      return await originalPromisesRealpath(path, options);
    } catch (err) {
      if (err.code === 'EINVAL') {
        return safeResolve(path);
      }
      throw err;
    }
  };
}
