#!/usr/bin/env node
// Simple WebSocket chat server for proof-of-concept terminal agent
// Run with: node chat-server.js

const WebSocket = require('ws')

const PORT = process.env.CHAT_SERVER_PORT || 3456
const wss = new WebSocket.Server({ port: PORT })

let client = null

wss.on('connection', function connection(ws) {
  if (client) try { client.close() } catch (e){}
  client = ws
  ws.on('message', function incoming(message) { console.log(String(message)) })
  ws.on('close', function() { client = null })
})

// read stdin lines and send to client
const readline = require('readline')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: '' })

rl.on('line', (line) => {
  const msg = line.trim()
  if (!msg) return
  if (client && client.readyState === WebSocket.OPEN) { client.send(msg) }
})
