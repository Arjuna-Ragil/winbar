package handlers

import "winbar/internal/modules/ai/services"

type Companion struct {
	CompanionServ *services.CompanionServ
}

func NewCompanion(companionServ *services.CompanionServ) *Companion {
	return &Companion{CompanionServ: companionServ}
}

func (c *Companion) GetCompanions() ([]services.Companion, error) {
	return c.CompanionServ.GetCompanions()
}
