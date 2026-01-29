import React from "react";
import { io } from "socket.io-client";

const prettyTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString();
};

const OpayDevicesPanel = ({ viewerApiKey, socketUrl }) => {
  const [connected, setConnected] = React.useState(false);
  const [devices, setDevices] = React.useState([]);

  React.useEffect(() => {
    const SOCKET_URL = socketUrl;
    const VIEWER_API_KEY = viewerApiKey;
    if (!SOCKET_URL || !VIEWER_API_KEY) return;
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    s.on("connect", () => {
      setConnected(true);
      s.emit("viewer:registerApiKey", { apiKey: VIEWER_API_KEY });
    });
    s.on("disconnect", () => setConnected(false));
    s.on("viewer:devices", (list) => {
      if (Array.isArray(list)) setDevices(list);
    });
    s.on("viewer:device", (item) => {
      if (!item || !item.deviceId) return;
      setDevices((prev) => {
        const map = new Map(prev.map(d => [String(d.deviceId), d]));
        const existing = map.get(String(item.deviceId)) || {};
        map.set(String(item.deviceId), { ...existing, ...item });
        return Array.from(map.values());
      });
    });
    return () => { s.disconnect(); };
  }, []);

  const online = devices.filter(d => d.active);

  return (
    <div className="mt-4 border rounded-lg p-3 bg-yellow-50 border-yellow-200">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-yellow-800">Opay Devices</div>
        <div className={`text-xs ${connected ? 'text-green-700' : 'text-red-700'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      <div className="mt-2 text-sm text-yellow-900">
        Online: <span className="font-bold">{online.length}</span> / Total: {devices.length}
      </div>
      <div className="mt-2 max-h-40 overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-yellow-800">
              <th className="py-1 pr-2">Status</th>
              <th className="py-1 pr-2">Device</th>
              <th className="py-1">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr><td colSpan={3} className="py-2 text-yellow-700">No devices</td></tr>
            ) : devices.map((d) => (
              <tr key={d.deviceId} className="border-t border-yellow-200">
                <td className="py-1 pr-2">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${d.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {d.active ? 'Online' : 'Offline'}
                </td>
                <td className="py-1 pr-2 font-mono">{d.deviceId}</td>
                <td className="py-1">{prettyTime(d.lastSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpayDevicesPanel;