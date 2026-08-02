package handlers

import (
	"winbar/internal/dto"
	"winbar/internal/helpers"
	"winbar/internal/services"
)

type SystemHandler struct {
	service *services.SystemService
}

func NewSystemHandler(service *services.SystemService) *SystemHandler {
	return &SystemHandler{service: service}
}

func (h *SystemHandler) GetBattery() dto.BatteryData {
	return h.service.GetBattery()
}

func (h *SystemHandler) GetVolume() dto.VolumeData {
	return h.service.GetVolume()
}

func (h *SystemHandler) GetWifi() dto.WifiData {
	return h.service.GetWifi()
}

func (h *SystemHandler) OpenNotifications() {
	h.service.OpenNotifications()
}

func (h *SystemHandler) GetConfig() dto.Config {
	return helpers.LoadConfig()
}
