package services

import (
	"fmt"
	helper "winbar/internal/modules/yamw/helpers"
)

type StreamServ struct{}

func NewStreamServ() *StreamServ {
	return &StreamServ{}
}

func (s *StreamServ) CreateStream(id string) string {
	endpoint := "stream"
	rawSSURL := helper.CreateSSURL(endpoint)
	SSURL := fmt.Sprintf("%s&id=%s", rawSSURL, id)

	return SSURL
}

func (s *StreamServ) CreateCover(id string) string {
	endpoint := "getCoverArt"
	rawSSURL := helper.CreateSSURL(endpoint)
	SSURL := fmt.Sprintf("%s&id=%s&size=%s", rawSSURL, id, "150")

	return SSURL
}
