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
	
	yamwDB "winbar/internal/modules/yamw/database"
	yamwHandlers "winbar/internal/modules/yamw/handlers"
	yamwServices "winbar/internal/modules/yamw/services"
	aiHandlers "winbar/internal/modules/ai/handlers"
	aiServices "winbar/internal/modules/ai/services"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	
	systemDB := database.NewSystemDB()
	systemService := services.NewSystemService(systemDB)
	systemHandler := handlers.NewSystemHandler(systemService)

	Subsonic := yamwDB.NewSubsonic()

	hpService := yamwServices.NewHPService(Subsonic)
	yamwHealth := yamwHandlers.NewHealth(hpService)

	listServ := yamwServices.NewListServ(Subsonic)
	yamwList := yamwHandlers.NewList(listServ)

	streamServ := yamwServices.NewStreamServ()
	yamwStream := yamwHandlers.NewStream(streamServ)

	lrclib := yamwDB.NewLrclib()
	lyricsServ := yamwServices.NewLyricsServ(lrclib)
	yamwLyrics := yamwHandlers.NewLyrics(lyricsServ)

	chatServ := aiServices.NewChatServ()
	aiChat := aiHandlers.NewChat(chatServ)

	companionServ := aiServices.NewCompanionServ()
	aiCompanion := aiHandlers.NewCompanion(companionServ)

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
			yamwHealth,
			yamwList,
			yamwStream,
			yamwLyrics,
			aiChat,
			aiCompanion,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
