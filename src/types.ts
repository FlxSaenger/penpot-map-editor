export enum THUNDERFOREST_MAP {
    ATLAS = "atlas",
    CYCLE = "cycle",
    TRANSPORT = "transport",
    LANDSCAPE = "landscape",
    OUTDOORS = "outdoors",
    TRANSPORT_DARK = "transport-dark",
    SPINAL_MAP = "spinal-map",
    PIONEER = "pioneer",
    MOBILE_ATLAS = "mobile-atlas",
    NEIGHBOURHOOD = "neighbourhood",
}

export type MapProvider = "osm" | "thunderforest";

export type AppState = {
    mapProvider?: MapProvider;
    thunderforestKey?: string;
    thunderforestMapType?: THUNDERFOREST_MAP;
};
