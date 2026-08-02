package main

import (
	"embed"

	"github.com/lxn/win"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
	
	"winbar/internal/database"
	"winbar/internal/handlers"
	"winbar/internal/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	
	systemDB := database.NewSystemDB()
	systemService := services.NewSystemService(systemDB)
	systemHandler := handlers.NewSystemHandler(systemService)

	screenWidth := win.GetSystemMetrics(win.SM_CXSCREEN)

	// Create application with options
	err := wails.Run(&options.App{
		Title:       "winbar",
		Width:       int(screenWidth),
		Height:      40,
		Frameless:   true,
		DisableResize: true,
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent: true,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{A: 0},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			systemHandler,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
