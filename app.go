package main

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strings"
	"syscall"
	"time"
	"unsafe"
	"encoding/json"

	"github.com/lxn/win"
	"github.com/wailsapp/wails/v2/pkg/runtime"
	yamwHelper "winbar/internal/modules/yamw/helpers"
)

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

	win.SetWindowPos(
		hwnd, 
		win.HWND_TOPMOST,
		0, 
		0,
		screenWidth,
		40,
		win.SWP_NOACTIVATE,
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
	win.SetWindowPos(a.hwnd, win.HWND_TOPMOST, 0, 0, screenWidth, 40, win.SWP_NOACTIVATE)
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
