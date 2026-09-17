import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import "./App.css";

type AppChannel = {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  volume: number;
  muted: boolean;
  active?: boolean;
};

const initialChannels: AppChannel[] = [
  { id: "whatsapp", name: "WhatsApp", subtitle: "Voice call", icon: "☎", color: "green", volume: 42, muted: false, active: true },
  { id: "vlc", name: "VLC media player", subtitle: "Video playback", icon: "▶", color: "orange", volume: 76, muted: false },
  { id: "system", name: "System sounds", subtitle: "macOS", icon: "⌘", color: "blue", volume: 24, muted: true },
];

function Icon({ name, size = 18 }: { name: "sliders" | "settings" | "bell" | "plus" | "chevron" | "headphones" | "wave" | "more"; size?: number }) {
  const paths: Record<string, ReactNode> = {
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="9" cy="6" r="2" /><circle cx="15" cy="12" r="2" /><circle cx="8" cy="18" r="2" /></>,
    settings: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /><circle cx="12" cy="12" r="3.5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
    headphones: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><path d="M4 14h3v6H5a1 1 0 0 1-1-1zM20 14h-3v6h2a1 1 0 0 0 1-1z" /></>,
    wave: <path d="M3 12h3l2-6 4 12 3-9 2 5h4" />,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function App() {
  const [channels, setChannels] = useState(initialChannels);
  const [output, setOutput] = useState("MacBook Pro Speakers");
  const [compact, setCompact] = useState(false);
  const [toast, setToast] = useState("");

  const averageLevel = useMemo(() => Math.round(channels.filter((channel) => !channel.muted).reduce((sum, channel) => sum + channel.volume, 0) / 2.3), [channels]);

  function updateChannel(id: string, patch: Partial<AppChannel>) {
    setChannels((current) => current.map((channel) => channel.id === id ? { ...channel, ...patch } : channel));
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  return (
    <div className={`app-shell ${compact ? "is-compact" : ""}`}>
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Icon name="sliders" size={20} /></div><span>mixer</span></div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Notifications" onClick={() => showToast("You're all caught up") }><Icon name="bell" size={18} /><span className="notification-dot" /></button>
          <button className="icon-button" aria-label="Settings" onClick={() => showToast("Settings are coming soon")}><Icon name="settings" size={19} /></button>
          <div className="avatar">MK</div>
        </div>
      </header>

      <main className="content">
        <section className="intro-row">
          <div><p className="eyebrow">AUDIO CONTROL CENTER</p><h1>Good evening, Moriz</h1><p className="subheading">Balance your apps. Stay in the call.</p></div>
          <button className="mini-button" onClick={() => setCompact(!compact)}><span className="mini-dot" />{compact ? "Expand mixer" : "Mini mode"}</button>
        </section>

        <section className="call-banner">
          <div className="call-icon"><Icon name="headphones" size={20} /></div>
          <div className="call-copy"><strong>WhatsApp call in progress</strong><span>Your call audio is prioritized</span></div>
          <span className="live-pill"><i /> LIVE</span>
          <button className="banner-more" aria-label="More call options" onClick={() => showToast("Call audio is prioritized")}><Icon name="more" size={18} /></button>
        </section>

        <section className="mixer-card">
          <div className="card-heading"><div><h2>App volumes</h2><p>Control each app independently</p></div><button className="add-button" onClick={() => showToast("Open an app to add it to the mixer")}><Icon name="plus" size={17} /> Add app</button></div>
          <div className="channels">
            {channels.map((channel) => (
              <article className={`channel ${channel.active ? "is-active" : ""}`} key={channel.id}>
                <div className="channel-top">
                  <div className={`app-icon ${channel.color}`}>{channel.icon}</div>
                  <div className="channel-name"><strong>{channel.name}</strong><span>{channel.subtitle}</span></div>
                  {channel.active && <span className="talking"><i /> Talking</span>}
                  <button className="channel-more" aria-label={`More options for ${channel.name}`} onClick={() => showToast(`${channel.name} options`)}><Icon name="more" size={17} /></button>
                </div>
                <div className="volume-row">
                  <button className={`mute-button ${channel.muted ? "is-muted" : ""}`} aria-label={channel.muted ? `Unmute ${channel.name}` : `Mute ${channel.name}`} onClick={() => updateChannel(channel.id, { muted: !channel.muted })}>{channel.muted ? "×" : "⌁"}</button>
                  <div className="range-wrap"><input aria-label={`${channel.name} volume`} type="range" min="0" max="100" value={channel.muted ? 0 : channel.volume} onChange={(event) => updateChannel(channel.id, { volume: Number(event.currentTarget.value), muted: false })} style={{ "--value": `${channel.muted ? 0 : channel.volume}%` } as CSSProperties} /><div className="range-marks"><span>0</span><span>50</span><span>100</span></div></div>
                  <span className="volume-value">{channel.muted ? "Muted" : `${channel.volume}%`}</span>
                </div>
              </article>
            ))}
          </div>
          <button className="add-channel" onClick={() => showToast("Open an app to add it to the mixer")}><Icon name="plus" size={16} /> Add another app</button>
        </section>

        <section className="bottom-grid">
          <div className="output-card"><div className="section-label"><span><Icon name="headphones" size={16} /> OUTPUT DEVICE</span><button aria-label="Output device options" onClick={() => showToast("Output device options")}><Icon name="more" size={17} /></button></div><button className="device-select" onClick={() => setOutput(output === "MacBook Pro Speakers" ? "AirPods Pro" : "MacBook Pro Speakers")}><span className="device-icon"><Icon name="headphones" size={18} /></span><span><strong>{output}</strong><small>Built-in output</small></span><Icon name="chevron" size={17} /></button></div>
          <div className="meter-card"><div className="section-label"><span><Icon name="wave" size={16} /> MASTER OUTPUT</span><span className="meter-db">-{Math.max(2, Math.round(100 - averageLevel))} dB</span></div><div className="meter"><div className="meter-fill" style={{ width: `${Math.min(100, averageLevel)}%` }} /><div className="meter-ticks"><span>-24</span><span>-12</span><span>-6</span><span>0</span></div></div></div>
        </section>
        <footer><span><i className="status-dot" /> Mixer controls ready</span><span>Local session</span></footer>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;