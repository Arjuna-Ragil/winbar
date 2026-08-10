package services

import (
	"fmt"
	"os/exec"
	"strings"
	"syscall"
	"winbar/internal/dto"

	"github.com/itchyny/volume-go"
)

type ControlService struct{}

func NewControlService() *ControlService {
	return &ControlService{}
}

func (s *ControlService) GetVolume() (int, error) {
	return volume.GetVolume()
}

func (s *ControlService) SetVolume(v int) error {
	return volume.SetVolume(v)
}

func (s *ControlService) GetBrightness() (int, error) {
	cmd := exec.Command("powershell", "-Command", "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightness).CurrentBrightness")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	out, err := cmd.Output()
	if err != nil {
		return 0, err
	}
	var b int
	_, err = fmt.Sscanf(strings.TrimSpace(string(out)), "%d", &b)
	if err != nil {
		return 0, err
	}
	return b, nil
}

func (s *ControlService) SetBrightness(b int) error {
	cmd := exec.Command("powershell", "-Command", fmt.Sprintf("(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, %d)", b))
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Run()
}

func (s *ControlService) GetWifiNetworks() []dto.WifiNetwork {
	cmd := exec.Command("netsh", "wlan", "show", "networks", "mode=bssid")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	out, err := cmd.Output()
	if err != nil {
		return nil
	}

	lines := strings.Split(string(out), "\n")
	var networks []dto.WifiNetwork
	var current dto.WifiNetwork

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "SSID") {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) == 2 {
				current = dto.WifiNetwork{SSID: strings.TrimSpace(parts[1])}
				if current.SSID == "" {
					current.SSID = "Hidden Network"
				}
			}
		} else if strings.HasPrefix(line, "Authentication") {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) == 2 {
				current.Security = strings.TrimSpace(parts[1])
			}
		} else if strings.HasPrefix(line, "Signal") {
			parts := strings.SplitN(line, ":", 2)
			if len(parts) == 2 {
				var sig int
				_, err := fmt.Sscanf(strings.TrimSpace(parts[1]), "%d%%", &sig)
				if err != nil {
					continue
				}
				current.Signal = sig

				found := false
				for i, n := range networks {
					if n.SSID == current.SSID {
						found = true
						if current.Signal > n.Signal {
							networks[i].Signal = current.Signal
						}
						break
					}
				}
				if !found && current.SSID != "Hidden Network" {
					networks = append(networks, current)
				}
			}
		}
	}
	return networks
}

func (s *ControlService) ConnectWifi(ssid string) error {
	cmd := exec.Command("netsh", "wlan", "connect", fmt.Sprintf("name=\"%s\"", ssid))
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	return cmd.Run()
}
