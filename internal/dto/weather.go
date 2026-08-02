package dto

type WeatherData struct {
	Temperature float64 `json:"temperature"`
	WeatherCode int     `json:"weatherCode"`
	IsDay       bool    `json:"isDay"`
}
