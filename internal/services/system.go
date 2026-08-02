package services

import (
	"winbar/internal/database"
	"winbar/internal/dto"
)

type SystemService struct {
	db *database.SystemDB
}

func NewSystemService(db *database.SystemDB) *SystemService {
	return &SystemService{db: db}
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
