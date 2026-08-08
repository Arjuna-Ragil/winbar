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
func (h *Terminal) LaunchTerminal(sshTarget string) error {
	var cmd *exec.Cmd
	if sshTarget != "" {
		cmd = exec.Command("wt.exe", "ssh", sshTarget)
	} else {
		cmd = exec.Command("wt.exe")
	}

	err := cmd.Start()
	if err != nil {
		if sshTarget != "" {
			cmd = exec.Command("cmd.exe", "/c", "start", "powershell.exe", "-NoExit", "-Command", "ssh "+sshTarget)
		} else {
			cmd = exec.Command("cmd.exe", "/c", "start", "powershell.exe")
		}
		return cmd.Start()
	}
	return nil
}
