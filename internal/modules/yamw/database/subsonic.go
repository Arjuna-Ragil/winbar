package database

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"winbar/internal/modules/yamw/dto"
)

type Subsonic struct{}

func NewSubsonic() *Subsonic {
	return &Subsonic{}
}

func (s *Subsonic) FetchSubsonic(SSURL string) string {
	res, err := http.Get(SSURL)
	if err != nil {
		fmt.Println("Failed to fetch subsonic")
		return err.Error()
	}
	defer func() {
		err := res.Body.Close()
		if err != nil {
			log.Printf("Error closing response body: %v", err)
		}
	}()

	content, err := io.ReadAll(res.Body)
	if err != nil {
		fmt.Println("Failed to read content")
		return err.Error()
	}

	return string(content)
}

func (s *Subsonic) FetchRandomSongs(SSURL string) ([]dto.Song, error) {
	res, err := http.Get(SSURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch subsonic: %s", err)
	}
	defer func() {
		err := res.Body.Close()
		if err != nil {
			log.Printf("Error closing response body: %v", err)
		}
	}()

	body, _ := io.ReadAll(res.Body)

	var data dto.SubsonicResponse

	err = json.Unmarshal(body, &data)
	if err != nil {
		return nil, fmt.Errorf("failed to convert: %s", err)
	}

	return data.Response.RandomSongs.Song, nil
}
