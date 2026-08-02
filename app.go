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

	"github.com/lxn/win"
	"github.com/wailsapp/wails/v2/pkg/runtime"
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
	ctx context.Context
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
			Bottom: 50,
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
		10, 
		5,
		screenWidth - 20,
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
			conn.Close()
		}
	}()
}
