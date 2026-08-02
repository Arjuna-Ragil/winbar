package database

import (
	"os/exec"
	"strings"
	"syscall"

	"winbar/internal/dto"

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

func (db *SystemDB) GetVolume() dto.VolumeData {
	vol, err := volume.GetVolume()
	if err != nil {
		return dto.VolumeData{Level: 0, Muted: false}
	}
	muted, err := volume.GetMuted()
	if err != nil {
		muted = false
	}
	return dto.VolumeData{
		Level: vol,
		Muted: muted,
	}
}

func (db *SystemDB) GetWifi() dto.WifiData {
	cmd := exec.Command("netsh", "wlan", "show", "interfaces")
	out, err := cmd.Output()
	if err != nil {
		return dto.WifiData{IsConnected: false, Signal: "0%"}
	}
	
	output := string(out)
	
	var isConnected bool
	var signal string = "0%"

	lines := strings.Split(output, "\n")
	for _, line := range lines {
		if strings.Contains(line, "State") && strings.Contains(line, "connected") {
			isConnected = true
		}
		if strings.Contains(line, "Signal") {
			parts := strings.Split(line, ":")
			if len(parts) > 1 {
				signal = strings.TrimSpace(parts[1])
			}
		}
	}

	return dto.WifiData{
		IsConnected: isConnected,
		Signal:      signal,
	}
}

func (db *SystemDB) OpenNotifications() {
	user32 := syscall.NewLazyDLL("user32.dll")
	keybdEvent := user32.NewProc("keybd_event")

	const VK_LWIN = 0x5B
	const VK_N = 0x4E
	const KEYEVENTF_KEYUP = 0x0002

	keybdEvent.Call(uintptr(VK_LWIN), 0, 0, 0)
	keybdEvent.Call(uintptr(VK_N), 0, 0, 0)
	keybdEvent.Call(uintptr(VK_N), 0, uintptr(KEYEVENTF_KEYUP), 0)
	keybdEvent.Call(uintptr(VK_LWIN), 0, uintptr(KEYEVENTF_KEYUP), 0)
}
