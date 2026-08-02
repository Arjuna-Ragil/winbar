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

func (h *SystemHandler) GetVolume() (dto.VolumeData, error) {
	return h.service.GetVolume()
}

func (h *SystemHandler) GetWifi() dto.WifiData {
	return h.service.GetWifi()
}

func (h *SystemHandler) GetWeather() dto.WeatherData {
	return h.service.GetWeather()
}

func (h *SystemHandler) OpenNotifications() {
	h.service.OpenNotifications()
}

func (h *SystemHandler) GetConfig() dto.Config {
	return helpers.LoadConfig()
}

func (h *SystemHandler) GetTheme() dto.Theme {
	cfg := h.GetConfig()
	if cfg.Theme == "" {
		cfg.Theme = "default"
	}
	return helpers.LoadTheme(cfg.Theme)
}

func (h *SystemHandler) GetThemes() []string {
	return helpers.ListThemes()
}

func (h *SystemHandler) SetTheme(themeName string) error {
	cfg := h.GetConfig()
	cfg.Theme = themeName
	return helpers.SaveConfig(cfg)
}

func (h *SystemHandler) SwitchWorkspace(ws int) {
	h.service.SwitchWorkspace(ws)
}

func (h *SystemHandler) Shutdown() {
	h.service.Shutdown()
}

func (h *SystemHandler) Restart() {
	h.service.Restart()
}

func (h *SystemHandler) Sleep() {
	h.service.Sleep()
}
