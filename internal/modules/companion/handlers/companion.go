package handlers

import "winbar/internal/modules/companion/services"

type Companion struct {
	CompanionServ *services.CompanionServ
}

func NewCompanion(companionServ *services.CompanionServ) *Companion {
	return &Companion{CompanionServ: companionServ}
}

func (c *Companion) GetCompanions() ([]services.Companion, error) {
	return c.CompanionServ.GetCompanions()
}

func (c *Companion) GetCompanionImageAsBase64(id string, expression string) (string, error) {
	return c.CompanionServ.GetCompanionImageAsBase64(id, expression)
}
