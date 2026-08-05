package dto

type SysInfoData struct {
	CPUUsage       float64 `json:"cpuUsage"`
	RAMUsage       float64 `json:"ramUsage"`
	RAMUsedGB      float64 `json:"ramUsedGb"`
	RAMTotalGB     float64 `json:"ramTotalGb"`
	StorageUsage   float64 `json:"storageUsage"`
	StorageUsedGB  float64 `json:"storageUsedGb"`
	StorageTotalGB float64 `json:"storageTotalGb"`
	GPUUsage       float64 `json:"gpuUsage"`
	GPUUsedGB      float64 `json:"gpuUsedGb"`
	GPUTotalGB     float64 `json:"gpuTotalGb"`
}
