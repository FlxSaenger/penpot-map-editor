type Message<T = any> = {
    type: string;
    data: T;
};

type CreateImagePayload = {
    image: Uint8Array;
};

type UpdateThunderforestKeyPayload = {
    key: string;
};

const PLUGIN_DATA_THUNDERFOREST_KEY = "thunderforest-key";

// Open modal window and initialize app
penpot.ui.open("Penpot maps editor", `?theme=${penpot.theme}`, {
    width: 450,
    height: 650,
});

penpot.ui.onMessage<Message>((message) => {
    if (message.type === "app-ready") {
        // Initialize app with permanently stored data
        penpot.ui.sendMessage({
            source: "penpot",
            type: "initApp",
            store: {
                thunderforestKey: penpot.root?.getPluginData(
                    PLUGIN_DATA_THUNDERFOREST_KEY,
                ),
            },
        });
    }

    if (message.type === "create-image") {
        penpot
            .uploadMediaData(
                "penpot-maps-editor-screenshot",
                (message.data as CreateImagePayload).image,
                "image/png",
            )
            .then((imageData) => {
                const rectangle = penpot.createRectangle();
                rectangle.name = "Map";
                rectangle.fills = [{ fillOpacity: 1, fillImage: imageData }];
                rectangle.resize(imageData.width, imageData.height);
                rectangle.x = penpot.viewport.center.x;
                rectangle.y = penpot.viewport.center.y;
                penpot.selection = [rectangle];
            })
            .catch((error) => {
                console.error(error);
            });
    }

    if (message.type === "update-thunderforest-key") {
        penpot.root?.setPluginData(
            PLUGIN_DATA_THUNDERFOREST_KEY,
            (message.data as UpdateThunderforestKeyPayload).key,
        );
    }
});

// Update the theme in the iframe
penpot.on("themechange", (theme) => {
    penpot.ui.sendMessage({
        source: "penpot",
        type: "themeChange",
        theme,
    });
});
