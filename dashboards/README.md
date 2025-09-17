# PRTG Grafana Plugin Dashboards

This directory contains example dashboards for the PRTG API v2 Grafana Plugin.

## Dashboard Files

### current-alerts-plugin.json
A focused dashboard showing current alerts and issues in PRTG.

**Features:**
- Down objects table with detailed information
- Warning objects table
- Status distribution pie chart
- Count statistics for down and warning objects
- Auto-refresh every 30 seconds

**Panels:**
- Down Objects (table) - Shows all objects with down status
- Warning Objects (table) - Shows all objects with warning status  
- Status Distribution (pie chart) - Visual breakdown of all status types
- Objects Down (stat) - Count of down objects
- Objects Warning (stat) - Count of warning objects

### prtg-overview-plugin.json
Comprehensive monitoring dashboard with multiple sections.

**Features:**
- Overview section with key metrics
- Critical issues section for down objects
- Warnings section for warning objects
- Device overview section
- Organized with collapsible row panels
- Auto-refresh every 30 seconds

**Panels:**
- **Overview Row:**
  - Total Objects (stat)
  - Down Count (stat)
  - Warning Count (stat)
  - Paused Count (stat)
  - Status Distribution (donut chart)

- **Critical Issues Row:**
  - Down Objects (table) - Detailed view with device, group, timestamps

- **Warnings & Issues Row:**
  - Warning Objects (table) - Warning status objects

- **Device Overview Row:**
  - All Devices (table) - Device status with sensor counts

## Installation

1. **Import Dashboards:**
   - Go to Grafana > Dashboards > Import
   - Copy and paste the JSON content from any dashboard file
   - Configure the datasource variable to point to your PRTG API v2 datasource

2. **Datasource Configuration:**
   - Ensure you have created a PRTG API v2 datasource
   - The dashboard templates use variable `${DS_PRTG_API_V2}`
   - During import, map this to your actual PRTG datasource

## Customization

### Adding Filters
You can customize the queries in each panel to add specific filters:

```
# Show only specific device types
kind_name = 'Ping Sensor' AND status != up

# Filter by device name
parent.name contains 'server' AND status = down

# Show recent issues
status = down AND lastdown > '2024-01-01'
```

### Column Customization
Modify the `columns` array in query targets to show different fields:

```
# Basic columns
["name", "status", "message"]

# Extended information  
["name", "status", "message", "parent.name", "lastup", "lastdown", "kind_name"]

# Device specific
["name", "host", "totalsens", "upsens", "downsens", "warnsens"]
```

### Adding New Panels

1. **Clone Existing Panel**: Duplicate a similar panel and modify the query
2. **Change Endpoint**: Select different API endpoint (sensors, devices, groups)
3. **Adjust Visualization**: Choose appropriate panel type for your data
4. **Configure Thresholds**: Set color coding for different statuses

## Query Examples

### Common Filters
```
# All down objects
status = down

# Warning objects from last 24 hours  
status = warning AND lastcheck > now() - 1d

# Specific sensor types
kind_name in ('Ping Sensor', 'HTTP Sensor')

# Objects from specific group
group = 'Production Servers'

# Devices with multiple sensor issues
kind_name = 'Device' AND downsens > 0
```

### Advanced Queries
```
# Critical sensors only
kind_name contains 'Sensor' AND status = down AND priority = 'high'

# Network devices with issues
(kind_name = 'Device' OR kind_name = 'Router') AND status != up

# Recent state changes
status != up AND lastdown > now() - 2h
```

## Troubleshooting

### Dashboard Import Issues
- Ensure PRTG API v2 plugin is installed and enabled
- Check that datasource exists before importing
- Verify datasource permissions and API key

### No Data Showing
- Confirm datasource configuration is correct
- Test datasource connection in Data Sources settings  
- Check PRTG API v2 is accessible from Grafana server
- Verify API key has read permissions

### Performance Issues
- Add appropriate limits to queries (e.g., limit: 100)
- Use filters to reduce data volume
- Consider increasing refresh intervals for large datasets
- Select only necessary columns to reduce bandwidth

## Contributing

To contribute new dashboards or improvements:

1. Create your dashboard in Grafana
2. Export as JSON
3. Remove specific UIDs and datasource references
4. Add appropriate template variables
5. Document features and usage
6. Submit as pull request

## Template Variables

For more advanced dashboards, consider adding template variables:

- **Device Group**: Filter by PRTG device groups
- **Object Type**: Filter by sensor/device type
- **Time Range**: Custom time ranges for historical data
- **Status Filter**: Dynamic status filtering

Example template variable for device groups:
```json
{
  "query": "experimental/objects",
  "filter": "kind_name = 'Group'",
  "columns": ["name"]
}
```