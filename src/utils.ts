import { AppState } from "./types";

export const canvasToUint8Array = (canvas: HTMLCanvasElement): Uint8Array => {
    const dataURL = canvas.toDataURL();
    const base64 = dataURL.split(",")[1];
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
    }

    return buffer;
};

export const hasThunderforestKey = (state: AppState): boolean =>
    typeof state.thunderforestKey !== "undefined" &&
    state.thunderforestKey !== null &&
    state.thunderforestKey !== "";
