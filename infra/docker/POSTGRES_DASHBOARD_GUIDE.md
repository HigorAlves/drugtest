# PostgreSQL Dashboard Guide

## Introduction

This guide explains how to view and use the PostgreSQL dashboard in Grafana, as well as how to add custom queries to
monitor your PostgreSQL database.

## Accessing the PostgreSQL Dashboard

1. Open Grafana at http://localhost:3000
2. Log in with the default credentials (admin/admin)
3. Navigate to Dashboards > Browse
4. Find and open the "PostgreSQL Metrics" dashboard in the "Database" folder

## Understanding the Dashboard

The PostgreSQL dashboard provides several panels that display metrics from your PostgreSQL database:

1. **Active Connections by State**: Shows the number of connections in different states (active, idle, etc.)
2. **Connection Utilization %**: Shows the percentage of available connections being used
3. **Query Execution Time**: Shows the maximum and average query execution times
4. **Transaction Rate**: Shows the rate of commits and rollbacks
5. **Database Size**: Shows the size of the database in bytes
6. **DML Operations Rate**: Shows the rate of inserts, updates, and deletes
7. **Buffer Activity**: Shows the rate of disk reads and cache hits
8. **Locks by Type**: Shows the number of locks by lock mode

## Troubleshooting PostgreSQL Connection Issues

If the PostgreSQL dashboard shows that PostgreSQL is down, check the following:

1. Ensure PostgreSQL is running: `docker-compose ps postgres`
2. Check the PostgreSQL exporter logs: `docker-compose logs postgres-exporter`
3. Verify the connection string in the Docker Compose file:
   ```yaml
   DATA_SOURCE_NAME: "postgresql://${TYPEORM_USERNAME:-dev_local}:${TYPEORM_PASSWORD:-dev_local}@postgres:5432/${TYPEORM_DATABASE:-dev_local}?sslmode=disable"
   ```
4. Make sure the environment variables are correctly set in the `.env.development` file
5. Restart the PostgreSQL exporter: `docker-compose restart postgres-exporter`

## Adding Custom Queries to the PostgreSQL Exporter

The PostgreSQL exporter uses a `queries.yaml` file to define custom metrics. To add a new custom query:

1. Open the `queries.yaml` file at `/infra/docker/postgres-exporter/queries.yaml`
2. Add a new metric definition under the `pg_custom_metrics` section:

```yaml
- metric_name: pg_custom_metric_name
  query: |
    SELECT
      column1 as label1,
      column2 as label2,
      column3 as value
    FROM your_table
    WHERE your_condition
  metrics:
    - label1:
        usage: "LABEL"
        description: "Description of label1"
    - label2:
        usage: "LABEL"
        description: "Description of label2"
    - value:
        usage: "GAUGE" # or "COUNTER" for cumulative metrics
        description: "Description of the value"
```

3. Restart the PostgreSQL exporter to apply the changes:
   ```bash
   docker-compose restart postgres-exporter
   ```

## Adding Custom Metrics to the Grafana Dashboard

To add a new panel to the Grafana dashboard using your custom metrics:

1. Open the PostgreSQL dashboard in Grafana
2. Click "Add panel" in the top navigation bar
3. Click "Add new panel"
4. In the query editor, select "Prometheus" as the data source
5. Enter a PromQL query using your custom metric, for example:
   ```
   pg_custom_metric_name_value{database="your_database"}
   ```
6. Configure the panel title, visualization type, and other settings as needed
7. Click "Apply" to add the panel to the dashboard
8. Save the dashboard by clicking the save icon in the top right corner

## Example Custom Queries

Here are some example custom queries you can add to the `queries.yaml` file:

### Query Performance by Table

```yaml
- metric_name: pg_table_query_stats
  query: |
    SELECT
      schemaname as schema,
      relname as table,
      seq_scan,
      seq_tup_read,
      seq_scan / NULLIF(seq_scan + idx_scan, 0) * 100 as seq_scan_pct
    FROM pg_stat_user_tables
  metrics:
    - schema:
        usage: "LABEL"
        description: "Schema name"
    - table:
        usage: "LABEL"
        description: "Table name"
    - seq_scan:
        usage: "COUNTER"
        description: "Number of sequential scans"
    - seq_tup_read:
        usage: "COUNTER"
        description: "Number of tuples read by sequential scans"
    - seq_scan_pct:
        usage: "GAUGE"
        description: "Percentage of scans that are sequential"
```

### Connection Statistics by Application

```yaml
- metric_name: pg_application_connections
  query: |
    SELECT
      application_name as application,
      state,
      count(*) as count
    FROM pg_stat_activity
    GROUP BY application_name, state
  metrics:
    - application:
        usage: "LABEL"
        description: "Application name"
    - state:
        usage: "LABEL"
        description: "Connection state"
    - count:
        usage: "GAUGE"
        description: "Number of connections"
```

### Table Bloat Estimation

```yaml
- metric_name: pg_table_bloat
  query: |
    SELECT
      schemaname as schema,
      tablename as table,
      ROUND(CASE WHEN otta=0 THEN 0.0 ELSE sml.relpages/otta::numeric END,1) as table_bloat_ratio,
      CASE WHEN relpages < otta THEN 0 ELSE bs*(sml.relpages-otta)::bigint END as table_bloat_size
    FROM (
      SELECT
        schemaname, tablename, cc.reltuples, cc.relpages, bs,
        CEIL((cc.reltuples*((datahdr+ma-
          (CASE WHEN datahdr%ma=0 THEN ma ELSE datahdr%ma END))+nullhdr2+4))/(bs-20::float)) AS otta
      FROM (
        SELECT
          ma,bs,schemaname,tablename,
          (datawidth+(hdr+ma-(case when hdr%ma=0 THEN ma ELSE hdr%ma END)))::numeric AS datahdr,
          (maxfracsum*(nullhdr+ma-(case when nullhdr%ma=0 THEN ma ELSE nullhdr%ma END))) AS nullhdr2
        FROM (
          SELECT
            schemaname, tablename, hdr, ma, bs,
            SUM((1-null_frac)*avg_width) AS datawidth,
            MAX(null_frac) AS maxfracsum,
            hdr+(
              SELECT 1+count(*)/8
              FROM pg_stats s2
              WHERE null_frac<>0 AND s2.schemaname = s.schemaname AND s2.tablename = s.tablename
            ) AS nullhdr
          FROM pg_stats s, (
            SELECT
              (SELECT current_setting('block_size')::numeric) AS bs,
              CASE WHEN substring(v,12,3) IN ('8.0','8.1','8.2') THEN 27 ELSE 23 END AS hdr,
              CASE WHEN v ~ 'mingw32' THEN 8 ELSE 4 END AS ma
            FROM (SELECT version() AS v) AS foo
          ) AS constants
          GROUP BY 1,2,3,4,5
        ) AS foo
      ) AS foo2
      JOIN pg_class cc ON cc.relname = tablename
      JOIN pg_namespace nn ON cc.relnamespace = nn.oid AND nn.nspname = schemaname
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
    ) AS sml
  metrics:
    - schema:
        usage: "LABEL"
        description: "Schema name"
    - table:
        usage: "LABEL"
        description: "Table name"
    - table_bloat_ratio:
        usage: "GAUGE"
        description: "Table bloat ratio"
    - table_bloat_size:
        usage: "GAUGE"
        description: "Table bloat size in bytes"
```

## Conclusion

With the PostgreSQL dashboard in Grafana and the ability to add custom queries, you can effectively monitor the
performance and health of your PostgreSQL database. By adding custom metrics tailored to your specific needs, you can
gain deeper insights into your database's behavior and identify potential issues before they become problems.
