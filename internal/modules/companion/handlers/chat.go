package handlers

import "winbar/internal/modules/companion/services"

type Chat struct {
	ChatServ *services.ChatServ
}

func NewChat(chatServ *services.ChatServ) *Chat {
	return &Chat{ChatServ: chatServ}
}

func (c *Chat) Prompt(messages []services.ChatMessage) (string, error) {
	return c.ChatServ.Prompt(messages)
}
