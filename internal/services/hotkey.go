package services

import (
	"context"
	"log"
	"runtime"
	"unsafe"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
	"golang.org/x/sys/windows"
)

var (
	user32             = windows.NewLazySystemDLL("user32.dll")
	procRegisterHotKey = user32.NewProc("RegisterHotKey")
	procGetMessageW    = user32.NewProc("GetMessageW")
)

const (
	MOD_ALT     = 0x0001
	MOD_CONTROL = 0x0002
	MOD_SHIFT   = 0x0004
	MOD_WIN     = 0x0008

	VK_F24 = 0x87
)

type MSG struct {
	HWND    uintptr
	Message uint32
	WParam  uintptr
	LParam  uintptr
	Time    uint32
	Pt      struct{ X, Y int32 }
}

func RegisterHotkey(ctx context.Context) {
	go func() {
		runtime.LockOSThread()
		defer runtime.UnlockOSThread()

		ret, _, _ := procRegisterHotKey.Call(0, 1, uintptr(MOD_WIN|MOD_SHIFT), uintptr(VK_F24))
		if ret == 0 {
			log.Println("Failed to register global hotkey (Win+Shift+F24)")
			return
		}

		log.Println("Global hotkey (Win+Shift+F24) registered successfully")

		var msg MSG
		for {
			ret, _, _ := procGetMessageW.Call(uintptr(unsafe.Pointer(&msg)), 0, 0, 0)
			if ret == 0 || ret == ^uintptr(0) {
				break
			}
			if msg.Message == 0x0312 {
				if msg.WParam == 1 {
					wailsruntime.EventsEmit(ctx, "toggle_dashboard")
				}
			}
		}
	}()
}
