package helpers

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"winbar/internal/dto"
)

func LoadTheme(themeName string) dto.Theme {
	themeDir := "themes"
	themePath := filepath.Join(themeDir, themeName+".json")

	// Ensure themes directory exists
	if _, err := os.Stat(themeDir); os.IsNotExist(err) {
		os.MkdirAll(themeDir, 0755)
	}

	defaultTheme := dto.Theme{
		Name:   "Default Theme",
		Author: "WinBar",
		Colors: dto.ThemeColors{
			Widget:            "rgba(59, 130, 246, 0.5)",
			WidgetHover:       "rgba(59, 130, 246, 0.7)",
			WidgetActive:      "rgba(168, 85, 247, 0.8)",
			WidgetActiveHover: "rgba(168, 85, 247, 0.6)",
			WidgetText:        "#ffffff",
			Background:        "rgba(30, 58, 138, 0.9)",
		},
	}

	// If theme file does not exist, create it with default template
	if _, err := os.Stat(themePath); os.IsNotExist(err) {
		jsonData, _ := json.MarshalIndent(defaultTheme, "", "  ")
		os.WriteFile(themePath, jsonData, 0644)
		return defaultTheme
	}

	// Read existing theme
	data, err := os.ReadFile(themePath)
	if err != nil {
		fmt.Println("Error reading theme file:", err)
		return defaultTheme
	}

	var theme dto.Theme
	err = json.Unmarshal(data, &theme)
	if err != nil {
		fmt.Println("Error parsing theme JSON:", err)
		return defaultTheme
	}

	return theme
}

func ListThemes() []string {
	themeDir := "themes"
	var themes []string

	// Ensure directory exists
	if _, err := os.Stat(themeDir); os.IsNotExist(err) {
		return []string{"default"}
	}

	entries, err := os.ReadDir(themeDir)
	if err != nil {
		return []string{"default"}
	}

	for _, entry := range entries {
		if !entry.IsDir() && filepath.Ext(entry.Name()) == ".json" {
			name := entry.Name()
			themes = append(themes, name[:len(name)-5]) // strip .json
		}
	}

	if len(themes) == 0 {
		return []string{"default"}
	}

	return themes
}
