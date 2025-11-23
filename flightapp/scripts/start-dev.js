#!/usr/bin/env node
const { exec, spawn } = require('child_process')

const isWin = process.platform === 'win32'

if (isWin) {
  const cmd = 'cmd.exe /c start powershell -NoExit -Command "npm run chat-server"'
  exec(cmd, (err) => { if (err) console.error('Failed to open chat server window:', err) })

  const child = spawn('npm', ['run', 'dev:serve'], { stdio: 'inherit', shell: true })
  child.on('exit', (code) => process.exit(code))
} else {
  const chat = spawn('npm', ['run', 'chat-server'], { stdio: 'inherit', shell: true })
  chat.on('spawn', () => { const child = spawn('npm', ['run', 'dev:serve'], { stdio: 'inherit', shell: true }); child.on('exit', (code) => process.exit(code)) })
}
