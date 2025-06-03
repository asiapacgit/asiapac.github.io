const highlightedCountries = {
  "CHN": ["adashan@asiapac.biz"],
  "HKG": ["adashan@asiapc.biz"],
  "IDN": ["Indosales@asiapac.biz"],
  "SGP": ["mel.bromley@asiapac.biz"],
  "GBR": ["UKsales@asiapac.biz"],
  "AUS": ["adam.leslie@asiapac.biz", "Leifu.suen@asiapac.biz"],
  "THA": ["Thaisales@asiapac.biz"],
  "VNM": ["VNsales@asiapac.biz"],
  "PNG": ["png.sales@asiapac.biz"],
  "ARE": ["adam.leslie@asiapac.biz"],
  "IND": ["Indiasales@asiapac.biz"],
  "ZAF": ["adam.leslie@asiapac.biz"],
  "FRA": ["Europesales@asiapac.biz"],
  "URY": ["UruguaySales@asiapac.biz"]
};

const countryNameMap = {
  "CHN": "China", "HKG": "Hong Kong", "IDN": "Indonesia",
  "SGP": "Singapore", "GBR": "United Kingdom", "AUS": "Australia",
  "THA": "Thailand", "VNM": "Vietnam", "PNG": "Papua New Guinea",
  "ARE": "United Arab Emirates", "IND": "India", "ZAF": "South Africa",
  "FRA": "France", "URY": "Uruguay"
};

const countryCoordinates = {
  "CHN": [35.8617, 104.1954], "HKG": [22.3193, 114.1694], "IDN": [-0.7893, 113.9213],
  "SGP": [1.3521, 103.8198], "GBR": [55.3781, -3.4360], "AUS": [-25.2744, 133.7751],
  "THA": [15.8700, 100.9925], "VNM": [14.0583, 108.2772], "PNG": [-6.3150, 143.9555],
  "ARE": [23.4241, 53.8478], "IND": [20.5937, 78.9629], "ZAF": [-30.5595, 22.9375],
  "FRA": [46.6034, 1.8883], "URY": [-32.5228, -55.7658]
};

const emailToHTML = (emails) => emails.map(email => `<a href="mailto:${email}">${email}</a>`).join("<br>");

function showPopup(countryCode) {
  const countryName = countryNameMap[countryCode] || "Unknown";
  const emails = highlightedCountries[countryCode] || ["No contact available"];

  const popupHtml = `
    <div id="custom-popup" class="popup-container">
      <div class="popup-content">
        <h2 class="text-black">${countryName}</h2>
        <p><b class="text-black">Contact:</b><br>${emailToHTML(emails)}</p>
        <button onclick="closePopup()">Close</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", popupHtml);
}

function closePopup() {
  const popup = document.getElementById("custom-popup");
  if (popup) popup.remove();
}

document.querySelectorAll('.contact-map-container').forEach((container, index) => {
  if (!container.id) container.id = `contact-map-${index}`;
  const map = L.map(container.id, { 
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    dragging: false,
    touchZoom: false,
    keyboard: false,
   }).setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: true,
  }).addTo(map);

  fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: (feature) => {
          const isoA3 = feature.id;
          return {
            fillColor: highlightedCountries[isoA3] ? "blue" : "transparent",
            color: highlightedCountries[isoA3] ? "blue" : "gray",
            weight: 1,
            fillOpacity: 1
          };
        },
        onEachFeature: (feature, layer) => {
          const isoA3 = feature.id;

          if (highlightedCountries[isoA3]) {
            layer.on("click", () => showPopup(isoA3));

            if (countryCoordinates[isoA3]) {
              L.marker(countryCoordinates[isoA3])
                .addTo(map)
                .on("click", () => showPopup(isoA3));
            }
          }
        }
      }).addTo(map);
    });
});

// Inject popup styles
const popupStyles = `
.popup-container {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}
.popup-content {
  background: white; padding: 20px 25px; border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  max-width: 400px; width: 90%;
  text-align: center;
}
.popup-content h2 {
  margin-bottom: 10px;
}
.popup-content a {
  color: #007bff; text-decoration: none;
}
.popup-content a:hover {
  text-decoration: underline;
}
.popup-content button {
  margin-top: 15px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.popup-content button:hover {
  background: #0056b3;
}
`;
const styleTag = document.createElement("style");
styleTag.innerHTML = popupStyles;
document.head.appendChild(styleTag);