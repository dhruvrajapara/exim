import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { useSettings } from "../contexts/SettingsContext";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

// Name mappings for discrepancies between simple-maps and standard names
const countryNameMap = {
  "United States": "United States of America",
  "USA": "United States of America",
  "UK": "United Kingdom",
  "UAE": "United Arab Emirates",
  // Add others if necessary
};

const getCurvedPath = (start, end) => {
  if (!start || !end) return "";
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  // Determine control point for a nice arc
  const dr = Math.sqrt(dx * dx + dy * dy);
  
  if (dr === 0) return "";
  
  // Sweep flag determines curve direction
  // Using an SVG arc command: M x1 y1 A rx ry x-axis-rotation large-arc-flag sweep-flag x2 y2
  // We'll use a large radius to make a shallow curve
  const radius = dr * 1.5;
  
  // Choose sweep flag based on dx to make it arc "upwards" on the map
  const sweep = dx > 0 ? 1 : 0;
  
  return `M${start[0]},${start[1]} A${radius},${radius} 0 0,${sweep} ${end[0]},${end[1]}`;
};

export default function ExportMap() {
  const { settings } = useSettings();
  
  const originCountry = settings?.origin_country || "India";
  const [exportCountries, setExportCountries] = useState([]);
  
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (settings?.export_countries) {
      try {
        const parsed = JSON.parse(settings.export_countries);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExportCountries(parsed);
        }
      } catch (e) {
        console.error("Error parsing export countries", e);
      }
    }
  }, [settings]);

  const mappedOrigin = countryNameMap[originCountry] || originCountry;

  return (
    <section className="w-full bg-white py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Exporting Worldwide</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Delivering Premium Quality Products Across the Globe.</p>
      </div>
      
      <div className="w-full max-w-5xl mx-auto" style={{ height: "auto" }}>
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 130 }}>
          <Geographies geography={geoUrl}>
            {({ geographies, projection }) => {
              // Robust name matching
              const matchName = (geoName, targetName) => {
                if (!geoName || !targetName) return false;
                return geoName.toString().trim().toLowerCase() === targetName.toString().trim().toLowerCase();
              };

              // Find origin feature
              const originFeature = geographies.find(
                (geo) => matchName(geo.properties.name, mappedOrigin)
              );
              
              // Target Features mapped from all export countries
              const targetFeatures = exportCountries.map(rawTarget => {
                const targetName = countryNameMap[rawTarget] || rawTarget;
                const feature = geographies.find(geo => matchName(geo.properties.name, targetName));
                return { name: targetName, feature };
              }).filter(t => t.feature);

              let startCoord = null;
              if (originFeature && projection) {
                const centroid = geoCentroid(originFeature);
                startCoord = projection(centroid);
              }

              return (
                <>
                  {geographies.map((geo) => {
                    const isOrigin = matchName(geo.properties.name, mappedOrigin);
                    const isTarget = targetFeatures.some(t => matchName(geo.properties.name, t.name));
                    
                    const secondaryColor = settings?.theme_secondary_color || "#18A0FB";
                    
                    let fillColor = "#E5E7EB";
                    if (isOrigin) fillColor = secondaryColor;
                    else if (isTarget) fillColor = "#16A34A";
                    
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fillColor}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none", transition: "fill 0.5s ease" },
                          hover: { outline: "none", fill: isOrigin ? secondaryColor : isTarget ? "#16A34A" : "#D1D5DB" },
                          pressed: { outline: "none" },
                        }}
                        className={isTarget ? "pulse-destination" : ""}
                      />
                    );
                  })}

                  {/* Draw the curved paths for all targets first (so they are under airplanes) */}
                  {startCoord && isAnimating && targetFeatures.map((t, index) => {
                    let endCoord = null;
                    if (projection) {
                      const centroid = geoCentroid(t.feature);
                      endCoord = projection(centroid);
                    }
                    if (!endCoord) return null;
                    
                    const pathId = `flight-path-${index}`;
                    
                    return (
                      <path
                        key={`path-${index}`}
                        id={pathId}
                        d={getCurvedPath(startCoord, endCoord)}
                        fill="transparent"
                        stroke="#16A34A"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="6 6"
                        className="animated-dashed-line"
                      />
                    );
                  })}

                  {/* Draw the animated airplanes for all targets second (so they are always on top) */}
                  {startCoord && isAnimating && targetFeatures.map((t, index) => {
                    let endCoord = null;
                    if (projection) {
                      const centroid = geoCentroid(t.feature);
                      endCoord = projection(centroid);
                    }
                    if (!endCoord) return null;
                    
                    const pathId = `flight-path-${index}`;
                    
                    return (
                      <g key={`plane-${index}`}>
                        {/* Airplane SVG icon */}
                        <svg viewBox="0 0 24 24" width="24" height="24" x="-12" y="-12">
                          <g transform="rotate(90, 12, 12)">
                            <path
                              fill="#FFFFFF"
                              stroke="#15803D"
                              strokeWidth="1"
                              d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z"
                            />
                          </g>
                        </svg>
                        <animateMotion
                          dur="2s"
                          repeatCount="indefinite"
                          rotate="auto"
                          fill="freeze"
                        >
                          <mpath xlinkHref={`#${pathId}`} />
                        </animateMotion>
                      </g>
                    );
                  })}
                </>
              );
            }}
          </Geographies>
        </ComposableMap>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animated-dashed-line {
          animation: moveDash 1s linear infinite;
        }
        @keyframes moveDash {
          to {
            stroke-dashoffset: -12;
          }
        }
        
        .pulse-destination {
          animation: colorPulse 1.5s ease-in-out 1.8s forwards;
        }
        @keyframes colorPulse {
          0% { fill: #16A34A; }
          50% { fill: #22C55E; filter: drop-shadow(0 0 4px rgba(34,197,94,0.8)); }
          100% { fill: #16A34A; }
        }
      `}} />
    </section>
  );
}
