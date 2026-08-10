package main

import (
	"context"
	"embed"

	"github.com/lxn/win"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"

	"winbar/internal/database"
	"winbar/internal/handlers"
	"winbar/internal/services"

	companionHandlers "winbar/internal/modules/companion/handlers"
	companionServices "winbar/internal/modules/companion/services"
	yamwDB "winbar/internal/modules/yamw/database"
	yamwHandlers "winbar/internal/modules/yamw/handlers"
	yamwServices "winbar/internal/modules/yamw/services"

	containerHandlers "winbar/internal/modules/container/handlers"
	launcherHandlers "winbar/internal/modules/launcher/handlers"
	serverHandlers "winbar/internal/modules/server/handlers"
	terminalHandlers "winbar/internal/modules/terminal"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	systemDB := database.NewSystemDB()
	systemService := services.NewSystemService(systemDB)
	systemHandler := handlers.NewSystemHandler(systemService)

	ccService := services.NewControlService()
	ccHandler := handlers.NewControlHandler(ccService)

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

	chatServ := companionServices.NewChatServ()
	companionChat := companionHandlers.NewChat(chatServ)

	companionServ := companionServices.NewCompanionServ()
	companion := companionHandlers.NewCompanion(companionServ)

	promService := services.NewPrometheusService()
	serverHandler := serverHandlers.NewServer(promService)
	containerHandler := containerHandlers.NewContainer(promService)
	launcherHandler := launcherHandlers.NewLauncher()

	terminalHandler := terminalHandlers.NewTerminal()

	screenWidth := win.GetSystemMetrics(win.SM_CXSCREEN)

	err := wails.Run(&options.App{
		Title:         "winbar",
		Width:         int(screenWidth),
		Height:        40,
		Frameless:     true,
		DisableResize: true,
		Windows: &windows.Options{
			WebviewIsTransparent: true,
			WindowIsTranslucent:  true,
		},
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{A: 0},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			launcherHandler.Startup(ctx)
			_, _ = companionServ.GetCompanions()
		},
		Bind: []interface{}{
			app,
			systemHandler,
			ccHandler,
			yamwHealth,
			yamwList,
			yamwStream,
			yamwLyrics,
			companionChat,
			companion,
			serverHandler,
			containerHandler,
			terminalHandler,
			launcherHandler,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
