package handlers

import (
	"context"
	"sort"
	"strconv"

	"winbar/internal/services"
)

type Container struct {
	prom *services.PrometheusService
	ctx  context.Context
}

func NewContainer(prom *services.PrometheusService) *Container {
	return &Container{
		prom: prom,
	}
}

func (d *Container) Startup(ctx context.Context) {
	d.ctx = ctx
}

type ContainerStat struct {
	Name     string  `json:"name"`
	CPUUsage float64 `json:"cpu_usage"`
	RAMUsage float64 `json:"ram_usage"`
	State    string  `json:"state"`
}

func (d *Container) GetContainers() ([]ContainerStat, error) {
	statsMap := make(map[string]*ContainerStat)

	cpuResp, err := d.prom.Query(`sum by (name) (rate(container_cpu_usage_seconds_total{image!=""}[1m])) * 100`)
	if err == nil {
		for _, result := range cpuResp.Data.Result {
			name := result.Metric["name"]
			if name == "" {
				continue
			}
			if val, ok := result.Value[1].(string); ok {
				cpu, _ := strconv.ParseFloat(val, 64)
				statsMap[name] = &ContainerStat{Name: name, CPUUsage: cpu, State: "running"}
			}
		}
	}

	ramResp, err := d.prom.Query(`sum by (name) (container_memory_usage_bytes{image!=""})`)

	if err == nil {
		for _, result := range ramResp.Data.Result {
			name := result.Metric["name"]
			if name == "" {
				continue
			}
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

	var containers []ContainerStat
	for _, stat := range statsMap {
		containers = append(containers, *stat)
	}

	sort.Slice(containers, func(i, j int) bool {
		return containers[i].Name < containers[j].Name
	})

	return containers, nil
}
