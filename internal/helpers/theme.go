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

	if _, err := os.Stat(themeDir); os.IsNotExist(err) {
		if err := os.MkdirAll(themeDir, 0755); err != nil {
			fmt.Println("Error creating themes directory:", err)
		}
	}

	defaultTheme := dto.Theme{
		Name:   "Default Theme",
		Author: "WinBar",
		Colors: dto.ThemeColors{
			Widget:            "rgba(5, 73, 109, 0.5)",
			WidgetHover:       "rgba(43, 107, 185, 0.7)",
			WidgetActive:      "rgba(9, 119, 147, 0.8)",
			WidgetActiveHover: "rgba(47, 177, 209, 0.8)",
			WidgetText:        "#ffffff",
			Background:        "rgba(8, 16, 39, 1)",
		},
	}

	if _, err := os.Stat(themePath); os.IsNotExist(err) {
		jsonData, _ := json.MarshalIndent(defaultTheme, "", "  ")
		if err := os.WriteFile(themePath, jsonData, 0644); err != nil {
			fmt.Println("Error writing default theme:", err)
		}
		return defaultTheme
	}

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
			themes = append(themes, name[:len(name)-5])
		}
	}

	if len(themes) == 0 {
		return []string{"default"}
	}

	return themes
}
