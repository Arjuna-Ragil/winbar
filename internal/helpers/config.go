package helpers

import (
	"fmt"
	"os"

	"winbar/internal/dto"

	"github.com/yaml/go-yaml"
)

func LoadConfig() dto.Config {
	configPath := "config.yaml"
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		defaultConfig := dto.Config{
			Theme:  "default",
			Left:   []string{},
			Center: []string{"clock"},
			Right:  []string{},
		}
		yamlData, _ := yaml.Marshal(&defaultConfig)
		os.WriteFile(configPath, yamlData, 0644)
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
