package database

import (
	"fmt"
	"log"
	"os/exec"
	"syscall"

	"winbar/internal/dto"
	"winbar/internal/helpers"

	"github.com/distatus/battery"
	"github.com/itchyny/volume-go"
)

type SystemDB struct{}

func NewSystemDB() *SystemDB {
	return &SystemDB{}
}

func (db *SystemDB) GetBattery() dto.BatteryData {
	batt, err := battery.Get(0)
	if err != nil {
		return dto.BatteryData{Percentage: 0, IsCharging: false}
	}

	percentage := int((batt.Current / batt.Full) * 100)
	isCharging := batt.State.Raw == battery.Charging

	return dto.BatteryData{
		Percentage: percentage,
		IsCharging: isCharging,
	}
}

func (db *SystemDB) GetVolume() (dto.VolumeData, error) {
	vol, err := volume.GetVolume()
	if err != nil {
		return dto.VolumeData{}, err
	}
	muted, err := volume.GetMuted()
	if err != nil {
		muted = false
	}
	return dto.VolumeData{
		Level: vol,
		Muted: muted,
	}, nil
}

func (db *SystemDB) GetWifi() dto.WifiData {
	connected, signal := helpers.GetNativeWifiData()

	signalStr := "0%"
	if connected {
		signalStr = fmt.Sprintf("%d%%", signal)
	}

	return dto.WifiData{
		IsConnected: connected,
		Signal:      signalStr,
	}
}

func (db *SystemDB) OpenNotifications() {
	user32 := syscall.NewLazyDLL("user32.dll")
	keybdEvent := user32.NewProc("keybd_event")

	const VK_LWIN = 0x5B
	const VK_N = 0x4E
	const KEYEVENTF_KEYUP = 0x0002

	_, _, _ = keybdEvent.Call(uintptr(VK_LWIN), 0, 0, 0)
	_, _, _ = keybdEvent.Call(uintptr(VK_N), 0, 0, 0)
	_, _, _ = keybdEvent.Call(uintptr(VK_N), 0, uintptr(KEYEVENTF_KEYUP), 0)
	_, _, _ = keybdEvent.Call(uintptr(VK_LWIN), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

func (db *SystemDB) SwitchWorkspace(ws int) {
	if ws < 1 || ws > 9 {
		return
	}

	user32 := syscall.NewLazyDLL("user32.dll")
	keybdEvent := user32.NewProc("keybd_event")

	const VK_MENU = 0x12
	const KEYEVENTF_KEYUP = 0x0002

	vkCode := uintptr(0x30 + ws) // '1'

	_, _, _ = keybdEvent.Call(uintptr(VK_MENU), 0, 0, 0)
	_, _, _ = keybdEvent.Call(vkCode, 0, 0, 0)
	_, _, _ = keybdEvent.Call(vkCode, 0, uintptr(KEYEVENTF_KEYUP), 0)
	_, _, _ = keybdEvent.Call(uintptr(VK_MENU), 0, uintptr(KEYEVENTF_KEYUP), 0)
}

func (db *SystemDB) Shutdown() {
	if err := exec.Command("shutdown", "/s", "/t", "0").Run(); err != nil {
		log.Fatalf("Command failed to run: %v", err)
	}
}

func (db *SystemDB) Restart() {
	if err := exec.Command("shutdown", "/r", "/t", "0").Run(); err != nil {
		log.Fatalf("Command failed to run: %v", err)
	}
}

func (db *SystemDB) Sleep() {
	if err := exec.Command("rundll32.exe", "powrprof.dll,SetSuspendState", "0,1,0").Run(); err != nil {
		log.Fatalf("Command failed to run: %v", err)
	}
}
