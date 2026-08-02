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

func (s *SystemService) GetVolume() dto.VolumeData {
	return s.db.GetVolume()
}

func (s *SystemService) GetWifi() dto.WifiData {
	return s.db.GetWifi()
}

func (s *SystemService) OpenNotifications() {
	s.db.OpenNotifications()
}
