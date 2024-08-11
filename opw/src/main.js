// main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow ,globalShortcut} = require('electron')
const path = require('path')
const{Menu, shell} = require('electron')
function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: 'favicon.ico',
    title: "OP",
    webPreferences: {
      nodeIntegration: true, // 设置开启nodejs环境
      enableRemoteModule: true, // enableRemoteModule保证renderer.js可以可以正常require('electron').remote，此选项默认关闭且网上很多资料没有提到
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  // mainWindow.loadFile('index.html') // 此处跟electron官网路径不同，需要注意
mainWindow.loadURL('http://localhost:5173/')
  var menuTemplete= [
    {
      label: '文件',
      submenu:[{
        label: '新建', // 子菜单的名字
        accelerator: 'ctrl+N', // 菜单的快捷键
        click:()=>{
          var newWin = new BrowserWindow({
            width: 400,
            height: 400,
            webPreferences: {
              nodeIntegration: true, // 设置开启nodejs环境
              enableRemoteModule: true // enableRemoteModule保证renderer.js可以可以正常require('electron').remote，此选项默认关闭且网上很多资料没有提到
            }
          })
          // const pagePath = path.resolve(__dirname, './src/html/subPage.html')
          // newWin.loadFile(pagePath)
          newWin.on('close',()=>{
            console.log('close')
            newWin=null
          })
        }
      },{
        type: 'separator'
      },
      {
        label: '退出',
        accelerator: 'ctrl+Q', // 菜单的快捷键
        click:()=>{
          app.quit()
        }
    
    }]
    },
    {
      label: '编辑',
      submenu:[
        {
          label:'复制',
          role: 'copy',
          click(){
            console.log('copy')
          }
        },
        {
            label: '剪切',
            role: 'cut'
        },
        {
            label:'粘贴',
            role: 'paste'
        },
        {
          label:'最小化',
          role: 'minimize'
      },
      ]
    },
    {
      label: 'Dev Tools', // 打开开发者工具
      accelerator: (function() {
        if (process.platform === 'darwin') { return 'Alt+Command+I' } else { return 'Ctrl+w' }
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow) { focusedWindow.toggleDevTools() }
      }
    },
    {label: 'Pte练习',
    submenu:[{
      label: '萤火虫PTE',
      click(){
        shell.openExternal('https://www.fireflyau.com/')// 跳转网页
        .then(() => console.log('打开链接成功'))
        .catch((err) => console.error('打开链接失败', err));
    
      }
    },{
      label: '猩际PTE',
      click(){
        shell.openExternal('https://www.ptexj.com/')
        .then(() => console.log('打开链接成功'))
        .catch((err) => console.error('打开链接失败', err));
    
      }
    },{
      label: 'PTEGO',
      click(){
        shell.openExternal('https://web.ptego.com/#/')
        .then(() => console.log('打开链接成功'))
        .catch((err) => console.error('打开链接失败', err));
    
      }
    }
  ]},
    {
      label: '关于',
      role: 'about'
    }
  ]
  // 根据配置信息创建 menu 对象
  var menuObj=Menu.buildFromTemplate(menuTemplete)
  // 将对象作用当当前应用中
  Menu.setApplicationMenu(menuObj)
// 开启渲染进程中的调试模式
  // win.webContents.openDevTools()
  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})