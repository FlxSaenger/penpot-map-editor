import L from "leaflet";
import Autocomplete from "./vendor/autocomplete.esm";

const initAutocomplete = (map: L.Map) => {
    new Autocomplete("search", {
        selectFirst: true,
        howManyCharacters: 2,
        onSearch: ({ currentValue }) => {
            const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&q=${encodeURI(
                currentValue,
            )}`;
            return new Promise((resolve) => {
                fetch(api)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data.features);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        },
        onResults: ({ currentValue, matches, template }) => {
            const regex = new RegExp(currentValue, "gi");

            // if the result returns 0 we
            // show the no results element
            return matches === 0
                ? template
                : matches
                      .map(
                          (element) => `<li class="loupe">
            <p>
              ${element.properties.display_name.replace(
                  regex,
                  (str) => `<b>${str}</b>`,
              )}
            </p>
          </li> `,
                      )
                      .join("");
        },

        // we add an action to enter or click
        onSubmit: ({ object }) => {
            // remove all layers from the map
            map.eachLayer(function (layer) {
                if (!!layer.toGeoJSON) {
                    map.removeLayer(layer);
                }
            });

            const [lng, lat] = object.geometry.coordinates;

            map.setView([lat, lng], 8);
        },

        // the method presents no results element
        noResults: ({ currentValue, template }) =>
            template(`<li>No results found: "${currentValue}"</li>`),
    });
};

export default initAutocomplete;
