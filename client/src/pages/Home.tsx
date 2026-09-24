import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  CircleDot,
  Compass,
  Crosshair,
  Grid3X3,
  Info,
  Layers3,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  RotateCcw,
  Satellite,
  ScanLine,
  Search,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type ViewMode = "orbital" | "satellite" | "terrain";
type Layer = "streets" | "transit" | "terrain";

const cityStats = [
  { label: "LATITUD", value: "25.6866° N" },
  { label: "LONGITUD", value: "100.3161° O" },
  { label: "ALTITUD", value: "537 M" },
];

const places = [
  { name: "Macroplaza", kind: "PUNTO DE INTERÉS", distance: "0.8 km", color: "lime" },
  { name: "Pabellón M", kind: "REFERENCIA URBANA", distance: "1.4 km", color: "pink" },
  { name: "Cerro de la Silla", kind: "HITO NATURAL", distance: "9.2 km", color: "cyan" },
];

const formatZoom = (zoom: number) => `${Math.round((zoom - 1) * 100 + 100)}%`;

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("orbital");
  const [layer, setLayer] = useState<Layer>("streets");
  const [zoom, setZoom] = useState(1.05);
  const [search, setSearch] = useState("Monterrey Centro");
  const [isTracking, setIsTracking] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [notice, setNotice] = useState("ENFOQUE FIJADO EN MONTERREY CENTRO");

  const modeLabel = useMemo(() => {
    if (viewMode === "satellite") return "SATÉLITE";
    if (viewMode === "terrain") return "TERRENO";
    return "ÓRBITA 3D";
  }, [viewMode]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = search.trim().toLowerCase();
    if (normalized.includes("monterrey") || normalized.includes("centro")) {
      setIsTracking(true);
      setZoom(1.22);
      setNotice("DESTINO CONFIRMADO · MONTERREY CENTRO");
    } else {
      setNotice("SIMULACIÓN LISTA · ESCRIBE MONTERREY CENTRO");
    }
  };

  const changeView = (mode: ViewMode) => {
    setViewMode(mode);
    setNotice(`CAPA DE VISUALIZACIÓN · ${mode === "orbital" ? "ÓRBITA 3D" : mode === "satellite" ? "SATÉLITE" : "TERRENO"}`);
  };

  const resetView = () => {
    setZoom(1.05);
    setIsTracking(true);
    setViewMode("orbital");
    setLayer("streets");
    setNotice("VISTA RESTABLECIDA · MONTERREY CENTRO");
  };

  return (
    <main className="neon-app">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>
          <div>
            <div className="brand-name">NEON <em>EARTH</em></div>
            <div className="brand-meta">PLANETARY NAVIGATION / 01</div>
          </div>
        </div>
        <div className="topbar-center">
          <div className="coordinate-prompt"><span className="prompt-dot" /> MONTERREY, NUEVO LEÓN <ChevronDown size={13} /></div>
          <div className="sync-status"><span className="pulse-dot" /> LIVE SYNC <span className="slash">/</span> 24.8 FPS</div>
        </div>
        <div className="topbar-actions">
          <div className="secure-chip"><ShieldCheck size={14} /> DEMO SEGURA</div>
          <button className="icon-button compact" aria-label="Abrir menú"><Menu size={17} /></button>
        </div>
      </header>

      <section className="mission-bar" aria-label="Búsqueda y ruta">
        <div className="mission-index"><span>01</span><i /></div>
        <div className="mission-copy">
          <span className="eyebrow">DESTINO ACTIVO</span>
          <strong>RUTA DE EXPLORACIÓN</strong>
        </div>
        <form className="search-shell" onSubmit={handleSearch}>
          <Search size={17} />
          <input aria-label="Buscar destino" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busca una ciudad o coordenadas" />
          <button type="submit" className="search-submit" aria-label="Buscar destino"><ArrowUpRight size={17} /></button>
        </form>
        <div className="mission-readout"><span>OBJETIVO</span><strong>25°41'12.0&quot; N</strong><small>100°18'58.0&quot; O</small></div>
      </section>

      <section className="experience-grid">
        <aside className="left-rail">
          <div className="panel panel-status">
            <div className="panel-heading"><span>ORBITAL STATUS</span><Activity size={15} /></div>
            <div className="status-main"><div className="status-number">01</div><div><span className="status-kicker">PUNTO DE VISTA</span><strong>MONTERREY<br />CENTRO</strong></div></div>
            <div className="status-line"><span>SEÑAL CARTOGRÁFICA</span><strong>ESTABLE</strong></div>
            <div className="signal-bars" aria-label="Señal estable"><i /><i /><i /><i /><i /></div>
            <div className="status-line"><span>ÁNGULO DE CÁMARA</span><strong>34.8°</strong></div>
          </div>

          <div className="panel layer-panel">
            <div className="panel-heading"><span>CAPAS DE DATOS</span><Layers3 size={15} /></div>
            <div className="layer-list">
              <button className={`layer-row ${layer === "streets" ? "active" : ""}`} onClick={() => { setLayer("streets"); setNotice("CAPA ACTIVA · RED URBANA"); }}><span className="layer-icon cyan"><Grid3X3 size={14} /></span><span><b>RED URBANA</b><small>calles y bloques</small></span><span className="layer-toggle" /></button>
              <button className={`layer-row ${layer === "transit" ? "active" : ""}`} onClick={() => { setLayer("transit"); setNotice("CAPA ACTIVA · FLUJO VEHICULAR"); }}><span className="layer-icon pink"><Navigation size={14} /></span><span><b>FLUJO VEHICULAR</b><small>tráfico simulado</small></span><span className="layer-toggle" /></button>
              <button className={`layer-row ${layer === "terrain" ? "active" : ""}`} onClick={() => { setLayer("terrain"); setNotice("CAPA ACTIVA · TOPOGRAFÍA"); }}><span className="layer-icon lime"><Satellite size={14} /></span><span><b>TOPOGRAFÍA</b><small>elevación y relieve</small></span><span className="layer-toggle" /></button>
            </div>
          </div>

          <div className="panel mini-telemetry">
            <div className="panel-heading"><span>TELEMETRÍA</span><ScanLine size={15} /></div>
            <div className="telemetry-row"><span>ALTURA</span><strong>12.4 KM</strong></div>
            <div className="telemetry-row"><span>VELOCIDAD</span><strong>0.0 KM/H</strong></div>
            <div className="telemetry-row"><span>ACTUALIZADO</span><strong>AHORA</strong></div>
          </div>
        </aside>

        <section className="planet-stage" aria-label="Globo planetario interactivo">
          <div className="stage-topline"><span><CircleDot size={12} /> LIVE PLANET VIEW</span><span className="stage-time">24 SEP 2026 <b>01:09:41</b></span></div>
          <div className="atmosphere atmosphere-one" />
          <div className="atmosphere atmosphere-two" />
          <div className={`planet-wrap mode-${viewMode} ${isTracking ? "tracking" : ""}`}>
            <div className="planet" style={{ transform: `scale(${zoom})` }}>
              <div className="planet-shine" />
              <div className="planet-grid" />
              <div className="landmass landmass-a" />
              <div className="landmass landmass-b" />
              <div className="city-glow" />
              <div className="route-path"><span className="route-point point-one" /><span className="route-point point-two" /><span className="route-point point-three" /></div>
              <div className="city-marker"><span className="marker-pulse" /><span className="marker-core" /><span className="marker-label">MONTERREY CENTRO</span></div>
            </div>
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <div className="orbit orbit-c" />
          </div>
          {showGrid && <div className="stage-grid" aria-hidden="true"><span /><span /><span /><span /></div>}
          <div className="crosshair"><span /><span /></div>
          <div className="axis-label axis-top">N <small>0°</small></div>
          <div className="axis-label axis-bottom">S <small>180°</small></div>
          <div className="axis-label axis-left">O <small>270°</small></div>
          <div className="axis-label axis-right">E <small>90°</small></div>
          <div className="planet-caption"><span>EARTH / 03</span><strong>CONTINENTAL<br />MESH ONLINE</strong></div>
          <div className="stage-controls">
            <button className="icon-button" onClick={() => setZoom(Math.min(1.55, zoom + 0.08))} aria-label="Acercar"><ZoomIn size={17} /></button>
            <button className="icon-button" onClick={() => setZoom(Math.max(0.86, zoom - 0.08))} aria-label="Alejar"><ZoomOut size={17} /></button>
            <button className={`icon-button ${showGrid ? "selected" : ""}`} onClick={() => setShowGrid(!showGrid)} aria-label="Alternar cuadrícula"><Grid3X3 size={16} /></button>
            <button className={`icon-button ${isTracking ? "selected" : ""}`} onClick={() => { setIsTracking(!isTracking); setNotice(isTracking ? "SEGUIMIENTO MANUAL ACTIVADO" : "SEGUIMIENTO EN MONTERREY"); }} aria-label="Alternar seguimiento"><Crosshair size={16} /></button>
          </div>
          <div className="zoom-readout"><span>ZOOM</span><strong>{formatZoom(zoom)}</strong></div>
        </section>

        <aside className="right-rail">
          <div className="panel mode-panel">
            <div className="panel-heading"><span>VISUALIZACIÓN</span><Compass size={15} /></div>
            <div className="mode-switcher">
              <button className={viewMode === "orbital" ? "active" : ""} onClick={() => changeView("orbital")}><span className="mode-orbital" />ÓRBITA 3D</button>
              <button className={viewMode === "satellite" ? "active" : ""} onClick={() => changeView("satellite")}><span className="mode-satellite" />SATÉLITE</button>
              <button className={viewMode === "terrain" ? "active" : ""} onClick={() => changeView("terrain")}><span className="mode-terrain" />TERRENO</button>
            </div>
          </div>

          <div className="panel city-panel">
            <div className="city-title-row"><div><span className="eyebrow">DESTINO SELECCIONADO</span><h1>Monterrey<br /><em>Centro</em></h1></div><div className="pin-badge"><MapPin size={17} /></div></div>
            <div className="city-stats">{cityStats.map((stat) => <div key={stat.label}><span>{stat.label}</span><strong>{stat.value}</strong></div>)}</div>
            <div className="city-note"><LocateFixed size={15} /><span>Zona metropolitana<br /><b>Nuevo León · México</b></span></div>
            <button className="route-button" onClick={handleSearch.bind(null, { preventDefault: () => undefined } as FormEvent<HTMLFormElement>)}>RECALCULAR RUTA <ArrowUpRight size={16} /></button>
          </div>

          <div className="panel places-panel">
            <div className="panel-heading"><span>HITOS CERCANOS</span><span className="places-count">03</span></div>
            <div className="place-list">{places.map((place) => <button key={place.name} className="place-row" onClick={() => setNotice(`PUNTO DE INTERÉS · ${place.name.toUpperCase()}`)}><span className={`place-dot ${place.color}`} /><span className="place-content"><b>{place.name}</b><small>{place.kind}</small></span><span className="place-distance">{place.distance}</span></button>)}</div>
          </div>
        </aside>
      </section>

      <footer className="bottom-console">
        <div className="console-status"><span className="status-live"><i /> LIVE</span><span>{notice}</span></div>
        <div className="console-timeline"><span>00:00</span><div className="timeline-line"><i /><b /></div><span>00:24</span></div>
        <div className="console-actions"><button className={`console-toggle ${showTraffic ? "active" : ""}`} onClick={() => { setShowTraffic(!showTraffic); setNotice(showTraffic ? "TRÁFICO SIMULADO DESACTIVADO" : "TRÁFICO SIMULADO ACTIVADO"); }}><span className="tiny-switch" /> TRÁFICO</button><button className="console-reset" onClick={resetView}><RotateCcw size={14} /> RESTABLECER</button><button className="info-button" aria-label="Información del demo" onClick={() => setNotice("NEON EARTH · EXPERIENCIA VISUAL DEMO")}><Info size={15} /></button></div>
      </footer>
    </main>
  );
}
