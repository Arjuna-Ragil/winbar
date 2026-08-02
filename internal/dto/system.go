package dto

type BatteryData struct {
	Percentage int  `json:"percentage"`
	IsCharging bool `json:"isCharging"`
}

type VolumeData struct {
	Level int  `json:"level"`
	Muted bool `json:"muted"`
}

type WifiData struct {
	IsConnected bool   `json:"isConnected"`
	Signal      string `json:"signal"`
}
