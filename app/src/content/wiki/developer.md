## API access

The public API is available under `/api/v1/`. Interactive API documentation is available at `/api/v1/docs/` in a configured deployment.

## Authentication

Obtain an access token through the authentication endpoints and send it with requests using the Authorization header.

```
Authorization: Bearer <access-token>
X-Tenant-ID: <workspace-id>
```

## Integrations and webhooks

Integrations operate through the approved workspace configuration. Validate tenant context, store credentials outside source control, and test delivery handling before enabling production workflows.

## Error handling

Handle 400-level responses as request, authentication, authorization, or validation failures. Handle 500-level responses as service failures, retain the request context, and contact support with the relevant timestamp and workspace information.