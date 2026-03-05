// cloudwatch.js (Demo Monitoring)

let monitorData = {
  cpu: [],
  mem: [],
  netIn: [],
  netOut: []
};

function initializeMockData() {
  const now = Date.now();
  monitorData = { cpu: [], mem: [], netIn: [], netOut: [] };

  for (let i = 0; i < 24; i++) {
    monitorData.cpu.push({ t: new Date(now - i * 3600000).toISOString(), v: Math.random() * 80 + 10 });
    monitorData.mem.push({ t: new Date(now - i * 3600000).toISOString(), v: Math.random() * 40 + 40 });
    monitorData.netIn.push({ t: new Date(now - i * 3600000).toISOString(), v: Math.random() * 500 + 100 });
    monitorData.netOut.push({ t: new Date(now - i * 3600000).toISOString(), v: Math.random() * 300 + 50 });
  }

  // chronological
  monitorData.cpu.reverse();
  monitorData.mem.reverse();
  monitorData.netIn.reverse();
  monitorData.netOut.reverse();
}

document.addEventListener('DOMContentLoaded', function () {
  initializeMockData();
  renderDashboard();
  setInterval(updateRealTime, 5000);
});

function renderDashboard() {
  renderAlarms();
  renderMetrics();
  renderLogs();
}

function renderAlarms() {
  const alerts = [
    { name: 'cpu_high_demo', status: 'ALARM', metric: 'CPU', threshold: '> 80%', current: '45%' },
    { name: 'memory_usage_demo', status: 'OK', metric: 'Memory', threshold: '> 90%', current: '62%' },
    { name: 'disk_io_demo', status: 'OK', metric: 'Disk', threshold: '> 1GB/s', current: '256 MB/s' },
    { name: 'network_in_demo', status: 'INSUFFICIENT_DATA', metric: 'Network', threshold: '> 1GB/s', current: 'N/A' }
  ];

  const list = document.getElementById('alarmList');
  if (!list) return;

  list.innerHTML = alerts.map(a => `
    <div class="alarm-item">
      <div class="alarm-info">
        <span class="alarm-icon ${a.status.toLowerCase()}">
          ${a.status === 'OK' ? '✓' : a.status === 'ALARM' ? '⚠' : '?'}
        </span>
        <div>
          <h4>${a.name}</h4>
          <p>Metric: ${a.metric} | Threshold: ${a.threshold}</p>
        </div>
      </div>
      <div class="alarm-status ${a.status.toLowerCase()}">${a.status}</div>
    </div>
  `).join('');
}

function renderMetrics() {
  // CPU
  const cpuContainer = document.getElementById('cpuChart');
  const latestCpu = monitorData.cpu.at(-1)?.v || 0;
  cpuContainer.innerHTML = `
    <div class="metric-value">${latestCpu.toFixed(1)}%</div>
    <div class="metric-bar">
      <div class="metric-fill" style="width:${Math.min(latestCpu, 100)}%"></div>
    </div>
  `;

  // Memory
  const memContainer = document.getElementById('memChart');
  const latestMem = monitorData.mem.at(-1)?.v || 0;
  memContainer.innerHTML = `
    <div class="metric-value">${latestMem.toFixed(1)}%</div>
    <div class="metric-bar">
      <div class="metric-fill" style="width:${Math.min(latestMem, 100)}%"></div>
    </div>
  `;

  // Net In
  const netInContainer = document.getElementById('netInChart');
  const latestNetIn = monitorData.netIn.at(-1)?.v || 0;
  netInContainer.innerHTML = `
    <div class="metric-value">${latestNetIn.toFixed(1)} MB/s</div>
    <div class="metric-bar">
      <div class="metric-fill" style="width:${Math.min(latestNetIn / 10, 100)}%"></div>
    </div>
  `;

  // Net Out
  const netOutContainer = document.getElementById('netOutChart');
  const latestNetOut = monitorData.netOut.at(-1)?.v || 0;
  netOutContainer.innerHTML = `
    <div class="metric-value">${latestNetOut.toFixed(1)} MB/s</div>
    <div class="metric-bar">
      <div class="metric-fill" style="width:${Math.min(latestNetOut / 10, 100)}%"></div>
    </div>
  `;

  // Stats
  const avg = (arr) => arr.reduce((s, x) => s + x.v, 0) / (arr.length || 1);

  document.getElementById('avgCpu').textContent = avg(monitorData.cpu).toFixed(1) + '%';
  document.getElementById('avgMem').textContent = avg(monitorData.mem).toFixed(1) + '%';
  document.getElementById('totalRequests').textContent = Math.floor(Math.random() * 1000000);
  document.getElementById('errorRate').textContent = (Math.random() * 2).toFixed(2) + '%';
}

function renderLogs() {
  const logs = [
    { time: new Date().toISOString(), level: 'INFO', message: 'VM instance started successfully' },
    { time: new Date(Date.now() - 60000).toISOString(), level: 'WARN', message: 'High memory usage detected on VM' },
    { time: new Date(Date.now() - 120000).toISOString(), level: 'ERROR', message: 'Database connection failed (demo)' },
    { time: new Date(Date.now() - 180000).toISOString(), level: 'INFO', message: 'Scheduled backup completed' },
    { time: new Date(Date.now() - 240000).toISOString(), level: 'INFO', message: 'Auto-scaling: added 2 instances (demo)' }
  ];

  const list = document.getElementById('logList');
  if (!list) return;

  list.innerHTML = logs.map(log => `
    <div class="log-item">
      <span class="log-time">${new Date(log.time).toLocaleTimeString()}</span>
      <span class="log-level ${log.level.toLowerCase()}">${log.level}</span>
      <span class="log-message">${log.message}</span>
    </div>
  `).join('');
}

function updateRealTime() {
  const now = new Date().toISOString();

  monitorData.cpu.push({ t: now, v: Math.random() * 80 + 10 });
  monitorData.mem.push({ t: now, v: Math.random() * 40 + 40 });
  monitorData.netIn.push({ t: now, v: Math.random() * 500 + 100 });
  monitorData.netOut.push({ t: now, v: Math.random() * 300 + 50 });

  // keep last 24
  for (const k of ['cpu', 'mem', 'netIn', 'netOut']) {
    if (monitorData[k].length > 24) monitorData[k].shift();
  }

  renderMetrics();
}

function refreshData() {
  updateRealTime();
  renderAlarms();
  renderLogs();
  alert('Demo data refreshed!');
}