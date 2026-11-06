import { useState } from "react";
import { MapPin } from "lucide-react";
export function LocationMap() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="location-map">
      {loaded ? (
        <iframe
          title="Localização da HLS Ferragens em Blumenau"
          src="https://maps.google.com/maps?q=Rua%20Johann%20G.%20H.%20Hadlich%201852%20Blumenau&output=embed"
          width="1200"
          height="330"
          loading="lazy"
          referrerPolicy="no-referrer"
          allowFullScreen
        />
      ) : (
        <button className="map-load" onClick={() => setLoaded(true)}>
          <MapPin size={25} />
          <span>
            Encontre a HLS em Blumenau<small>Carregar mapa do Google</small>
          </span>
          <span aria-hidden="true">↗</span>
        </button>
      )}
    </div>
  );
}
