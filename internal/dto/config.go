package dto

type Config struct {
	Left   []string `yaml:"left" json:"left"`
	Center []string `yaml:"center" json:"center"`
	Right  []string `yaml:"right" json:"right"`
}
