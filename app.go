package main

import (
	"bufio"
	"context"
	_ "embed"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
	"time"
	"unsafe"

	"github.com/getlantern/systray"
	"github.com/lxn/win"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/sys/windows/registry"
	yamwHelper "winbar/internal/modules/yamw/helpers"
)

//go:embed build/windows/icon.ico
var iconData []byte

const (
	ABM_NEW = 0
	ABM_QUERYPOS = 2
	ABM_SETPOS = 3
	ABE_TOP = 1
)

type APPBARDATA struct{
	cbSize 	uint32
	hwnd   	win.HWND
	uCallbackMessage uint32
	uEdge uint32
	rc 	win.RECT
	lparam uintptr
}

type App struct {
	ctx  context.Context
	hwnd win.HWND
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	pwd, _ := os.Getwd()
	themesPath := filepath.Join(pwd, "themes")
	if _, err := os.Stat(themesPath); os.IsNotExist(err) {
		os.MkdirAll(themesPath, 0755)
	}
	
	configPath := filepath.Join(pwd, "config.yaml")
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		os.WriteFile(configPath, []byte(""), 0644)
	}
	shell32 := syscall.NewLazyDLL("shell32.dll")

	title, err := syscall.UTF16PtrFromString("winbar")
	if err != nil {
		return
	}
	hwnd := win.FindWindow(nil, title)
	if hwnd == 0 {
		return
	}
	a.hwnd = hwnd
	proc := shell32.NewProc("SHAppBarMessage")
	if proc == nil {
		fmt.Println("Failed to find SHAppBarMessage")
		return
	}
	screenWidth := win.GetSystemMetrics(win.SM_CXSCREEN)
	abb := APPBARDATA{
		cbSize: uint32(unsafe.Sizeof(APPBARDATA{})),
		hwnd:   hwnd,
		uCallbackMessage: win.WM_USER + 1,
		uEdge: ABE_TOP,
		rc: win.RECT{
			Left: 0,
			Top: 0,
			Right: screenWidth,
			Bottom: 40,
		},
	}
	proc.Call(uintptr(ABM_NEW), uintptr(unsafe.Pointer(&abb)))
	proc.Call(uintptr(ABM_QUERYPOS), uintptr(unsafe.Pointer(&abb)))
	proc.Call(uintptr(ABM_SETPOS), uintptr(unsafe.Pointer(&abb)))

	style := win.GetWindowLong(hwnd, win.GWL_STYLE)
	style = style &^ (win.WS_BORDER | win.WS_THICKFRAME)
	win.SetWindowLong(hwnd, win.GWL_STYLE, style)

	exStyle := win.GetWindowLong(hwnd, win.GWL_EXSTYLE)
	exStyle = exStyle | win.WS_EX_TOOLWINDOW
	exStyle = exStyle &^ win.WS_EX_APPWINDOW
	win.SetWindowLong(hwnd, win.GWL_EXSTYLE, exStyle)

	win.SetWindowPos(
		hwnd, 
		win.HWND_NOTOPMOST,
		0, 
		0,
		screenWidth,
		40,
		win.SWP_NOACTIVATE | win.SWP_FRAMECHANGED,
	)

	go func() {
		for {
			conn, err := os.OpenFile(`\\.\pipe\SpaceWorkspace`, os.O_RDWR, 0)
			if err != nil {
				time.Sleep(2 * time.Second)
				continue
			}
			scanner := bufio.NewScanner(conn)
			if err := scanner.Err(); err != nil {
				continue
			}
			for scanner.Scan() {
				ws := strings.TrimSpace(scanner.Text())
				runtime.EventsEmit(ctx, "workspace_changed", ws)
			}
		}
	}()

	go systray.Run(a.onReady, a.onExit)
}

func (a *App) ExpandWindow() {
	if a.hwnd == 0 {
		return
	}
	screenWidth := win.GetSystemMetrics(win.SM_CXSCREEN)
	screenHeight := win.GetSystemMetrics(win.SM_CYSCREEN)
	win.SetWindowPos(a.hwnd, win.HWND_TOPMOST, 0, 0, screenWidth, screenHeight, win.SWP_NOACTIVATE)
}

func (a *App) ShrinkWindow() {
	if a.hwnd == 0 {
		return
	}
	screenWidth := win.GetSystemMetrics(win.SM_CXSCREEN)
	win.SetWindowPos(a.hwnd, win.HWND_NOTOPMOST, 0, 0, screenWidth, 40, win.SWP_NOACTIVATE)
}

func (a *App) HasConfig() bool {
	path, err := yamwHelper.GetConfigPath()
	if err != nil {
		return false
	}
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return false
	}
	return true
}

func (a *App) SaveConfig(serverURL, username, password string) error {
	path, err := yamwHelper.GetConfigPath()
	if err != nil {
		return err
	}
	
	config := yamwHelper.Config{
		ServerURL: serverURL,
		Username:  username,
		Password:  password,
	}
	
	data, err := json.Marshal(config)
	if err != nil {
		return err
	}
	
	return os.WriteFile(path, data, 0644)
}

func (a *App) onReady() {
	systray.SetIcon(iconData)
	systray.SetTitle("Winbar")
	systray.SetTooltip("Winbar")

	mConfig := systray.AddMenuItem("Open Config", "Open Configuration")
	mThemes := systray.AddMenuItem("Open Themes", "Open Themes")
	mRunOnLaunch := systray.AddMenuItemCheckbox("Run on Launch", "Run Winbar on system startup", a.isRunOnLaunchEnabled())
	
	systray.AddSeparator()
	mQuit := systray.AddMenuItem("Quit", "Quit Winbar")

	go func() {
		for {
			select {
			case <-mConfig.ClickedCh:
				pwd, _ := os.Getwd()
				exec.Command("explorer", "/select,", filepath.Join(pwd, "config.yaml")).Start()
			case <-mThemes.ClickedCh:
				pwd, _ := os.Getwd()
				exec.Command("explorer", filepath.Join(pwd, "themes")).Start()
			case <-mRunOnLaunch.ClickedCh:
				if mRunOnLaunch.Checked() {
					a.toggleRunOnLaunch(false)
					mRunOnLaunch.Uncheck()
				} else {
					a.toggleRunOnLaunch(true)
					mRunOnLaunch.Check()
				}
			case <-mQuit.ClickedCh:
				systray.Quit()
			}
		}
	}()
}

func (a *App) toggleRunOnLaunch(enabled bool) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	key, err := registry.OpenKey(registry.CURRENT_USER, `Software\Microsoft\Windows\CurrentVersion\Run`, registry.ALL_ACCESS)
	if err != nil {
		return err
	}
	defer key.Close()

	if enabled {
		return key.SetStringValue("Winbar", exePath)
	} else {
		return key.DeleteValue("Winbar")
	}
}

func (a *App) isRunOnLaunchEnabled() bool {
	key, err := registry.OpenKey(registry.CURRENT_USER, `Software\Microsoft\Windows\CurrentVersion\Run`, registry.QUERY_VALUE)
	if err != nil {
		return false
	}
	defer key.Close()
	_, _, err = key.GetStringValue("Winbar")
	return err == nil
}

func (a *App) onExit() {
	runtime.Quit(a.ctx)
}
