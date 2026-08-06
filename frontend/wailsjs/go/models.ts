export namespace dto {
	
	export class AppConfig {
	    name: string;
	    path: string;
	
	    static createFrom(source: any = {}) {
	        return new AppConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	    }
	}
	export class BatteryData {
	    percentage: number;
	    isCharging: boolean;
	
	    static createFrom(source: any = {}) {
	        return new BatteryData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.percentage = source["percentage"];
	        this.isCharging = source["isCharging"];
	    }
	}
	export class Config {
	    theme: string;
	    left: string[];
	    center: string[];
	    right: string[];
	    modules: string[];
	    prometheus_url: string;
	    launcher_apps: AppConfig[];
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.theme = source["theme"];
	        this.left = source["left"];
	        this.center = source["center"];
	        this.right = source["right"];
	        this.modules = source["modules"];
	        this.prometheus_url = source["prometheus_url"];
	        this.launcher_apps = this.convertValues(source["launcher_apps"], AppConfig);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Lyrics {
	    instrumental: boolean;
	    plainLyrics: string;
	    syncedLyrics: string;
	
	    static createFrom(source: any = {}) {
	        return new Lyrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.instrumental = source["instrumental"];
	        this.plainLyrics = source["plainLyrics"];
	        this.syncedLyrics = source["syncedLyrics"];
	    }
	}
	export class Song {
	    id: string;
	    title: string;
	    album: string;
	    artist: string;
	    genre: string;
	    coverArt: string;
	    duration: number;
	
	    static createFrom(source: any = {}) {
	        return new Song(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.album = source["album"];
	        this.artist = source["artist"];
	        this.genre = source["genre"];
	        this.coverArt = source["coverArt"];
	        this.duration = source["duration"];
	    }
	}
	export class SysInfoData {
	    cpuUsage: number;
	    ramUsage: number;
	    ramUsedGb: number;
	    ramTotalGb: number;
	    storageUsage: number;
	    storageUsedGb: number;
	    storageTotalGb: number;
	    gpuName: string;
	    netUpload: number;
	    netDownload: number;
	    gpuUsage: number;
	    gpuUsedGb: number;
	    gpuTotalGb: number;
	
	    static createFrom(source: any = {}) {
	        return new SysInfoData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cpuUsage = source["cpuUsage"];
	        this.ramUsage = source["ramUsage"];
	        this.ramUsedGb = source["ramUsedGb"];
	        this.ramTotalGb = source["ramTotalGb"];
	        this.storageUsage = source["storageUsage"];
	        this.storageUsedGb = source["storageUsedGb"];
	        this.storageTotalGb = source["storageTotalGb"];
	        this.gpuName = source["gpuName"];
	        this.netUpload = source["netUpload"];
	        this.netDownload = source["netDownload"];
	        this.gpuUsage = source["gpuUsage"];
	        this.gpuUsedGb = source["gpuUsedGb"];
	        this.gpuTotalGb = source["gpuTotalGb"];
	    }
	}
	export class ThemeColors {
	    widget: string;
	    widgetHover: string;
	    widgetActive: string;
	    widgetActiveHover: string;
	    widgetText: string;
	    background: string;
	
	    static createFrom(source: any = {}) {
	        return new ThemeColors(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.widget = source["widget"];
	        this.widgetHover = source["widgetHover"];
	        this.widgetActive = source["widgetActive"];
	        this.widgetActiveHover = source["widgetActiveHover"];
	        this.widgetText = source["widgetText"];
	        this.background = source["background"];
	    }
	}
	export class Theme {
	    name: string;
	    author: string;
	    colors: ThemeColors;
	
	    static createFrom(source: any = {}) {
	        return new Theme(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.author = source["author"];
	        this.colors = this.convertValues(source["colors"], ThemeColors);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class VolumeData {
	    level: number;
	    muted: boolean;
	
	    static createFrom(source: any = {}) {
	        return new VolumeData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.level = source["level"];
	        this.muted = source["muted"];
	    }
	}
	export class WeatherData {
	    temperature: number;
	    weatherCode: number;
	    isDay: boolean;
	
	    static createFrom(source: any = {}) {
	        return new WeatherData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.temperature = source["temperature"];
	        this.weatherCode = source["weatherCode"];
	        this.isDay = source["isDay"];
	    }
	}
	export class WifiData {
	    isConnected: boolean;
	    signal: string;
	
	    static createFrom(source: any = {}) {
	        return new WifiData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.isConnected = source["isConnected"];
	        this.signal = source["signal"];
	    }
	}
	export class WifiNetwork {
	    ssid: string;
	    signal: number;
	    security: string;
	
	    static createFrom(source: any = {}) {
	        return new WifiNetwork(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ssid = source["ssid"];
	        this.signal = source["signal"];
	        this.security = source["security"];
	    }
	}

}

export namespace handlers {
	
	export class AppFrontend {
	    name: string;
	    path: string;
	    icon: string;
	
	    static createFrom(source: any = {}) {
	        return new AppFrontend(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.icon = source["icon"];
	    }
	}
	export class ContainerStat {
	    name: string;
	    cpu_usage: number;
	    ram_usage: number;
	    state: string;
	
	    static createFrom(source: any = {}) {
	        return new ContainerStat(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.cpu_usage = source["cpu_usage"];
	        this.ram_usage = source["ram_usage"];
	        this.state = source["state"];
	    }
	}
	export class ServerStats {
	    cpu_usage: number;
	    ram_usage: number;
	    disk_usage: number;
	    ram_total: number;
	    ram_used: number;
	    disk_total: number;
	    disk_used: number;
	
	    static createFrom(source: any = {}) {
	        return new ServerStats(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cpu_usage = source["cpu_usage"];
	        this.ram_usage = source["ram_usage"];
	        this.disk_usage = source["disk_usage"];
	        this.ram_total = source["ram_total"];
	        this.ram_used = source["ram_used"];
	        this.disk_total = source["disk_total"];
	        this.disk_used = source["disk_used"];
	    }
	}

}

export namespace services {
	
	export class ChatMessage {
	    role: string;
	    content: string;
	
	    static createFrom(source: any = {}) {
	        return new ChatMessage(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.role = source["role"];
	        this.content = source["content"];
	    }
	}
	export class Companion {
	    id: string;
	    name: string;
	    systemPrompt: string;
	    startMessage: string;
	    expressions: string[];
	
	    static createFrom(source: any = {}) {
	        return new Companion(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.systemPrompt = source["systemPrompt"];
	        this.startMessage = source["startMessage"];
	        this.expressions = source["expressions"];
	    }
	}

}

