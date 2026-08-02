package dto

type ThemeColors struct {
	Widget            string `json:"widget"`
	WidgetHover       string `json:"widgetHover"`
	WidgetActive      string `json:"widgetActive"`
	WidgetActiveHover string `json:"widgetActiveHover"`
	WidgetText        string `json:"widgetText"`
}

type Theme struct {
	Name   string      `json:"name"`
	Author string      `json:"author"`
	Colors ThemeColors `json:"colors"`
}
