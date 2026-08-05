package services

import (
	"os/exec"
	"strconv"
	"strings"
	"winbar/internal/database"
	"winbar/internal/dto"

	"github.com/shirou/gopsutil/v4/cpu"
	"github.com/shirou/gopsutil/v4/disk"
	"github.com/shirou/gopsutil/v4/mem"
)

type SystemService struct {
	db *database.SystemDB
}

func NewSystemService(db *database.SystemDB) *SystemService {
	return &SystemService{db: db}
}

func (s *SystemService) GetSysInfo() dto.SysInfoData {
	data := dto.SysInfoData{}

	cpuPercents, err := cpu.Percent(0, false)
	if err == nil && len(cpuPercents) > 0 {
		data.CPUUsage = cpuPercents[0]
	}

	vmStat, err := mem.VirtualMemory()
	if err == nil {
		data.RAMUsage = vmStat.UsedPercent
		data.RAMUsedGB = float64(vmStat.Used) / (1024 * 1024 * 1024)
		data.RAMTotalGB = float64(vmStat.Total) / (1024 * 1024 * 1024)
	}

	diskStat, err := disk.Usage("C:\\")
	if err == nil {
		data.StorageUsage = diskStat.UsedPercent
		data.StorageUsedGB = float64(diskStat.Used) / (1024 * 1024 * 1024)
		data.StorageTotalGB = float64(diskStat.Total) / (1024 * 1024 * 1024)
	}

	cmd := exec.Command("nvidia-smi", "--query-gpu=utilization.gpu,memory.used,memory.total", "--format=csv,noheader,nounits")
	out, err := cmd.Output()
	if err == nil {
		lines := strings.Split(strings.TrimSpace(string(out)), "\n")
		if len(lines) > 0 {
			parts := strings.Split(lines[0], ",")
			if len(parts) >= 3 {
				if parsed, err := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64); err == nil {
					data.GPUUsage = parsed
				}
				if parsed, err := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64); err == nil {
					data.GPUUsedGB = parsed / 1024.0
				}
				if parsed, err := strconv.ParseFloat(strings.TrimSpace(parts[2]), 64); err == nil {
					data.GPUTotalGB = parsed / 1024.0
				}
			}
		}
	}

	return data
}

func (s *SystemService) GetBattery() dto.BatteryData {
	return s.db.GetBattery()
}

func (s *SystemService) GetVolume() (dto.VolumeData, error) {
	return s.db.GetVolume()
}

func (s *SystemService) GetWifi() dto.WifiData {
	return s.db.GetWifi()
}

func (s *SystemService) OpenNotifications() {
	s.db.OpenNotifications()
}

func (s *SystemService) SwitchWorkspace(ws int) {
	s.db.SwitchWorkspace(ws)
}

func (s *SystemService) Shutdown() {
	s.db.Shutdown()
}

func (s *SystemService) Restart() {
	s.db.Restart()
}

func (s *SystemService) Sleep() {
	s.db.Sleep()
}
