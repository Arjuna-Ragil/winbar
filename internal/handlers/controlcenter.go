package handlers

import (
	"winbar/internal/dto"
	"winbar/internal/services"
)

type ControlHandler struct {
	service *services.ControlService
}

func NewControlHandler(service *services.ControlService) *ControlHandler {
	return &ControlHandler{service: service}
}

func (h *ControlHandler) GetVolume() (int, error) {
	return h.service.GetVolume()
}

func (h *ControlHandler) SetVolume(v int) error {
	return h.service.SetVolume(v)
}

func (h *ControlHandler) GetBrightness() (int, error) {
	return h.service.GetBrightness()
}

func (h *ControlHandler) SetBrightness(b int) error {
	return h.service.SetBrightness(b)
}

func (h *ControlHandler) GetWifiNetworks() []dto.WifiNetwork {
	return h.service.GetWifiNetworks()
}

func (h *ControlHandler) ConnectWifi(ssid string) error {
	return h.service.ConnectWifi(ssid)
}
