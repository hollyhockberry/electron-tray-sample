const { app, Tray, Menu, Notification, nativeImage, powerMonitor } = require('electron')
const scanner = require('node-wifi-scanner');
const log = require('electron-log');

const findap = () => {
  scanner.scan((err, networks) => {
    if (err) {
      console.error(err)
      return
    }
    const ssids = networks.map(n => n['ssid'])
    if (ssids.length > 0) {
      new Notification({
        title: 'WiFi AP',
        body: `Found ${ssids.length} access point`,
        silent: true,
      }).show()
    }
  })
}

app.whenReady().then(() => {
  log.info('begin')
  const img = nativeImage.createFromPath(__dirname + "/assets/tray.png")
  let tray = new Tray(img)
  tray.setToolTip('Tray app')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Quit', role: 'quit' }
  ]))
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
  powerMonitor.on('suspend', () =>{
    log.info('suspend')
  })
  powerMonitor.on('resume', () =>{
    log.info('resume')
  })
  powerMonitor.on('shutdown', () =>{
    log.info('shutdown')
  })
  setInterval(() => findap(), 30 * 1000)
  findap()
})
