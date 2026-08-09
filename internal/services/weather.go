package services

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"winbar/internal/dto"
)

var cachedLat float64
var cachedLon float64
var hasLocation bool

type ipApiResponse struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type openMeteoResponse struct {
	CurrentWeather struct {
		Temperature float64 `json:"temperature"`
		WeatherCode int     `json:"weathercode"`
		IsDay       int     `json:"is_day"`
	} `json:"current_weather"`
}

func (s *SystemService) GetWeather() dto.WeatherData {
	if !hasLocation {
		client := &http.Client{Timeout: 3 * time.Second}
		resp, err := client.Get("http://ip-api.com/json/")
		if err == nil {
			defer func() {
				err := resp.Body.Close()
				if err != nil {
					log.Printf("weather close error: %v", err)
				}
			}()
			var ipRes ipApiResponse
			if json.NewDecoder(resp.Body).Decode(&ipRes) == nil {
				cachedLat = ipRes.Lat
				cachedLon = ipRes.Lon
				hasLocation = true
			}
		}
	}

	if !hasLocation {
		return dto.WeatherData{}
	}

	url := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current_weather=true", cachedLat, cachedLon)
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		fmt.Println("Weather fetch error:", err)
		return dto.WeatherData{}
	}
	defer func() {
		err := resp.Body.Close()
		if err != nil {
			log.Printf("weather close error: %v", err)
		}
	}()

	var omRes openMeteoResponse
	if err := json.NewDecoder(resp.Body).Decode(&omRes); err != nil {
		fmt.Println("Weather decode error:", err)
		return dto.WeatherData{}
	}

	return dto.WeatherData{
		Temperature: omRes.CurrentWeather.Temperature,
		WeatherCode: omRes.CurrentWeather.WeatherCode,
		IsDay:       omRes.CurrentWeather.IsDay == 1,
	}
}
