package handlers

import (
	"bytes"
	"context"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"winbar/internal/dto"
	"winbar/internal/helpers"
)

type Launcher struct {
	ctx context.Context
}

type AppFrontend struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Icon string `json:"icon"`
}

func NewLauncher() *Launcher {
	return &Launcher{}
}

func (h *Launcher) Startup(ctx context.Context) {
	h.ctx = ctx
}

func (h *Launcher) GetApps() []AppFrontend {
	cfg := helpers.LoadConfig()
	var apps []AppFrontend

	for _, app := range cfg.LauncherApps {
		iconB64 := extractIcon(app.Path)
		apps = append(apps, AppFrontend{
			Name: app.Name,
			Path: app.Path,
			Icon: iconB64,
		})
	}
	return apps
}

func (h *Launcher) AddApp() *AppFrontend {
	if h.ctx == nil {
		return nil
	}

	path, err := runtime.OpenFileDialog(h.ctx, runtime.OpenDialogOptions{
		Title: "Select Executable",
		Filters: []runtime.FileFilter{
			{DisplayName: "Executables (*.exe)", Pattern: "*.exe"},
		},
	})

	if err != nil || path == "" {
		return nil
	}

	name := filepath.Base(path)
	name = strings.TrimSuffix(name, filepath.Ext(name))

	cfg := helpers.LoadConfig()

	for _, app := range cfg.LauncherApps {
		if app.Path == path {
			return nil
		}
	}

	cfg.LauncherApps = append(cfg.LauncherApps, dto.AppConfig{
		Name: name,
		Path: path,
	})

	err = helpers.SaveConfig(cfg)
	if err != nil {
		return nil
	}

	iconB64 := extractIcon(path)
	return &AppFrontend{
		Name: name,
		Path: path,
		Icon: iconB64,
	}
}

func (h *Launcher) RemoveApp(path string) bool {
	cfg := helpers.LoadConfig()
	var newApps []dto.AppConfig
	for _, app := range cfg.LauncherApps {
		if app.Path != path {
			newApps = append(newApps, app)
		}
	}
	cfg.LauncherApps = newApps
	err := helpers.SaveConfig(cfg)
	return err == nil
}

func (h *Launcher) LaunchApp(path string) error {
	cmd := exec.Command(path)
	return cmd.Start()
}

func extractIcon(path string) string {
	script := `
		$path = "` + path + `"
		Add-Type -AssemblyName System.Drawing
		try {
			$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($path)
			if ($icon) {
				$bitmap = $icon.ToBitmap()
				$stream = New-Object System.IO.MemoryStream
				$bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
				$base64 = [Convert]::ToBase64String($stream.ToArray())
				Write-Output $base64
			}
		} catch {
		}
	`
	cmd := exec.Command("powershell", "-NoProfile", "-NonInteractive", "-Command", script)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	var out bytes.Buffer
	cmd.Stdout = &out
	err := cmd.Run()
	if err != nil {
		return ""
	}

	base64Str := strings.TrimSpace(out.String())
	if base64Str == "" {
		return ""
	}

	return "data:image/png;base64," + base64Str
}
