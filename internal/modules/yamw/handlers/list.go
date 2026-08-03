package handlers

import (
	"winbar/internal/modules/yamw/dto"
	"winbar/internal/modules/yamw/services"
)

type List struct {
	ListServ *services.ListServ
}

func NewList(listServ *services.ListServ) *List{
	return &List{ListServ: listServ}
}

func (l *List) GetRandomSongs() ([]dto.Song, error){
	return l.ListServ.SGetRandomSongs()
}