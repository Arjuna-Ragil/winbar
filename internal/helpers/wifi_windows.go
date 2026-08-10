package helpers

import (
	"syscall"
	"unsafe"
)

var (
	wlanapi            = syscall.NewLazyDLL("wlanapi.dll")
	wlanOpen           = wlanapi.NewProc("WlanOpenHandle")
	wlanEnumInterfaces = wlanapi.NewProc("WlanEnumInterfaces")
	wlanQueryInterface = wlanapi.NewProc("WlanQueryInterface")
	wlanFreeMemory     = wlanapi.NewProc("WlanFreeMemory")
	wlanClose          = wlanapi.NewProc("WlanCloseHandle")
)

const (
	wlan_api_version_2_0                = 2
	wlan_interface_state_connected      = 1
	wlan_intf_opcode_current_connection = 7
)

type GUID struct {
	Data1 uint32
	Data2 uint16
	Data3 uint16
	Data4 [8]byte
}

type WLAN_INTERFACE_INFO struct {
	InterfaceGuid    GUID
	strInterfaceDesc [256]uint16
	isState          uint32
}

type WLAN_INTERFACE_INFO_LIST struct {
	dwNumberOfItems uint32
	dwIndex         uint32
	InterfaceInfo   [1]WLAN_INTERFACE_INFO
}

type DOT11_SSID struct {
	uSSIDLength uint32
	ucSSID      [32]byte
}

type WLAN_ASSOCIATION_ATTRIBUTES struct {
	dot11Ssid         DOT11_SSID
	dot11BssType      uint32
	dot11Bssid        [6]byte
	dot11PhyType      uint32
	uDot11PhyIndex    uint32
	wlanSignalQuality uint32
	ulRxRate          uint32
	ulTxRate          uint32
}

type WLAN_SECURITY_ATTRIBUTES struct {
	dot11AuthAlgorithm   uint32
	dot11CipherAlgorithm uint32
	bOneXEnabled         int32
	bDot11iEnabled       int32
}

type WLAN_CONNECTION_ATTRIBUTES struct {
	isState                   uint32
	wlanConnectionMode        uint32
	strProfileName            [256]uint16
	wlanAssociationAttributes WLAN_ASSOCIATION_ATTRIBUTES
	wlanSecurityAttributes    WLAN_SECURITY_ATTRIBUTES
}

func GetNativeWifiData() (isConnected bool, signalQuality uint32) {
	var negotiatedVersion uint32
	var handle uintptr

	ret, _, _ := wlanOpen.Call(
		uintptr(wlan_api_version_2_0),
		0,
		uintptr(unsafe.Pointer(&negotiatedVersion)),
		uintptr(unsafe.Pointer(&handle)),
	)
	if ret != 0 {
		return false, 0
	}
	defer func() {
		_, _, _ = wlanClose.Call(handle, 0)
	}()
	var interfaceList *WLAN_INTERFACE_INFO_LIST
	ret, _, _ = wlanEnumInterfaces.Call(
		handle,
		0,
		uintptr(unsafe.Pointer(&interfaceList)),
	)
	if ret != 0 {
		return false, 0
	}
	defer func() {
		_, _, _ = wlanFreeMemory.Call(uintptr(unsafe.Pointer(interfaceList)))
	}()

	if interfaceList == nil {
		return false, 0
	}

	adapter := interfaceList.InterfaceInfo[0]
	if adapter.isState != wlan_interface_state_connected {
		return false, 0
	}

	var dataSize uint32
	var connAttributes *WLAN_CONNECTION_ATTRIBUTES
	ret, _, _ = wlanQueryInterface.Call(
		handle,
		uintptr(unsafe.Pointer(&adapter.InterfaceGuid)),
		uintptr(wlan_intf_opcode_current_connection),
		0,
		uintptr(unsafe.Pointer(&dataSize)),
		uintptr(unsafe.Pointer(&connAttributes)),
		0,
	)
	if ret != 0 || connAttributes == nil {
		return false, 0
	}

	defer func() {
		_, _, _ = wlanFreeMemory.Call(uintptr(unsafe.Pointer(connAttributes)))
	}()
	return true, connAttributes.wlanAssociationAttributes.wlanSignalQuality

}
