package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"

	"winbar/internal/helpers"
)

type PrometheusService struct {
	client *http.Client
}

func NewPrometheusService() *PrometheusService {
	return &PrometheusService{
		client: &http.Client{},
	}
}

type PromResponse struct {
	Status string `json:"status"`
	Data   struct {
		ResultType string `json:"resultType"`
		Result     []struct {
			Metric map[string]string `json:"metric"`
			Value  []interface{}     `json:"value"`
		} `json:"result"`
	} `json:"data"`
}

func (s *PrometheusService) Query(query string) (*PromResponse, error) {
	cfg := helpers.LoadConfig()
	if cfg.PrometheusURL == "" {
		return nil, fmt.Errorf("prometheus URL not configured")
	}

	u, err := url.Parse(fmt.Sprintf("%s/api/v1/query", cfg.PrometheusURL))
	if err != nil {
		return nil, err
	}

	q := u.Query()
	q.Set("query", query)
	u.RawQuery = q.Encode()

	resp, err := s.client.Get(u.String())
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("prometheus returned status: %d", resp.StatusCode)
	}

	var promResp PromResponse
	if err := json.NewDecoder(resp.Body).Decode(&promResp); err != nil {
		return nil, err
	}

	return &promResp, nil
}
