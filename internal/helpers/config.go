package helpers

import (
	"fmt"
	"os"

	"winbar/internal/dto"

	"gopkg.in/yaml.v2"
)

func LoadConfig() dto.Config {
	configPath := "config.yaml"

	writeDefault := false
	if info, err := os.Stat(configPath); os.IsNotExist(err) || (err == nil && info.Size() == 0) {
		writeDefault = true
	}

	if writeDefault {
		defaultConfig := dto.Config{
			Theme:   "default",
			Left:    []string{"power", "home", "theme_toggle", "overlay_toggle", "workspace"},
			Center:  []string{"day"},
			Right:   []string{"tray", "power"},
			Modules: []string{"yamw", "sysinfo", "companion", "notepad", "controlcenter", "server", "docker"},
			PrometheusURL: "http://localhost:9090",
		}
		yamlData, err := yaml.Marshal(&defaultConfig)
		if err == nil {
			err := os.WriteFile(configPath, yamlData, 0644)
			if err != nil {
				fmt.Println("Error writing default config:", err)
			}
		}
		return defaultConfig
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		fmt.Println("Error reading config:", err)
		return dto.Config{}
	}

	var cfg dto.Config
	err = yaml.Unmarshal(data, &cfg)
	if err != nil {
		fmt.Println("Error parsing config:", err)
		return dto.Config{}
	}

	if cfg.Theme == "" {
		cfg.Theme = "default"
	}

	return cfg
}

func SaveConfig(cfg dto.Config) error {
	configPath := "config.yaml"
	yamlData, err := yaml.Marshal(&cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(configPath, yamlData, 0644)
}
