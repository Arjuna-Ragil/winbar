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
	    left: string[];
	    center: string[];
	    right: string[];
	
	    static createFrom(source: any = {}) {
	        return new Config(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.left = source["left"];
	        this.center = source["center"];
	        this.right = source["right"];
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

