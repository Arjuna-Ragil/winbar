package handlers

import "winbar/internal/modules/yamw/services"

type Stream struct {
	StreamServ *services.StreamServ
}

func NewStream(streamServ *services.StreamServ) *Stream{
	return &Stream{StreamServ: streamServ}
}

func (s *Stream) GetStreamURL(id string) string{
	return s.StreamServ.CreateStream(id)
}

func (s *Stream) GetCoverURL(id string) string{
	return s.StreamServ.CreateCover(id)
}