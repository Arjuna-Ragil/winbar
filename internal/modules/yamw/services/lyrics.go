package services

import (
	"fmt"
	"net/url"

	"winbar/internal/modules/yamw/database"
	"winbar/internal/modules/yamw/dto"
)

type LyricsServ struct {
	Lrclib *database.Lrclib
}

func NewLyricsServ(lrclib *database.Lrclib) *LyricsServ {
	return &LyricsServ{Lrclib: lrclib}
}

func (l *LyricsServ) LrclibUrl(artist, title string) (dto.Lyrics, error) {
	baseUrl := "https://lrclib.net/api/get"

	params := url.Values{}
	params.Add("artist_name", artist)
	params.Add("track_name", title)

	reqUrl := fmt.Sprintf("%s?%s", baseUrl, params.Encode())

	return l.Lrclib.FetchLRCLIB(reqUrl)
}
