package terminal

import (
	"os/exec"
)

type Terminal struct {
}

func NewTerminal() *Terminal {
	return &Terminal{}
}

// LaunchTerminal opens the native Windows Terminal app, falling back to powershell
func (h *Terminal) LaunchTerminal() error {
	cmd := exec.Command("wt.exe")
	err := cmd.Start()
	if err != nil {
		cmd = exec.Command("cmd.exe", "/c", "start", "powershell.exe")
		return cmd.Start()
	}
	return nil
}
