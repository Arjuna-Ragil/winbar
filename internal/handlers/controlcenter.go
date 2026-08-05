package handlers

import (
	"winbar/internal/dto"
	"winbar/internal/services"
)

type ControlCenterHandler struct {
	service *services.ControlCenterService
}

func NewControlCenterHandler(service *services.ControlCenterService) *ControlCenterHandler {
	return &ControlCenterHandler{service: service}
}

func (h *ControlCenterHandler) GetVolume() (int, error) {
	return h.service.GetVolume()
}

func (h *ControlCenterHandler) SetVolume(v int) error {
	return h.service.SetVolume(v)
}

func (h *ControlCenterHandler) GetBrightness() (int, error) {
	return h.service.GetBrightness()
}

func (h *ControlCenterHandler) SetBrightness(b int) error {
	return h.service.SetBrightness(b)
}

func (h *ControlCenterHandler) GetWifiNetworks() []dto.WifiNetwork {
	return h.service.GetWifiNetworks()
}

func (h *ControlCenterHandler) ConnectWifi(ssid string) error {
	return h.service.ConnectWifi(ssid)
}
