// Memanipulasi delay seolah-olah narik data dari server Zabbix via API
export const fetchDashboardAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        // === DATA FRONTEND (Kompabilitas dengan Dashboard.jsx) ===
        network_status: 'healthy',
        devices_online: 142,
        devices_offline: 8,
        bandwidth: { download: 9.2, upload: 3.5 },
        active_users: 1248,
        avg_ping: 15,
        traffic_gedung: [
          { n: 'Rektorat', p: 64, c: '' },
          { n: 'Fakultas Kedokteran', p: 48, c: '' },
          { n: 'FISIP', p: 76, c: 'warning' },
          { n: 'FIK', p: 20, c: '' }
        ],

        // === ZABBIX JSON-RPC SIMULATION (Untuk presentasi arsitektur) ===
        _zabbix_raw: {
          jsonrpc: "2.0",
          result: [
            { 
              itemid: "23274", 
              name: "ICMP ping", 
              lastvalue: "15", 
              units: "ms",
              clock: Math.floor(Date.now() / 1000) 
            },
            { 
              itemid: "23275", 
              name: "Total devices online", 
              lastvalue: "142", 
              units: "",
              clock: Math.floor(Date.now() / 1000) 
            },
            {
              itemid: "23276",
              name: "Inbound traffic",
              lastvalue: "9878424576", // Byte format
              units: "Bps",
              clock: Math.floor(Date.now() / 1000)
            }
          ],
          id: 1,
          metadata: {
            hostid: "10084",
            api_version: "7.0.0",
            grafana_datasource_uid: "zabbix_ds_01"
          }
        }
      });
    }, 600); // Delay 600ms ala server beneran
  });
};