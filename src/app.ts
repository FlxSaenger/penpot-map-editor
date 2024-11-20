import L from "leaflet";
import leafletImage from "leaflet-image";
import { canvasToUint8Array } from "./utils";
import { AppState, MapProvider, THUNDERFOREST_MAP } from "./types";
import { hasThunderforestKey } from "./utils";
import initAutocomplete from "./autocomplete";

const DEFAULT_ZOOM = 15;
const DEFAULT_MAP_CENTER = new L.LatLng(51.46, -0.205);

const $mapContainer = document.querySelector(
    ".map-container",
) as HTMLDivElement;
const $map = $mapContainer.querySelector("#map") as HTMLDivElement;
const $selectThunderforestMapType = document.querySelector(
    "#select-thunderforest-map-type",
) as HTMLSelectElement;
const $selectThunderforestMapProvider = document.querySelector(
    "#select-map-provider",
) as HTMLSelectElement;
const $thunderforestKeyContainer = document.querySelector(
    "#thunderforest-key-container",
) as HTMLElement;
const $mapTypeLabel = document.querySelector(
    "#select-thunderforest-map-type-label",
) as HTMLLabelElement;
const $mapHeightInput = document.querySelector(
    "#map-height",
) as HTMLInputElement;
const $mapWidthInput = document.querySelector("#map-width") as HTMLInputElement;
const $createImageBtn = document.querySelector(
    "[data-handler='create-image']",
) as HTMLButtonElement;
const $saveThunderforestKeyBtn = document.querySelector(
    "[data-handler='save-thunderforest-key']",
) as HTMLButtonElement;

const initApp = (state: AppState) => {
    state = {
        ...state,
        ...{
            mapProvider: "osm",
            thunderforestMapType: THUNDERFOREST_MAP.ATLAS,
        },
    };

    const map = new L.Map($map, {
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_ZOOM,
    });

    const updateMapTiles = (): void => {
        if (
            state.mapProvider === "thunderforest" &&
            !hasThunderforestKey(state)
        )
            return;

        // create a new tile layer
        const tileUrl =
            state.mapProvider === "osm"
                ? `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
                : `https://tile.thunderforest.com/${state.thunderforestMapType}/{z}/{x}/{y}{r}.png?apikey=${state.thunderforestKey}`;
        console.log(tileUrl, state.mapProvider);
        const layer = new L.TileLayer(tileUrl, { maxZoom: 18 });

        map.addLayer(layer);
    };

    updateMapTiles();
    initAutocomplete(map);

    const bindUIEvents = () => {
        const displayThunderforestKeyContainer = () => {
            $thunderforestKeyContainer?.classList.remove("hidden");
            $mapContainer.classList.add("hidden");
            $selectThunderforestMapType.value =
                state.thunderforestMapType as string;
        };

        const hideThunderforestKeyContainer = () => {
            $thunderforestKeyContainer?.classList.add("hidden");
            $mapContainer.classList.remove("hidden");
        };

        const displayThunderforest = () => {
            $mapTypeLabel?.classList.remove("hidden");
        };

        const hideThunderforest = () => {
            hideThunderforestKeyContainer();
            $mapTypeLabel?.classList.add("hidden");
        };

        $selectThunderforestMapProvider.addEventListener(
            "change",
            (ev: any) => {
                const { target } = ev;
                const { value }: { value: MapProvider } = target;

                if (!value) return;

                state.mapProvider = value;
                state.thunderforestMapType =
                    state.mapProvider === "thunderforest"
                        ? THUNDERFOREST_MAP.ATLAS
                        : undefined;
                updateMapTiles();

                if (state.mapProvider === "thunderforest") {
                    displayThunderforest();

                    if (!hasThunderforestKey(state)) {
                        displayThunderforestKeyContainer();
                    }

                    return;
                }

                hideThunderforest();
            },
        );

        $selectThunderforestMapType.addEventListener("change", (ev: any) => {
            const { target } = ev;
            const { value } = target;

            if (!value) return;

            state.thunderforestMapType = value as THUNDERFOREST_MAP;
            updateMapTiles();
        });

        $mapHeightInput.addEventListener("change", (ev: any) => {
            const { target } = ev;
            const { value } = target;

            if (!value || isNaN(value)) return;

            $map.style.height = `${value}px`;
            map.invalidateSize();
        });

        $mapWidthInput.addEventListener("change", (ev: any) => {
            const { target } = ev;
            const { value } = target;

            if (!value || isNaN(value)) return;

            $map.style.width = `${value}px`;
            map.invalidateSize();
        });

        $createImageBtn.addEventListener("click", () => {
            // Export the image
            leafletImage(map, function (err, canvas) {
                // Map canvas to Uint8Array and pass to plugin
                const buffer = canvasToUint8Array(canvas);

                parent.postMessage(
                    {
                        type: "create-image",
                        data: {
                            image: buffer,
                        },
                    },
                    "*",
                );
            });
        });

        $saveThunderforestKeyBtn.addEventListener("click", () => {
            const keyInput = $thunderforestKeyContainer.querySelector(
                "#thunderforest-key",
            ) as HTMLInputElement;

            if (!keyInput.value || keyInput.value.trim() === "") {
                return;
            }

            state.thunderforestKey = keyInput.value;
            hideThunderforestKeyContainer();
            updateMapTiles();

            // Save key permanently
            parent.postMessage(
                {
                    type: "update-thunderforest-key",
                    data: {
                        key: state.thunderforestKey,
                    },
                },
                "*",
            );
        });
    };

    bindUIEvents();
};

export default initApp;
