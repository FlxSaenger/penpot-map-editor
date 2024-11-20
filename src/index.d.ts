declare module "leaflet-image" {
    export default function (
        map: L.Map,
        callback: (error: any, canvas: HTMLCanvasElement) => void,
    ): void;
}
