package dto

type Config struct {
	Theme  string   `yaml:"theme" json:"theme"`
	Left   []string `yaml:"left" json:"left"`
	Center []string `yaml:"center" json:"center"`
	Right   []string            `yaml:"right" json:"right"`
	Modules []string `yaml:"modules" json:"modules"`
}
