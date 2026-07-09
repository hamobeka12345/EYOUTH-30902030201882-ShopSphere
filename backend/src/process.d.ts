// Ensures TypeScript knows about the Node.js `process` global when using JS files.
// This fixes `Cannot find name 'process'.` in backend/src/*.js

/// <reference types="node" />

