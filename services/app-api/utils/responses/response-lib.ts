export class HttpResponse {
  readonly statusCode: number;
  readonly body: string | undefined;
  readonly headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  };
  constructor(statusCode: number, body?: Object | undefined) {
    this.statusCode = statusCode;
    if (body !== undefined) {
      this.body = JSON.stringify(body);
    }
  }
}

/**
 * The response for a successful request.
 * Should include a body for GET, PUT, or POST - which is all our requests.
 */
export const ok = (body: Object) => new HttpResponse(200, body);

/**
 * The response for a successful POST or PUT request,
 * which resulted in the creation of a new resource.
 */
export const created = (body: Object) => new HttpResponse(201, body);

/**
 * The response for a failed request, due to client-side issues.
 * Typically indicates a missing parameter or malformed body.
 */
export const badRequest = (body?: Object) => new HttpResponse(400, body);

/**
 * The response for a client without any authorization.
 * Typically indicates an issue with the request's headers or token.
 */
export const unauthorized = (body?: Object) => new HttpResponse(401, body);

/**
 * The response for a client without sufficient permissions.
 * This is specific to the requested operation.
 * For example, a regular user requesting an admin-only endpoint.
 */
export const forbidden = (body?: Object) => new HttpResponse(403, body);

/**
 * The response for a request that assumes the existence of a missing resource.
 * For example, attempting to submit a report that isn't in the database.
 */
export const notFound = (body?: Object) => new HttpResponse(404, body);

/**
 * The response for a request that assumes the server is in a different state.
 * For example, attempting to submit a report that's already submitted.
 */
export const conflict = (body?: Object) => new HttpResponse(409, body);

/**
 * The response for a request that errored out on the server side.
 * Typically indicates there is nothing the client can do to resolve the issue.
 */
export const internalServerError = (body?: Object) =>
  new HttpResponse(500, body);
