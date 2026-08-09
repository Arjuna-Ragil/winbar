package helpers

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"winbar/internal/dto"
)

func getPredefinedThemes() map[string]dto.Theme {
	return map[string]dto.Theme{
		"default": {
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
		},
		"dracula": {
			Name:   "Dracula Theme",
			Author: "WinBar",
			Colors: dto.ThemeColors{
				Widget:            "rgba(68, 71, 90, 0.7)",
				WidgetHover:       "rgba(98, 114, 164, 0.8)",
				WidgetActive:      "rgba(189, 147, 249, 0.8)",
				WidgetActiveHover: "rgba(255, 121, 198, 0.8)",
				WidgetText:        "#f8f8f2",
				Background:        "rgba(40, 42, 54, 1)",
			},
		},
		"nord": {
			Name:   "Nord Theme",
			Author: "WinBar",
			Colors: dto.ThemeColors{
				Widget:            "rgba(59, 66, 82, 0.7)",
				WidgetHover:       "rgba(67, 76, 94, 0.8)",
				WidgetActive:      "rgba(136, 192, 208, 0.8)",
				WidgetActiveHover: "rgba(129, 161, 193, 0.8)",
				WidgetText:        "#eceff4",
				Background:        "rgba(46, 52, 64, 1)",
			},
		},
		"monokai": {
			Name:   "Monokai Theme",
			Author: "WinBar",
			Colors: dto.ThemeColors{
				Widget:            "rgba(73, 72, 62, 0.7)",
				WidgetHover:       "rgba(117, 113, 94, 0.8)",
				WidgetActive:      "rgba(249, 38, 114, 0.8)",
				WidgetActiveHover: "rgba(166, 226, 46, 0.8)",
				WidgetText:        "#f8f8f2",
				Background:        "rgba(39, 40, 34, 1)",
			},
		},
		"solarized": {
			Name:   "Solarized Dark",
			Author: "WinBar",
			Colors: dto.ThemeColors{
				Widget:            "rgba(7, 54, 66, 0.7)",
				WidgetHover:       "rgba(88, 110, 117, 0.8)",
				WidgetActive:      "rgba(38, 139, 210, 0.8)",
				WidgetActiveHover: "rgba(42, 161, 152, 0.8)",
				WidgetText:        "#839496",
				Background:        "rgba(0, 43, 54, 1)",
			},
		},
	}
}

func InitializeThemes() {
	themeDir := "themes"
	
	if _, err := os.Stat(themeDir); os.IsNotExist(err) {
		if err := os.MkdirAll(themeDir, 0755); err != nil {
			fmt.Println("Error creating themes directory:", err)
			return
		}
	}

	predefined := getPredefinedThemes()
	for key, theme := range predefined {
		themePath := filepath.Join(themeDir, key+".json")
		if _, err := os.Stat(themePath); os.IsNotExist(err) {
			jsonData, _ := json.MarshalIndent(theme, "", "  ")
			if err := os.WriteFile(themePath, jsonData, 0644); err != nil {
				fmt.Println("Error writing predefined theme:", err)
			}
		}
	}
}

func LoadTheme(themeName string) dto.Theme {
	themeDir := "themes"
	themePath := filepath.Join(themeDir, themeName+".json")

	predefined := getPredefinedThemes()
	
	fallbackTheme := predefined["default"]
	if pt, exists := predefined[strings.ToLower(themeName)]; exists {
		fallbackTheme = pt
	}

	InitializeThemes()

	if _, err := os.Stat(themePath); os.IsNotExist(err) {
		jsonData, _ := json.MarshalIndent(fallbackTheme, "", "  ")
		if err := os.WriteFile(themePath, jsonData, 0644); err != nil {
			fmt.Println("Error writing theme:", err)
		}
		return fallbackTheme
	}

	data, err := os.ReadFile(themePath)
	if err != nil {
		fmt.Println("Error reading theme file:", err)
		return fallbackTheme
	}

	var theme dto.Theme
	err = json.Unmarshal(data, &theme)
	if err != nil {
		fmt.Println("Error parsing theme JSON:", err)
		return fallbackTheme
	}

	return theme
}

func ListThemes() []string {
	themeDir := "themes"
	var themes []string

	InitializeThemes()

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
