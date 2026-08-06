package handlers

import (
	"context"
	"strconv"
	"sort"

	"winbar/internal/services"
)

type Docker struct {
	prom *services.PrometheusService
	ctx  context.Context
}

func NewDocker(prom *services.PrometheusService) *Docker {
	return &Docker{
		prom: prom,
	}
}

func (d *Docker) Startup(ctx context.Context) {
	d.ctx = ctx
}

type ContainerStat struct {
	Name     string  `json:"name"`
	CPUUsage float64 `json:"cpu_usage"`
	RAMUsage float64 `json:"ram_usage"`
	State    string  `json:"state"`
}

func (d *Docker) GetContainers() ([]ContainerStat, error) {
	cpuResp, err := d.prom.Query(`sum by (name) (rate(container_cpu_usage_seconds_total{image!=""}[1m])) * 100`)
	ramResp, err := d.prom.Query(`sum by (name) (container_memory_usage_bytes{image!=""})`)
	
	statsMap := make(map[string]*ContainerStat)
	
	if err == nil {
		for _, result := range cpuResp.Data.Result {
			name := result.Metric["name"]
			if name == "" { continue }
			if val, ok := result.Value[1].(string); ok {
				cpu, _ := strconv.ParseFloat(val, 64)
				statsMap[name] = &ContainerStat{Name: name, CPUUsage: cpu, State: "running"}
			}
		}
		
		if ramResp != nil {
			for _, result := range ramResp.Data.Result {
				name := result.Metric["name"]
				if name == "" { continue }
				if val, ok := result.Value[1].(string); ok {
					ram, _ := strconv.ParseFloat(val, 64)
					if stat, exists := statsMap[name]; exists {
						stat.RAMUsage = ram
					} else {
						statsMap[name] = &ContainerStat{Name: name, RAMUsage: ram, State: "running"}
					}
				}
			}
		}
	}
	
	var containers []ContainerStat
	for _, stat := range statsMap {
		containers = append(containers, *stat)
	}
	
	sort.Slice(containers, func(i, j int) bool {
		return containers[i].Name < containers[j].Name
	})
	
	return containers, nil
}
