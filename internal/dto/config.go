package dto

type AppConfig struct {
	Name string `yaml:"name" json:"name"`
	Path string `yaml:"path" json:"path"`
}

type Config struct {
	Theme         string      `yaml:"theme" json:"theme"`
	Left          []string    `yaml:"left" json:"left"`
	Center        []string    `yaml:"center" json:"center"`
	Right         []string    `yaml:"right" json:"right"`
	Modules       []string    `yaml:"modules" json:"modules"`
	PrometheusURL string      `yaml:"prometheus_url" json:"prometheus_url"`
	LauncherApps  []AppConfig `yaml:"launcher_apps" json:"launcher_apps"`
}
