package handlers

import (
	"context"
	"strconv"

	"winbar/internal/services"
)

type Server struct {
	prom *services.PrometheusService
	ctx  context.Context
}

func NewServer(prom *services.PrometheusService) *Server {
	return &Server{
		prom: prom,
	}
}

func (s *Server) Startup(ctx context.Context) {
	s.ctx = ctx
}

type ServerStats struct {
	CPUUsage  float64 `json:"cpu_usage"`
	RAMUsage  float64 `json:"ram_usage"`
	DiskUsage float64 `json:"disk_usage"`
	RAMTotal  float64 `json:"ram_total"`
	RAMUsed   float64 `json:"ram_used"`
	DiskTotal float64 `json:"disk_total"`
	DiskUsed  float64 `json:"disk_used"`
}

func (s *Server) GetServerStats() (*ServerStats, error) {
	stats := &ServerStats{}

	// CPU Usage
	cpuResp, err := s.prom.Query(`100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)`)
	if err == nil && len(cpuResp.Data.Result) > 0 && len(cpuResp.Data.Result[0].Value) > 1 {
		if val, ok := cpuResp.Data.Result[0].Value[1].(string); ok {
			stats.CPUUsage, _ = strconv.ParseFloat(val, 64)
		}
	}

	// RAM Usage
	ramResp, err := s.prom.Query(`100 * (1 - ((node_memory_MemFree_bytes + node_memory_Cached_bytes + node_memory_Buffers_bytes) / node_memory_MemTotal_bytes))`)
	if err == nil && len(ramResp.Data.Result) > 0 && len(ramResp.Data.Result[0].Value) > 1 {
		if val, ok := ramResp.Data.Result[0].Value[1].(string); ok {
			stats.RAMUsage, _ = strconv.ParseFloat(val, 64)
		}
	}
	
	ramTotalResp, err := s.prom.Query(`node_memory_MemTotal_bytes`)
	if err == nil && len(ramTotalResp.Data.Result) > 0 && len(ramTotalResp.Data.Result[0].Value) > 1 {
		if val, ok := ramTotalResp.Data.Result[0].Value[1].(string); ok {
			stats.RAMTotal, _ = strconv.ParseFloat(val, 64)
		}
	}
	
	ramUsedResp, err := s.prom.Query(`node_memory_MemTotal_bytes - (node_memory_MemFree_bytes + node_memory_Cached_bytes + node_memory_Buffers_bytes)`)
	if err == nil && len(ramUsedResp.Data.Result) > 0 && len(ramUsedResp.Data.Result[0].Value) > 1 {
		if val, ok := ramUsedResp.Data.Result[0].Value[1].(string); ok {
			stats.RAMUsed, _ = strconv.ParseFloat(val, 64)
		}
	}

	// Disk Usage
	diskResp, err := s.prom.Query(`100 - ((node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"} * 100) / node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"})`)
	if err == nil && len(diskResp.Data.Result) > 0 && len(diskResp.Data.Result[0].Value) > 1 {
		if val, ok := diskResp.Data.Result[0].Value[1].(string); ok {
			stats.DiskUsage, _ = strconv.ParseFloat(val, 64)
		}
	}

	diskTotalResp, err := s.prom.Query(`node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"}`)
	if err == nil && len(diskTotalResp.Data.Result) > 0 && len(diskTotalResp.Data.Result[0].Value) > 1 {
		if val, ok := diskTotalResp.Data.Result[0].Value[1].(string); ok {
			stats.DiskTotal, _ = strconv.ParseFloat(val, 64)
		}
	}
	
	diskUsedResp, err := s.prom.Query(`node_filesystem_size_bytes{mountpoint="/",fstype!="rootfs"} - node_filesystem_avail_bytes{mountpoint="/",fstype!="rootfs"}`)
	if err == nil && len(diskUsedResp.Data.Result) > 0 && len(diskUsedResp.Data.Result[0].Value) > 1 {
		if val, ok := diskUsedResp.Data.Result[0].Value[1].(string); ok {
			stats.DiskUsed, _ = strconv.ParseFloat(val, 64)
		}
	}

	return stats, nil
}
