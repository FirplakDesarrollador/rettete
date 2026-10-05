const sqlite3 = require('@louislam/sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/kuma.db');
const db = new sqlite3.Database(dbPath);

const customBody = JSON.stringify({
  monitor_name: "{{ monitorJSON.name }}",
  monitor_type: "{{ monitorJSON.type }}",
  target: "{{ monitorJSON.hostname or monitorJSON.url or 'N/A' }}",
  status_code: 1,
  ping: 25,
  msg: "{{ msg }}"
});

const notificationConfig = {
  type: "webhook",
  name: "Supabase Edge Function API",
  webhookURL: "https://jdtjtkncptwqdhlxmzds.supabase.co/functions/v1/uptime-webhook",
  webhookContentType: "custom",
  webhookCustomBody: "{\n  \"monitor_name\": {{ monitorJSON.name | json }},\n  \"monitor_type\": {{ monitorJSON.type | json }},\n  \"target\": {{ hostnameOrURL | json }},\n  \"status_code\": {{ heartbeatJSON.status | default: 0 }},\n  \"ping\": {{ heartbeatJSON.ping | default: 0 }},\n  \"msg\": {{ msg | json }}\n}",
  resendInterval: 1,
  isDefault: true
};

const configString = JSON.stringify(notificationConfig);

db.run(`UPDATE notification SET config = ? WHERE id = 1`, [configString], function(err) {
  if (err) {
    console.error('Error updating notification:', err);
    process.exit(1);
  }
  console.log('Successfully updated notification template with monitorJSON variables!');
  db.close();
});
