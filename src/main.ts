import "./style.css";
import initApp from "./app";

const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

window.addEventListener("message", (event) => {
    if (event.data.source === "penpot" && event.data.type === "themeChange") {
        document.body.dataset.theme = event.data.theme;
    }

    if (event.data.source === "penpot" && event.data.type === "initApp") {
        initApp(event.data.store);
    }
});

parent.postMessage(
    {
        type: "app-ready",
    },
    "*",
);
