export namespace dto {
	
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
	    modules: Record<string, Array<string>>;
	
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

}

