package services

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

type CompanionConfig struct {
	Name         string `json:"name"`
	SystemPrompt string `json:"system_prompt"`
	StartMessage string `json:"start_message,omitempty"`
}

type Companion struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	SystemPrompt string   `json:"systemPrompt"`
	StartMessage string   `json:"startMessage"`
	Expressions  []string `json:"expressions"`
}

type CompanionServ struct{}

func NewCompanionServ() *CompanionServ {
	return &CompanionServ{}
}

func (s *CompanionServ) GetCompanions() ([]Companion, error) {
	pwd, err := os.Getwd()
	if err != nil {
		return nil, err
	}

	companionsDir := filepath.Join(pwd, "companions")

	if _, err := os.Stat(companionsDir); os.IsNotExist(err) {
		if err := os.MkdirAll(companionsDir, 0755); err != nil {
			log.Fatalf("Error creating companions directory: %v", err)
		}
	}

	entries, err := os.ReadDir(companionsDir)
	if err != nil {
		return nil, err
	}

	var companions []Companion

	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		id := entry.Name()
		compPath := filepath.Join(companionsDir, id)

		configPath := filepath.Join(compPath, "config.json")
		configData, err := os.ReadFile(configPath)
		if err != nil {
			continue
		}

		var cfg CompanionConfig
		if err := json.Unmarshal(configData, &cfg); err != nil {
			continue
		}

		var expressions []string
		files, _ := os.ReadDir(compPath)
		for _, file := range files {
			if !file.IsDir() && strings.HasSuffix(strings.ToLower(file.Name()), ".png") {
				exp := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
				expressions = append(expressions, exp)
			}
		}

		expList := strings.Join(expressions, ", ")
		finalPrompt := fmt.Sprintf("%s\n\nCRITICAL INSTRUCTION: You must respond to all inputs in strict JSON format containing exactly two keys:\n1. \"expression\": Must be exactly one of these strings: [%s]\n2. \"message\": Your spoken response text.\n\nExample response:\n{\"expression\": \"normal\", \"message\": \"Hello there!\"}", cfg.SystemPrompt, expList)

		comp := Companion{
			ID:           id,
			Name:         cfg.Name,
			SystemPrompt: finalPrompt,
			StartMessage: cfg.StartMessage,
			Expressions:  expressions,
		}
		companions = append(companions, comp)
	}

	return companions, nil
}

func (s *CompanionServ) GetCompanionImageAsBase64(id string, expression string) (string, error) {
	pwd, err := os.Getwd()
	if err != nil {
		return "", err
	}

	imgPath := filepath.Join(pwd, "companions", id, expression+".png")

	imgData, err := os.ReadFile(imgPath)
	if err != nil {
		return "", fmt.Errorf("image not found: %s", err.Error())
	}

	base64Str := base64.StdEncoding.EncodeToString(imgData)
	return fmt.Sprintf("data:image/png;base64,%s", base64Str), nil
}
