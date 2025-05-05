# Observability Infrastructure

This document describes the observability infrastructure set up in this project, which includes distributed tracing with
Grafana Tempo, metrics collection with Grafana Mimir and Prometheus, log aggregation with Grafana Loki, alerting with
Alertmanager, synthetic monitoring
with Blackbox Exporter, infrastructure monitoring with Node Exporter, and visualization with Grafana.

## Overview

The observability infrastructure consists of the following components:

1. **Grafana Tempo**: For distributed tracing
2. **Grafana Mimir**: For long-term metrics storage and querying
3. **OpenTelemetry Collector**: For collecting and processing telemetry data
4. **Prometheus**: For metrics collection and forwarding to Mimir
5. **Grafana Loki**: For log aggregation
6. **Alertmanager**: For alert management and notification
7. **Blackbox Exporter**: For synthetic monitoring and endpoint probing
8. **Node Exporter**: For infrastructure metrics collection
9. **Grafana**: For visualization of traces, metrics, and logs

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Application│────▶│ OpenTelemetry │────▶│   Tempo     │
│  (Traces)   │     │   Collector   │     │  (Tracing)  │
└─────────────┘     └───────┬─────┬─┘     └─────────────┘
                            │     │
                            ▼     ▼
┌─────────────┐     ┌─────────┐  ┌─────────┐
│ Node Exporter│────▶│ Prometheus│  │  Loki   │
│(Infrastructure)    │ (Metrics) │  │ (Logs)  │
└─────────────┘     └─────┬────┘  └────┬────┘
                          │            │
┌─────────────┐           │            │
│  Blackbox   │           │            │
│  Exporter   │───────────┘            │
│ (Synthetic) │                        │
└─────────────┘           │            │
                          ▼            │
┌─────────────┐     ┌─────────┐        │
│ Alertmanager│◀────│  Mimir   │        │
│  (Alerts)   │     │ (Metrics)│        │
└─────────────┘     └────┬────┘        │
                         │             │
                         ▼             ▼
                    ┌─────────────────────┐
                    │       Grafana       │
                    │   (Visualization)   │
                    └─────────────────────┘
```

## Components

### Grafana Tempo

Tempo is a high-volume, minimal-dependency distributed tracing backend. It collects trace data from the application and
provides a UI for visualizing
and analyzing traces.

- **API**: http://localhost:3200
- **Features**:
  - Distributed tracing
  - Service graphs
  - Span metrics
  - Integration with Loki for logs
  - Integration with Mimir for metrics

### PostgreSQL Exporter

PostgreSQL Exporter collects metrics from PostgreSQL database servers and exports them in Prometheus format.

- **Metrics Endpoint**: http://localhost:9187/metrics
- **Features**:
  - Connection metrics (active, idle, etc.)
  - Query execution metrics (time, count)
  - Transaction metrics (commits, rollbacks)
  - Table and index statistics
  - Database size metrics
  - Lock metrics

### Grafana Mimir

Mimir is a highly scalable, long-term storage for Prometheus metrics. It provides a global view of metrics and supports
multi-tenancy.

- **API**: http://localhost:9009
- **Features**:
  - Long-term metrics storage
  - High availability
  - Multi-tenancy (disabled in this setup for simplicity)
  - Horizontal scalability
  - Compatible with Prometheus API

### OpenTelemetry Collector

The OpenTelemetry Collector receives telemetry data (traces, metrics, logs) from the application and forwards it to the
appropriate backends.

- **Debug Extensions**: pprof (1888), health check (13133), zpages (55679)
- **Metrics Exporter**: Port 8889
- **Exporters**:
  - Tempo (for traces)
  - Mimir (for metrics via Prometheus remote write)
  - Prometheus (for local metrics visualization)

### Prometheus

Prometheus collects metrics from various sources and forwards them to Mimir for long-term storage.

- **UI**: http://localhost:9090
- **Scrape Interval**: 15s
- **Targets**: OpenTelemetry Collector, Node Exporter, Blackbox Exporter, PostgreSQL Exporter
- **Remote Write**: Configured to send metrics to Mimir

### Grafana Loki

Loki is a horizontally-scalable, highly-available, multi-tenant log aggregation system. It's designed to be
cost-effective and easy to operate.

- **API**: http://localhost:3100
- **Features**:
  - Log aggregation
  - Log querying with LogQL
  - Integration with Tempo for trace-to-logs correlation
  - Label-based indexing

### Grafana

Grafana provides visualization for traces, metrics, and logs.

- **UI**: http://localhost:3000
- **Default Credentials**: admin/admin
- **Datasources**:
  - Tempo (for traces)
  - Mimir (for metrics, primary)
  - Prometheus (for metrics, secondary)
  - Loki (for logs)

### Alertmanager

Alertmanager handles alerts sent by client applications such as the Prometheus server. It takes care of deduplicating,
grouping, and routing them to the correct receiver integration.

- **UI**: http://localhost:9093
- **Configuration**: Defined in alertmanager.yml
- **Features**:
  - Grouping of similar alerts
  - Silencing of specific alerts
  - Routing to different receivers (email, Slack, PagerDuty, etc.)
  - Deduplication of alerts

### Blackbox Exporter

Blackbox Exporter allows blackbox probing of endpoints over HTTP, HTTPS, DNS, TCP, ICMP, and gRPC.

- **UI**: http://localhost:9115
- **Configuration**: Defined in blackbox.yml
- **Features**:
  - HTTP probing
  - TCP probing
  - ICMP probing
  - DNS probing
  - SSL certificate validation

### Node Exporter

Node Exporter is a Prometheus exporter for hardware and OS metrics exposed by \*NIX kernels.

- **UI**: http://localhost:9100/metrics
- **Features**:
  - CPU usage metrics
  - Memory usage metrics
  - Disk usage metrics
  - Network metrics
  - System load metrics

## Dashboards

The following dashboards are pre-configured in Grafana:

1. **Distributed Tracing Overview**: Provides an overview of distributed traces across all services
2. **Service Tracing Details**: Provides detailed tracing information for a specific service
3. **Metrics Overview**: Provides an overview of application metrics
4. **Node Exporter Dashboard**: Provides infrastructure metrics from Node Exporter
5. **Blackbox Exporter Dashboard**: Provides synthetic monitoring metrics from Blackbox Exporter
6. **Logs Dashboard**: Provides log visualization and analysis from Loki
7. **PostgreSQL Metrics**: Provides detailed metrics for PostgreSQL database monitoring, including:

- Connection metrics and utilization
- Query execution time statistics
- Transaction rates
- Database size and growth
- DML operation rates (inserts, updates, deletes)
- Buffer activity (cache hits vs. disk reads)
- Lock information

## Usage

### Sending Traces

The application is configured to send traces to the OpenTelemetry Collector using the OTLP protocol. The OpenTelemetry
Collector then forwards the traces to Tempo.

```typescript
// Example configuration in the application
const tracingConfig = {
  serviceName: "my-service",
  endpoint: "http://localhost:4318", // OTLP HTTP endpoint
};
```

### Viewing Traces

1. Open Grafana at http://localhost:3000
2. Navigate to the "Explore" section
3. Select "Tempo" as the datasource
4. Search for traces by service, operation, or trace ID
5. Use the service graph to visualize service dependencies

### Viewing Metrics

1. Open Grafana at http://localhost:3000
2. Navigate to the "Explore" section
3. Select "Mimir" as the datasource for long-term metrics or "Prometheus" for recent metrics
4. Enter a PromQL query to view metrics
5. Or navigate to pre-configured dashboards like "Metrics Overview"

### Viewing Logs

1. Open Grafana at http://localhost:3000
2. Navigate to the "Explore" section
3. Select "Loki" as the datasource
4. Enter a LogQL query to view logs

### Correlating Telemetry Data

One of the key benefits of this observability stack is the ability to correlate traces, metrics, and logs:

1. From a trace in Tempo, you can navigate to related logs in Loki
2. From logs in Loki, you can navigate to related traces in Tempo
3. From metrics in Mimir, you can navigate to related traces in Tempo using exemplars

## Integration with Application

The application uses the `@enterprise/observability` package to send telemetry data to the OpenTelemetry Collector.

```typescript
import { initializeTracing } from '@enterprise/observability';

// Initialize tracing
initializeTracing('my-service');

// Use decorators for automatic tracing
@Trace()
async function myFunction() {
  // Function implementation
}
```

### Database Query Instrumentation

To monitor database queries in your application, you can use the OpenTelemetry instrumentation along with custom
metrics:

```typescript
import {
  createSpan,
  SpanKind,
  addSpanAttributes,
  createHistogram,
} from "@enterprise/observability";

// Create a histogram for database query duration
const dbQueryDuration = createHistogram(
  "db.query.duration",
  "Database query duration in milliseconds",
);

// Instrument a database query
async function executeQuery(query: string, params: any[]) {
  return await createSpan(
    "db.query",
    async () => {
      const startTime = performance.now();
      try {
        // Execute the database query
        const result = await pool.query(query, params);

        // Record metrics
        const duration = performance.now() - startTime;
        dbQueryDuration.record(duration, {
          "db.system": "postgresql",
          "db.operation": query.split(" ")[0].toLowerCase(), // SELECT, INSERT, etc.
          "db.name": "your_database_name",
        });

        return result;
      } catch (error) {
        // Add error information to the current span
        addSpanAttributes({
          error: true,
          "error.message": error.message,
        });
        throw error;
      }
    },
    SpanKind.CLIENT,
    {
      attributes: {
        "db.system": "postgresql",
        "db.statement": query,
        "db.user": "your_database_user",
      },
    },
  );
}
```

You can also create a decorator for database operations:

```typescript
import { Trace, SpanKind, createHistogram } from "@enterprise/observability";

// Create a histogram for database query duration
const dbQueryDuration = createHistogram(
  "db.query.duration",
  "Database query duration in milliseconds",
);

class DatabaseService {
  @Trace("db.query", SpanKind.CLIENT)
  async query(query: string, params: any[]) {
    const startTime = performance.now();
    try {
      // Execute the database query
      const result = await pool.query(query, params);

      // Record metrics
      const duration = performance.now() - startTime;
      dbQueryDuration.record(duration, {
        "db.system": "postgresql",
        "db.operation": query.split(" ")[0].toLowerCase(),
        "db.name": "your_database_name",
      });

      return result;
    } catch (error) {
      // The @Trace decorator will automatically record the error
      throw error;
    }
  }
}
```

## Configuration

### Environment Variables

The following environment variables can be used to configure the observability infrastructure:

```
# OpenTelemetry configuration
OTEL_SERVICE_NAME=my-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_TRACES_SAMPLER=always_on
```

### Docker Compose

The observability infrastructure is defined in the `docker-compose.yaml` file. You can start it with:

```bash
docker-compose up -d
```

## Troubleshooting

### Traces Not Appearing in Tempo

1. Check that the application is sending traces to the OpenTelemetry Collector
2. Check that the OpenTelemetry Collector is forwarding traces to Tempo
3. Check the OpenTelemetry Collector logs for errors: `docker-compose logs otel-collector`
4. Check the Tempo logs for errors: `docker-compose logs tempo`
5. Verify that the Tempo datasource is correctly configured in Grafana

### Metrics Not Appearing in Mimir

1. Check that the OpenTelemetry Collector is exporting metrics to Prometheus
2. Check that Prometheus is scraping metrics from the OpenTelemetry Collector
3. Check that Prometheus is forwarding metrics to Mimir via remote_write
4. Check the Prometheus targets page at http://localhost:9090/targets
5. Check the Mimir logs for errors: `docker-compose logs mimir`
6. Verify that the Mimir datasource is correctly configured in Grafana

### Metrics Not Appearing in Prometheus

1. Check that the OpenTelemetry Collector is exporting metrics to Prometheus
2. Check that Prometheus is scraping metrics from the OpenTelemetry Collector
3. Check the Prometheus targets page at http://localhost:9090/targets
4. Check the Prometheus logs for errors: `docker-compose logs prometheus`

### Logs Not Appearing in Loki

1. Check that the application is sending logs to Loki
2. Check the Loki logs for errors: `docker-compose logs loki`
3. Verify that the Loki datasource is correctly configured in Grafana

### Alerts Not Being Sent

1. Check that Prometheus is configured to use Alertmanager
2. Check that alert rules are properly defined in Prometheus
3. Check the Alertmanager UI at http://localhost:9093
4. Check the Alertmanager logs for errors

### Synthetic Monitoring Not Working

1. Check that Blackbox Exporter is running
2. Check that Prometheus is configured to scrape Blackbox Exporter
3. Check the Blackbox Exporter UI at http://localhost:9115
4. Check the Prometheus targets page for Blackbox Exporter targets

### Infrastructure Metrics Not Appearing

1. Check that Node Exporter is running
2. Check that Prometheus is configured to scrape Node Exporter
3. Check the Node Exporter metrics endpoint at http://localhost:9100/metrics
4. Check the Prometheus targets page for Node Exporter targets

### PostgreSQL Metrics Not Appearing

1. Check that PostgreSQL Exporter is running with `docker-compose ps postgres-exporter`
2. Verify the PostgreSQL Exporter can connect to PostgreSQL by checking its logs:
   `docker-compose logs postgres-exporter`
3. Check that Prometheus is configured to scrape PostgreSQL Exporter
4. Check the PostgreSQL Exporter metrics endpoint at http://localhost:9187/metrics
5. Check the Prometheus targets page for PostgreSQL Exporter targets
6. Verify that the pg_stat_statements extension is enabled in PostgreSQL for query metrics
7. Check that the custom queries in queries.yaml are valid for your PostgreSQL version
