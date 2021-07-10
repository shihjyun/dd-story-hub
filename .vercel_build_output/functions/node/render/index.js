var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// .svelte-kit/vercel/entry.js
__export(exports, {
  default: () => entry_default
});

// node_modules/@sveltejs/kit/dist/install-fetch.js
var import_http = __toModule(require("http"));
var import_https = __toModule(require("https"));
var import_zlib = __toModule(require("zlib"));
var import_stream = __toModule(require("stream"));
var import_util = __toModule(require("util"));
var import_crypto = __toModule(require("crypto"));
var import_url = __toModule(require("url"));
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var src = dataUriToBuffer;
var { Readable } = import_stream.default;
var wm = new WeakMap();
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
var Blob = class {
  constructor(blobParts = [], options2 = {}) {
    let size = 0;
    const parts = blobParts.map((element) => {
      let buffer;
      if (element instanceof Buffer) {
        buffer = element;
      } else if (ArrayBuffer.isView(element)) {
        buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
      } else if (element instanceof ArrayBuffer) {
        buffer = Buffer.from(element);
      } else if (element instanceof Blob) {
        buffer = element;
      } else {
        buffer = Buffer.from(typeof element === "string" ? element : String(element));
      }
      size += buffer.length || buffer.size || 0;
      return buffer;
    });
    const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
    wm.set(this, {
      type: /[^\u0020-\u007E]/.test(type) ? "" : type,
      size,
      parts
    });
  }
  get size() {
    return wm.get(this).size;
  }
  get type() {
    return wm.get(this).type;
  }
  async text() {
    return Buffer.from(await this.arrayBuffer()).toString();
  }
  async arrayBuffer() {
    const data = new Uint8Array(this.size);
    let offset = 0;
    for await (const chunk of this.stream()) {
      data.set(chunk, offset);
      offset += chunk.length;
    }
    return data.buffer;
  }
  stream() {
    return Readable.from(read(wm.get(this).parts));
  }
  slice(start = 0, end = this.size, type = "") {
    const { size } = this;
    let relativeStart = start < 0 ? Math.max(size + start, 0) : Math.min(start, size);
    let relativeEnd = end < 0 ? Math.max(size + end, 0) : Math.min(end, size);
    const span = Math.max(relativeEnd - relativeStart, 0);
    const parts = wm.get(this).parts.values();
    const blobParts = [];
    let added = 0;
    for (const part of parts) {
      const size2 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
      if (relativeStart && size2 <= relativeStart) {
        relativeStart -= size2;
        relativeEnd -= size2;
      } else {
        const chunk = part.slice(relativeStart, Math.min(size2, relativeEnd));
        blobParts.push(chunk);
        added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
        relativeStart = 0;
        if (added >= span) {
          break;
        }
      }
    }
    const blob = new Blob([], { type: String(type).toLowerCase() });
    Object.assign(wm.get(blob), { size: span, parts: blobParts });
    return blob;
  }
  get [Symbol.toStringTag]() {
    return "Blob";
  }
  static [Symbol.hasInstance](object) {
    return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
  }
};
Object.defineProperties(Blob.prototype, {
  size: { enumerable: true },
  type: { enumerable: true },
  slice: { enumerable: true }
});
var fetchBlob = Blob;
var FetchBaseError = class extends Error {
  constructor(message, type) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};
var FetchError = class extends FetchBaseError {
  constructor(message, type, systemError) {
    super(message, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
var isAbortSignal = (object) => {
  return typeof object === "object" && object[NAME] === "AbortSignal";
};
var carriage = "\r\n";
var dashes = "-".repeat(2);
var carriageLength = Buffer.byteLength(carriage);
var getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
var getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
var INTERNALS$2 = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = Buffer.from(body.toString());
    } else if (isBlob(body))
      ;
    else if (Buffer.isBuffer(body))
      ;
    else if (import_util.types.isAnyArrayBuffer(body)) {
      body = Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_stream.default)
      ;
    else if (isFormData(body)) {
      boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
      body = import_stream.default.Readable.from(formDataIterator(body, boundary));
    } else {
      body = Buffer.from(String(body));
    }
    this[INTERNALS$2] = {
      body,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size;
    if (body instanceof import_stream.default) {
      body.on("error", (err) => {
        const error2 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
        this[INTERNALS$2].error = error2;
      });
    }
  }
  get body() {
    return this[INTERNALS$2].body;
  }
  get bodyUsed() {
    return this[INTERNALS$2].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
    const buf = await this.buffer();
    return new fetchBlob([buf], {
      type: ct
    });
  }
  async json() {
    const buffer = await consumeBody(this);
    return JSON.parse(buffer.toString());
  }
  async text() {
    const buffer = await consumeBody(this);
    return buffer.toString();
  }
  buffer() {
    return consumeBody(this);
  }
};
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true }
});
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error2) {
    if (error2 instanceof FetchBaseError) {
      throw error2;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error2.message}`, "system", error2);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error2) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error2.message}`, "system", error2);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance;
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_stream.PassThrough({ highWaterMark });
    p2 = new import_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS$2].body = p1;
    body = p2;
  }
  return body;
};
var extractContentType = (body, request) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${body.getBoundary()}`;
  }
  if (isFormData(body)) {
    return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
  }
  if (body instanceof import_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request) => {
  const { body } = request;
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  if (isFormData(body)) {
    return getFormDataLength(request[INTERNALS$2].boundary);
  }
  return null;
};
var writeToStream = (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else if (isBlob(body)) {
    body.stream().pipe(dest);
  } else if (Buffer.isBuffer(body)) {
    dest.write(body);
    dest.end();
  } else {
    body.pipe(dest);
  }
};
var validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
    const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw err;
  }
};
var validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
    const err = new TypeError(`Invalid character in header content ["${name}"]`);
    Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
    throw err;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init2) {
    let result = [];
    if (init2 instanceof Headers) {
      const raw = init2.raw();
      for (const [name, values] of Object.entries(raw)) {
        result.push(...values.map((value) => [name, value]));
      }
    } else if (init2 == null)
      ;
    else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
      const method = init2[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init2));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init2].map((pair) => {
          if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name, value]) => {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return [String(name).toLowerCase(), String(value)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name, value) => {
              validateHeaderName(name);
              validateHeaderValue(name, String(value));
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name) => {
              validateHeaderName(name);
              return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name) {
    const values = this.getAll(name);
    if (values.length === 0) {
      return null;
    }
    let value = values.join(", ");
    if (/^content-encoding$/i.test(name)) {
      value = value.toLowerCase();
    }
    return value;
  }
  forEach(callback) {
    for (const name of this.keys()) {
      callback(this.get(name), name);
    }
  }
  *values() {
    for (const name of this.keys()) {
      yield this.get(name);
    }
  }
  *entries() {
    for (const name of this.keys()) {
      yield [name, this.get(name)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
var redirectStatus = new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};
var INTERNALS$1 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options2 = {}) {
    super(body, options2);
    const status = options2.status || 200;
    const headers = new Headers(options2.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS$1] = {
      url: options2.url,
      status,
      statusText: options2.statusText || "",
      headers,
      counter: options2.counter,
      highWaterMark: options2.highWaterMark
    };
  }
  get url() {
    return this[INTERNALS$1].url || "";
  }
  get status() {
    return this[INTERNALS$1].status;
  }
  get ok() {
    return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
  }
  get redirected() {
    return this[INTERNALS$1].counter > 0;
  }
  get statusText() {
    return this[INTERNALS$1].statusText;
  }
  get headers() {
    return this[INTERNALS$1].headers;
  }
  get highWaterMark() {
    return this[INTERNALS$1].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
};
var INTERNALS = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS] === "object";
};
var Request = class extends Body {
  constructor(input, init2 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    let method = init2.method || input.method || "GET";
    method = method.toUpperCase();
    if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init2.size || input.size || 0
    });
    const headers = new Headers(init2.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init2) {
      signal = init2.signal;
    }
    if (signal !== null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal");
    }
    this[INTERNALS] = {
      method,
      redirect: init2.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal
    };
    this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
    this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
    this.counter = init2.counter || input.counter || 0;
    this.agent = init2.agent || input.agent;
    this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
  }
  get method() {
    return this[INTERNALS].method;
  }
  get url() {
    return (0, import_url.format)(this[INTERNALS].parsedURL);
  }
  get headers() {
    return this[INTERNALS].headers;
  }
  get redirect() {
    return this[INTERNALS].redirect;
  }
  get signal() {
    return this[INTERNALS].signal;
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true }
});
var getNodeRequestOptions = (request) => {
  const { parsedURL } = request[INTERNALS];
  const headers = new Headers(request[INTERNALS].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request.body === null && /^(post|put)$/i.test(request.method)) {
    contentLengthValue = "0";
  }
  if (request.body !== null) {
    const totalBytes = getTotalBytes(request);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip,deflate,br");
  }
  let { agent } = request;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const requestOptions = {
    path: parsedURL.pathname + search,
    pathname: parsedURL.pathname,
    hostname: parsedURL.hostname,
    protocol: parsedURL.protocol,
    port: parsedURL.port,
    hash: parsedURL.hash,
    search: parsedURL.search,
    query: parsedURL.query,
    href: parsedURL.href,
    method: request.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request.insecureHTTPParser,
    agent
  };
  return requestOptions;
};
var AbortError = class extends FetchBaseError {
  constructor(message, type = "aborted") {
    super(message, type);
  }
};
var supportedSchemas = new Set(["data:", "http:", "https:"]);
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = src(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error2 = new AbortError("The operation was aborted.");
      reject(error2);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error2);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error2);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error2) {
                reject(error2);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
        reject(error2);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error2) => {
          reject(error2);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error2) => {
              reject(error2);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error2) => {
              reject(error2);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error2) => {
          reject(error2);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
globalThis.fetch = fetch;
globalThis.Response = Response;
globalThis.Request = Request;
globalThis.Headers = Headers;

// node_modules/@sveltejs/kit/dist/node.js
function getRawBody(req) {
  return new Promise((fulfil, reject) => {
    const h = req.headers;
    if (!h["content-type"]) {
      return fulfil(null);
    }
    req.on("error", reject);
    const length = Number(h["content-length"]);
    if (isNaN(length) && h["transfer-encoding"] == null) {
      return fulfil(null);
    }
    let data = new Uint8Array(length || 0);
    if (length > 0) {
      let offset = 0;
      req.on("data", (chunk) => {
        const new_len = offset + Buffer.byteLength(chunk);
        if (new_len > length) {
          return reject({
            status: 413,
            reason: 'Exceeded "Content-Length" limit'
          });
        }
        data.set(chunk, offset);
        offset = new_len;
      });
    } else {
      req.on("data", (chunk) => {
        const new_data = new Uint8Array(data.length + chunk.length);
        new_data.set(data, 0);
        new_data.set(chunk, data.length);
        data = new_data;
      });
    }
    req.on("end", () => {
      const [type] = h["content-type"].split(/;\s*/);
      if (type === "application/octet-stream") {
        return fulfil(data);
      }
      const encoding = h["content-encoding"] || "utf-8";
      fulfil(new TextDecoder(encoding).decode(data));
    });
  });
}

// node_modules/@sveltejs/kit/dist/ssr.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error2,
  branch,
  page
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error2) {
    error2.stack = options2.get_stack(error2);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error3) => {
      throw new Error(`Failed to serialize session data: ${error3.message}`);
    })},
				host: ${page && page.host ? s$1(page.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error2)},
					nodes: [
						${branch.map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page.host ? s$1(page.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page.path)},
						query: new URLSearchParams(${s$1(page.query.toString())}),
						params: ${s$1(page.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    return body2 ? `<script type="svelte-data" url="${url}" body="${hash(body2)}">${json}<\/script>` : `<script type="svelte-data" url="${url}">${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error2) {
  if (!error2)
    return null;
  let serialized = try_serialize(error2);
  if (!serialized) {
    const { name, message, stack } = error2;
    serialized = try_serialize({ name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  if (loaded.error) {
    const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    const status = loaded.status;
    if (!(error2 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error2 };
    }
    return { status, error: error2 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
function resolve(base, path) {
  const baseparts = path[0] === "/" ? [] : base.slice(1).split("/");
  const pathparts = path[0] === "/" ? path.slice(1).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  return `/${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error2
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        if (options2.read && url.startsWith(options2.paths.assets)) {
          url = url.replace(options2.paths.assets, "");
        }
        if (url.startsWith("//")) {
          throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
        }
        let response;
        if (/^[a-zA-Z]+:/.test(url)) {
          response = await (void 0)(url, opts);
        } else {
          const [path, search] = url.split("?");
          const resolved = resolve(request.path, path);
          const filename = resolved.slice(1);
          const filename_html = `${filename}/index.html`;
          const asset = options2.manifest.assets.find((d2) => d2.file === filename || d2.file === filename_html);
          if (asset) {
            if (options2.read) {
              response = new (void 0)(options2.read(asset.file), {
                headers: {
                  "content-type": asset.type
                }
              });
            } else {
              response = await (void 0)(`http://${page.host}/${asset.file}`, opts);
            }
          }
          if (!response) {
            const headers = { ...opts.headers };
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              headers.cookie = request.headers.cookie;
              if (!headers.authorization) {
                headers.authorization = request.headers.authorization;
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond({
              host: request.host,
              method: opts.method || "GET",
              headers,
              path: resolved,
              rawBody: opts.body,
              query: new URLSearchParams(search)
            }, options2, {
              fetched: url,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(resolved, rendered);
              }
              response = new (void 0)(rendered.body, {
                status: rendered.status,
                headers: rendered.headers
              });
            }
          }
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new (void 0)("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error2;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error2 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page,
      node: default_error,
      $session,
      context: loaded.context,
      is_leaf: false,
      is_error: true,
      status,
      error: error2
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error2,
      branch,
      page
    });
  } catch (error3) {
    options2.handle_error(error3);
    return {
      status: 500,
      headers: {},
      body: error3.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id && options2.load_component(id)));
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? leaf.ssr : options2.ssr,
    router: "router" in leaf ? leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: null
    };
  }
  let branch;
  let status = 200;
  let error2;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error2 } = loaded.loaded);
            }
          } catch (e) {
            options2.handle_error(e);
            status = 500;
            error2 = e;
          }
          if (error2) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let error_loaded;
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error2
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (e) {
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error2
            });
          }
        }
        branch.push(loaded);
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error2,
      branch: branch && branch.filter(Boolean),
      page
    });
  } catch (error3) {
    options2.handle_error(error3);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error3
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  if (route) {
    const response = await respond$1({
      request,
      options: options2,
      state,
      $session,
      route
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return {
        status: 500,
        headers: {},
        body: `Bad request in load function: failed to fetch ${state.fetched}`
      };
    }
  } else {
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 404,
      error: new Error(`Not found: ${request.path}`)
    });
  }
}
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
async function render_route(request, route) {
  const mod = await route.load();
  const handler = mod[request.method.toLowerCase().replace("delete", "del")];
  if (handler) {
    const match = route.pattern.exec(request.path);
    const params = route.params(match);
    const response = await handler({ ...request, params });
    if (response) {
      if (typeof response !== "object") {
        return error(`Invalid response from route ${request.path}: expected an object, got ${typeof response}`);
      }
      let { status = 200, body, headers = {} } = response;
      headers = lowercase_keys(headers);
      const type = headers["content-type"];
      if (type === "application/octet-stream" && !(body instanceof Uint8Array)) {
        return error(`Invalid response from route ${request.path}: body must be an instance of Uint8Array if content type is application/octet-stream`);
      }
      if (body instanceof Uint8Array && type !== "application/octet-stream") {
        return error(`Invalid response from route ${request.path}: Uint8Array body must be accompanied by content-type: application/octet-stream header`);
      }
      let normalized_body;
      if (typeof body === "object" && (!type || type === "application/json")) {
        headers = { ...headers, "content-type": "application/json" };
        normalized_body = JSON.stringify(body);
      } else {
        normalized_body = body;
      }
      return { status, body: normalized_body, headers };
    }
  }
}
function read_only_form_data() {
  const map = new Map();
  return {
    append(key, value) {
      if (map.has(key)) {
        map.get(key).push(value);
      } else {
        map.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map) {
    this.#map = map;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield key;
      }
    }
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value;
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw)
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  if (typeof raw === "string") {
    switch (type) {
      case "text/plain":
        return raw;
      case "application/json":
        return JSON.parse(raw);
      case "application/x-www-form-urlencoded":
        return get_urlencoded(raw);
      case "multipart/form-data": {
        const boundary = directives.find((directive) => directive.startsWith("boundary="));
        if (!boundary)
          throw new Error("Missing boundary");
        return get_multipart(raw, boundary.slice("boundary=".length));
      }
      default:
        throw new Error(`Invalid Content-Type ${type}`);
    }
  }
  return raw;
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  const nope = () => {
    throw new Error("Malformed form data");
  };
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    nope();
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          nope();
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      nope();
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !incoming.path.split("/").pop().includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: null,
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            error: null,
            branch: [],
            page: null
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_route(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body)}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: null
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        return await render_page(request, null, options2, state);
      }
    });
  } catch (e) {
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// node_modules/svelte/internal/index.mjs
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
var tasks = new Set();
var active_docs = new Set();
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function afterUpdate(fn) {
  get_current_component().$$.after_update.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
var resolved_promise = Promise.resolve();
var seen_callbacks = new Set();
var outroing = new Set();
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
var boolean_attributes = new Set([
  "allowfullscreen",
  "allowpaymentrequest",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected"
]);
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
      const { on_mount } = this.$$;
      this.$$.on_disconnect = on_mount.map(run).filter(is_function);
      for (const key in this.$$.slotted) {
        this.appendChild(this.$$.slotted[key]);
      }
    }
    attributeChangedCallback(attr, _oldValue, newValue) {
      this[attr] = newValue;
    }
    disconnectedCallback() {
      run_all(this.$$.on_disconnect);
    }
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop2;
    }
    $on(type, callback) {
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index2 = callbacks.indexOf(callback);
        if (index2 !== -1)
          callbacks.splice(index2, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  };
}

// .svelte-kit/output/server/app.js
var css$8 = {
  code: "#svelte-announcer.svelte-9z6sc{position:absolute;left:0;top:0;clip:rect(0 0 0 0);-webkit-clip-path:inset(50%);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\texport let props_3 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}>\\n\\t\\t\\t\\t\\t{#if components[3]}\\n\\t\\t\\t\\t\\t\\t<svelte:component this={components[3]} {...(props_3 || {})}/>\\n\\t\\t\\t\\t\\t{/if}\\n\\t\\t\\t\\t</svelte:component>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\t-webkit-clip-path: inset(50%);\\n\\t\\t        clip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}</style>"],"names":[],"mappings":"AA2DC,iBAAiB,aAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,iBAAiB,CAAE,MAAM,GAAG,CAAC,CACrB,SAAS,CAAE,MAAM,GAAG,CAAC,CAC7B,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  let { props_3 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  let mounted = false;
  let navigated = false;
  let title = null;
  onMount(() => {
    const unsubscribe = stores.page.subscribe(() => {
      if (mounted) {
        navigated = true;
        title = document.title || "untitled page";
      }
    });
    mounted = true;
    return unsubscribe;
  });
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page !== void 0)
    $$bindings.page(page);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  if ($$props.props_3 === void 0 && $$bindings.props_3 && props_3 !== void 0)
    $$bindings.props_3(props_3);
  $$result.css.add(css$8);
  {
    stores.page.set(page);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {
        default: () => `${components[3] ? `${validate_component(components[3] || missing_component, "svelte:component").$$render($$result, Object.assign(props_3 || {}), {}, {})}` : ``}`
      })}` : ``}`
    })}` : ``}`
  })}

${mounted ? `<div id="${"svelte-announcer"}" aria-live="${"assertive"}" aria-atomic="${"true"}" class="${"svelte-9z6sc"}">${navigated ? `${escape2(title)}` : ``}</div>` : ``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module"
});
var template = ({ head, body }) => `<!DOCTYPE html>
<html lang="zh-Hant-TW">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="/assets/index/DDSH-avatar.png" />
		<link rel="stylesheet" href="/root.css">
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta property="og:type" content="website" />
		<meta property="og:locale" content="zh_TW" />
		<meta name="theme-color" content="#6C5381" />	
		<style>
			@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
		</style>
		` + head + '\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
var options = null;
function init(settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-ed11fcb2.js",
      css: ["/./_app/assets/start-9aa571ba.css"],
      js: ["/./_app/start-ed11fcb2.js", "/./_app/chunks/vendor-c85331cf.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error2) => String(error2),
    handle_error: (error2) => {
      console.error(error2.stack);
      error2.stack = options.get_stack(error2);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var d = decodeURIComponent;
var empty = () => ({});
var manifest = {
  assets: [{ "file": "assets/article/202104061800/1.png", "size": 76139, "type": "image/png" }, { "file": "assets/article/202104061800/2.png", "size": 142064, "type": "image/png" }, { "file": "assets/article/202104061800/3.png", "size": 172937, "type": "image/png" }, { "file": "assets/article/202106061700/1.png", "size": 302263, "type": "image/png" }, { "file": "assets/article/202106061700/2.png", "size": 95979, "type": "image/png" }, { "file": "assets/article/202106061700/3-left.png", "size": 95979, "type": "image/png" }, { "file": "assets/article/202106061700/3-right.png", "size": 97699, "type": "image/png" }, { "file": "assets/article/202106200530/1.jpg", "size": 301705, "type": "image/jpeg" }, { "file": "assets/article/202106200530/2.jpg", "size": 160548, "type": "image/jpeg" }, { "file": "assets/article/202106200530/3.png", "size": 649738, "type": "image/png" }, { "file": "assets/article/202106200530/4-left.png", "size": 372670, "type": "image/png" }, { "file": "assets/article/202106200530/4-right.png", "size": 191287, "type": "image/png" }, { "file": "assets/article/202106200530/5-left.jpg", "size": 126847, "type": "image/jpeg" }, { "file": "assets/article/202106200530/5-right.jpg", "size": 146161, "type": "image/jpeg" }, { "file": "assets/author/authors.json", "size": 423, "type": "application/json" }, { "file": "assets/author/authors.yml", "size": 399, "type": "text/yaml" }, { "file": "assets/index/DD-avatar-text-en.svg", "size": 5890, "type": "image/svg+xml" }, { "file": "assets/index/DDSH-avatar.png", "size": 11518, "type": "image/png" }, { "file": "robots.txt", "size": 67, "type": "text/plain" }, { "file": "root.css", "size": 3812, "type": "text/css" }],
  layout: "src/routes/__layout.svelte",
  error: "src/routes/__error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/category\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/category/[slug].svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/article\.json$/,
      params: empty,
      load: () => Promise.resolve().then(function() {
        return index_json;
      })
    },
    {
      type: "page",
      pattern: /^\/article\/202104061800\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/article/__layout.svelte", "src/routes/article/202104061800.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/article\/202106061700\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/article/__layout.svelte", "src/routes/article/202106061700.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/article\/202106200530\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/article/__layout.svelte", "src/routes/article/202106200530.md"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "endpoint",
      pattern: /^\/article\/([^/]+?)\.json$/,
      params: (m) => ({ slug: d(m[1]) }),
      load: () => Promise.resolve().then(function() {
        return _slug__json;
      })
    },
    {
      type: "page",
      pattern: /^\/author\/([^/]+?)\/?$/,
      params: (m) => ({ slug: d(m[1]) }),
      a: ["src/routes/__layout.svelte", "src/routes/author/[slug].svelte"],
      b: ["src/routes/__error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about.svelte"],
      b: ["src/routes/__error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request))
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout$1;
  }),
  "src/routes/__error.svelte": () => Promise.resolve().then(function() {
    return __error;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/category/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_$1;
  }),
  "src/routes/article/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  "src/routes/article/202104061800.md": () => Promise.resolve().then(function() {
    return _202104061800$1;
  }),
  "src/routes/article/202106061700.md": () => Promise.resolve().then(function() {
    return _202106061700$1;
  }),
  "src/routes/article/202106200530.md": () => Promise.resolve().then(function() {
    return _202106200530$1;
  }),
  "src/routes/author/[slug].svelte": () => Promise.resolve().then(function() {
    return _slug_;
  }),
  "src/routes/about.svelte": () => Promise.resolve().then(function() {
    return about;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-b8b0a547.js", "css": ["/./_app/assets/pages/__layout.svelte-10657413.css"], "js": ["/./_app/pages/__layout.svelte-b8b0a547.js", "/./_app/chunks/vendor-c85331cf.js"], "styles": null }, "src/routes/__error.svelte": { "entry": "/./_app/pages/__error.svelte-9ea234c6.js", "css": ["/./_app/assets/pages/__error.svelte-f14c72db.css"], "js": ["/./_app/pages/__error.svelte-9ea234c6.js", "/./_app/chunks/vendor-c85331cf.js"], "styles": null }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-a4bca916.js", "css": ["/./_app/assets/pages/index.svelte-3304ff1a.css", "/./_app/assets/ArticleList-c14368bf.css"], "js": ["/./_app/pages/index.svelte-a4bca916.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/ArticleList-bd19be12.js"], "styles": null }, "src/routes/category/[slug].svelte": { "entry": "/./_app/pages/category/[slug].svelte-b14c14fe.js", "css": ["/./_app/assets/ArticleList-c14368bf.css"], "js": ["/./_app/pages/category/[slug].svelte-b14c14fe.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/ArticleList-bd19be12.js"], "styles": null }, "src/routes/article/__layout.svelte": { "entry": "/./_app/pages/article/__layout.svelte-5fe9c004.js", "css": ["/./_app/assets/pages/article/__layout.svelte-e2f6324d.css"], "js": ["/./_app/pages/article/__layout.svelte-5fe9c004.js", "/./_app/chunks/vendor-c85331cf.js"], "styles": null }, "src/routes/article/202104061800.md": { "entry": "/./_app/pages/article/202104061800.md-255d509f.js", "css": ["/./_app/assets/Img-b12bb8c2.css"], "js": ["/./_app/pages/article/202104061800.md-255d509f.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/Img-1dd15a9c.js"], "styles": null }, "src/routes/article/202106061700.md": { "entry": "/./_app/pages/article/202106061700.md-47c85d1b.js", "css": ["/./_app/assets/Img-b12bb8c2.css"], "js": ["/./_app/pages/article/202106061700.md-47c85d1b.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/Img-1dd15a9c.js"], "styles": null }, "src/routes/article/202106200530.md": { "entry": "/./_app/pages/article/202106200530.md-edc7fde3.js", "css": ["/./_app/assets/Img-b12bb8c2.css"], "js": ["/./_app/pages/article/202106200530.md-edc7fde3.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/Img-1dd15a9c.js"], "styles": null }, "src/routes/author/[slug].svelte": { "entry": "/./_app/pages/author/[slug].svelte-8b265a78.js", "css": ["/./_app/assets/ArticleList-c14368bf.css"], "js": ["/./_app/pages/author/[slug].svelte-8b265a78.js", "/./_app/chunks/vendor-c85331cf.js", "/./_app/chunks/ArticleList-bd19be12.js"], "styles": null }, "src/routes/about.svelte": { "entry": "/./_app/pages/about.svelte-8eafd4e2.js", "css": ["/./_app/assets/pages/__error.svelte-f14c72db.css"], "js": ["/./_app/pages/about.svelte-8eafd4e2.js", "/./_app/chunks/vendor-c85331cf.js"], "styles": null } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
init({ paths: { "base": "", "assets": "/." } });
function render(request, {
  prerender
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender });
}
var slugFromPath = (path) => {
  var _a, _b;
  return (_b = (_a = path.match(/([\w-]+)\.(svelte\.md|md|svx)/i)) == null ? void 0 : _a[1]) != null ? _b : null;
};
var formatDate = (date) => {
  var d2 = new Date(date), month = "" + (d2.getMonth() + 1), day = "" + d2.getDate(), year = d2.getFullYear();
  if (month.length < 2)
    month = "0" + month;
  if (day.length < 2)
    day = "0" + day;
  return [year, month, day].join("-");
};
var categoryPathName = (category) => {
  switch (category) {
    case "\u8CC7\u6599\u6545\u4E8B":
      return "data-story";
    case "\u7D93\u9A57\u5206\u4EAB":
      return "experience-sharing";
    case "\u6558\u4E8B\u7814\u7A76":
      return "research";
    default:
      return "all";
  }
};
async function get$1({ query }) {
  var _a, _b, _c;
  const modules = { "./202104061800.md": () => Promise.resolve().then(function() {
    return _202104061800$1;
  }), "./202106061700.md": () => Promise.resolve().then(function() {
    return _202106061700$1;
  }), "./202106200530.md": () => Promise.resolve().then(function() {
    return _202106200530$1;
  }) };
  const articlePromises = [];
  const limit = Number((_a = query.get("limit")) != null ? _a : Infinity);
  const category = (_b = query.get("category")) != null ? _b : "all";
  const author = (_c = query.get("author")) != null ? _c : "all";
  if (Number.isNaN(limit)) {
    return {
      status: 404,
      error: new Error()
    };
  }
  for (let [path, resolver] of Object.entries(modules)) {
    const slug = slugFromPath(path);
    const promise = resolver().then((article) => ({
      slug,
      ...article.metadata
    }));
    articlePromises.push(promise);
  }
  const articles = await Promise.all(articlePromises);
  const publishedArticles = articles.sort((a, b) => new Date(a.date) > new Date(b.date) ? -1 : 1).filter((d2) => category === "all" | categoryPathName(d2.category) === category).filter((d2) => author === "all" | d2.author_id === author).slice(0, limit);
  if (typeof publishedArticles !== "undefined" && publishedArticles.length > 0) {
    return {
      body: publishedArticles
    };
  } else {
    return {
      status: 404,
      error: new Error()
    };
  }
}
var index_json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get: get$1
});
async function get({ params }) {
  const modules = { "./202104061800.md": () => Promise.resolve().then(function() {
    return _202104061800$1;
  }), "./202106061700.md": () => Promise.resolve().then(function() {
    return _202106061700$1;
  }), "./202106200530.md": () => Promise.resolve().then(function() {
    return _202106200530$1;
  }) };
  let match;
  for (const [path, resolver] of Object.entries(modules)) {
    if (slugFromPath(path) === params.slug) {
      match = [path, resolver];
      break;
    }
  }
  if (!match) {
    return {
      status: 404
    };
  }
  const article = await match[1]();
  return {
    body: article.metadata
  };
}
var _slug__json = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get
});
var css$7 = {
  code: "footer.svelte-15riftm{display:flex;flex-direction:column;justify-content:center;width:100%;height:15vh;background-color:var(--green-0);margin-top:4rem}p.svelte-15riftm{font-size:var(--text-sm);color:var(--green-6);text-align:center;letter-spacing:0.025em}div.svelte-15riftm{display:flex;align-items:center;justify-content:center;margin-top:1rem}a.svelte-15riftm{margin:0 0.75rem}svg.svelte-15riftm{width:24px;fill:var(--gray-5);transition:fill 0.15s linear}svg.svelte-15riftm:hover{fill:var(--green-6)}@media(min-width: 650px){div.svelte-15riftm{margin-top:1rem}}",
  map: '{"version":3,"file":"Footer.svelte","sources":["Footer.svelte"],"sourcesContent":["<script>\\n<\/script>\\n\\n<style>\\n  footer {\\n    display: flex;\\n    flex-direction: column;\\n    justify-content: center;\\n    width: 100%;\\n    height: 15vh;\\n    background-color: var(--green-0);\\n    margin-top: 4rem;\\n  }\\n\\n  p {\\n    font-size: var(--text-sm);\\n    color: var(--green-6);\\n    text-align: center;\\n    letter-spacing: 0.025em;\\n  }\\n\\n  div {\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    margin-top: 1rem;\\n  }\\n  a {\\n    margin: 0 0.75rem;\\n  }\\n  svg {\\n    width: 24px;\\n    fill: var(--gray-5);\\n    transition: fill 0.15s linear;\\n  }\\n\\n  svg:hover {\\n    fill: var(--green-6);\\n  }\\n\\n  @media (min-width: 650px) {\\n    div {\\n      margin-top: 1rem;\\n    }\\n  }</style>\\n\\n<footer>\\n  <p>\xA92021 \u878D\u6578\u57FA\u5730 DD Story Hub</p>\\n  <div>\\n    <a href=\\"https://medium.com/dd-story-hub\\" target=\\"_blank\\"\\n      ><svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1770 1000\\">\\n        <circle cx=\\"500\\" cy=\\"500\\" r=\\"500\\" />\\n        <ellipse ry=\\"475\\" rx=\\"250\\" cy=\\"501\\" cx=\\"1296\\" />\\n        <ellipse cx=\\"1682\\" cy=\\"502\\" rx=\\"88\\" ry=\\"424\\" />\\n      </svg></a\\n    >\\n  </div>\\n</footer>\\n"],"names":[],"mappings":"AAIE,MAAM,eAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,MAAM,CACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,CACZ,gBAAgB,CAAE,IAAI,SAAS,CAAC,CAChC,UAAU,CAAE,IAAI,AAClB,CAAC,AAED,CAAC,eAAC,CAAC,AACD,SAAS,CAAE,IAAI,SAAS,CAAC,CACzB,KAAK,CAAE,IAAI,SAAS,CAAC,CACrB,UAAU,CAAE,MAAM,CAClB,cAAc,CAAE,OAAO,AACzB,CAAC,AAED,GAAG,eAAC,CAAC,AACH,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,MAAM,CACvB,UAAU,CAAE,IAAI,AAClB,CAAC,AACD,CAAC,eAAC,CAAC,AACD,MAAM,CAAE,CAAC,CAAC,OAAO,AACnB,CAAC,AACD,GAAG,eAAC,CAAC,AACH,KAAK,CAAE,IAAI,CACX,IAAI,CAAE,IAAI,QAAQ,CAAC,CACnB,UAAU,CAAE,IAAI,CAAC,KAAK,CAAC,MAAM,AAC/B,CAAC,AAED,kBAAG,MAAM,AAAC,CAAC,AACT,IAAI,CAAE,IAAI,SAAS,CAAC,AACtB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,GAAG,eAAC,CAAC,AACH,UAAU,CAAE,IAAI,AAClB,CAAC,AACH,CAAC"}'
};
var Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$7);
  return `<footer class="${"svelte-15riftm"}"><p class="${"svelte-15riftm"}">\xA92021 \u878D\u6578\u57FA\u5730 DD Story Hub</p>
  <div class="${"svelte-15riftm"}"><a href="${"https://medium.com/dd-story-hub"}" target="${"_blank"}" class="${"svelte-15riftm"}"><svg xmlns="${"http://www.w3.org/2000/svg"}" viewBox="${"0 0 1770 1000"}" class="${"svelte-15riftm"}"><circle cx="${"500"}" cy="${"500"}" r="${"500"}"></circle><ellipse ry="${"475"}" rx="${"250"}" cy="${"501"}" cx="${"1296"}"></ellipse><ellipse cx="${"1682"}" cy="${"502"}" rx="${"88"}" ry="${"424"}"></ellipse></svg></a></div></footer>`;
});
var css$6 = {
  code: "header.svelte-65emo5{display:flex;align-items:center;flex-direction:column}.logo.svelte-65emo5{width:140px;transform:translateY(3px);transition:transform 0.1s ease-out}.logo.svelte-65emo5:hover{transform:translateY(0px)}ul.svelte-65emo5{display:flex;justify-content:center;margin-bottom:var(--space-6)}li.svelte-65emo5{padding:0 var(--space-1);font-size:var(--font-size-1);letter-spacing:0.1em;color:var(--gray-5);transition:color 0.15s linear;border-left:1px var(--gray-4) solid}li.svelte-65emo5:first-of-type{border-left:none}li.svelte-65emo5:hover{color:var(--green-5)}@media(min-width: 576px){.logo.svelte-65emo5{width:180px}ul.svelte-65emo5{margin-bottom:var(--space-7)}li.svelte-65emo5{padding:0 var(--space-3);font-size:var(--font-size-2);transition:color 0.15s linear;border-left:1px var(--gray-4) solid}}",
  map: '{"version":3,"file":"Header.svelte","sources":["Header.svelte"],"sourcesContent":["<script>\\n  // your script goes here\\n<\/script>\\n\\n<style>\\n  header {\\n    display: flex;\\n    align-items: center;\\n    flex-direction: column;\\n  }\\n\\n  .logo {\\n    width: 140px;\\n    transform: translateY(3px);\\n    transition: transform 0.1s ease-out;\\n  }\\n\\n  .logo:hover {\\n    transform: translateY(0px);\\n  }\\n\\n  ul {\\n    display: flex;\\n    justify-content: center;\\n    margin-bottom: var(--space-6);\\n  }\\n\\n  li {\\n    padding: 0 var(--space-1);\\n    font-size: var(--font-size-1);\\n    letter-spacing: 0.1em;\\n    color: var(--gray-5);\\n    transition: color 0.15s linear;\\n    border-left: 1px var(--gray-4) solid;\\n  }\\n\\n  li:first-of-type {\\n    border-left: none;\\n  }\\n\\n  li:hover {\\n    color: var(--green-5);\\n  }\\n\\n  @media (min-width: 576px) {\\n    .logo {\\n      width: 180px;\\n    }\\n\\n    ul {\\n      margin-bottom: var(--space-7);\\n    }\\n\\n    li {\\n      padding: 0 var(--space-3);\\n      font-size: var(--font-size-2);\\n      transition: color 0.15s linear;\\n      border-left: 1px var(--gray-4) solid;\\n    }\\n  }</style>\\n\\n<header>\\n  <a class=\\"logo\\" href=\\"/\\" sveltekit:prefetch><img src=\\"/assets/index/DD-avatar-text-en.svg\\" alt=\\"DD-logo\\" /></a>\\n  <ul>\\n    <li><a href=\\"/about\\" sveltekit:prefetch>\u95DC\u65BC\u6211\u5011</a></li>\\n    <li><a href=\\"/category/data-story\\" sveltekit:prefetch>\u8CC7\u6599\u6545\u4E8B</a></li>\\n    <li><a href=\\"/category/experience-sharing\\" sveltekit:prefetch>\u7D93\u9A57\u5206\u4EAB</a></li>\\n    <li><a href=\\"/category/research\\" sveltekit:prefetch>\u6558\u4E8B\u7814\u7A76</a></li>\\n  </ul>\\n</header>\\n"],"names":[],"mappings":"AAKE,MAAM,cAAC,CAAC,AACN,OAAO,CAAE,IAAI,CACb,WAAW,CAAE,MAAM,CACnB,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,KAAK,cAAC,CAAC,AACL,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,WAAW,GAAG,CAAC,CAC1B,UAAU,CAAE,SAAS,CAAC,IAAI,CAAC,QAAQ,AACrC,CAAC,AAED,mBAAK,MAAM,AAAC,CAAC,AACX,SAAS,CAAE,WAAW,GAAG,CAAC,AAC5B,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,IAAI,CACb,eAAe,CAAE,MAAM,CACvB,aAAa,CAAE,IAAI,SAAS,CAAC,AAC/B,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,CAAC,CAAC,IAAI,SAAS,CAAC,CACzB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,cAAc,CAAE,KAAK,CACrB,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,UAAU,CAAE,KAAK,CAAC,KAAK,CAAC,MAAM,CAC9B,WAAW,CAAE,GAAG,CAAC,IAAI,QAAQ,CAAC,CAAC,KAAK,AACtC,CAAC,AAED,gBAAE,cAAc,AAAC,CAAC,AAChB,WAAW,CAAE,IAAI,AACnB,CAAC,AAED,gBAAE,MAAM,AAAC,CAAC,AACR,KAAK,CAAE,IAAI,SAAS,CAAC,AACvB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,KAAK,cAAC,CAAC,AACL,KAAK,CAAE,KAAK,AACd,CAAC,AAED,EAAE,cAAC,CAAC,AACF,aAAa,CAAE,IAAI,SAAS,CAAC,AAC/B,CAAC,AAED,EAAE,cAAC,CAAC,AACF,OAAO,CAAE,CAAC,CAAC,IAAI,SAAS,CAAC,CACzB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,UAAU,CAAE,KAAK,CAAC,KAAK,CAAC,MAAM,CAC9B,WAAW,CAAE,GAAG,CAAC,IAAI,QAAQ,CAAC,CAAC,KAAK,AACtC,CAAC,AACH,CAAC"}'
};
var Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<header class="${"svelte-65emo5"}"><a class="${"logo svelte-65emo5"}" href="${"/"}" sveltekit:prefetch><img src="${"/assets/index/DD-avatar-text-en.svg"}" alt="${"DD-logo"}"></a>
  <ul class="${"svelte-65emo5"}"><li class="${"svelte-65emo5"}"><a href="${"/about"}" sveltekit:prefetch>\u95DC\u65BC\u6211\u5011</a></li>
    <li class="${"svelte-65emo5"}"><a href="${"/category/data-story"}" sveltekit:prefetch>\u8CC7\u6599\u6545\u4E8B</a></li>
    <li class="${"svelte-65emo5"}"><a href="${"/category/experience-sharing"}" sveltekit:prefetch>\u7D93\u9A57\u5206\u4EAB</a></li>
    <li class="${"svelte-65emo5"}"><a href="${"/category/research"}" sveltekit:prefetch>\u6558\u4E8B\u7814\u7A76</a></li></ul></header>`;
});
var _layout$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `

${validate_component(Header, "Header").$$render($$result, {}, {}, {})}

<main>${slots.default ? slots.default({}) : ``}</main>

${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}`;
});
var __layout$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout$1
});
var css$5 = {
  code: "p.svelte-1p5z9pc{text-align:center}",
  map: '{"version":3,"file":"__error.svelte","sources":["__error.svelte"],"sourcesContent":["<style>\\n  p {\\n    text-align: center;\\n  }</style>\\n\\n<p>\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E</p>\\n"],"names":[],"mappings":"AACE,CAAC,eAAC,CAAC,AACD,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var _error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$5);
  return `<p class="${"svelte-1p5z9pc"}">\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E\u30FE(;\uFF9F;\u0414;\uFF9F;)\uFF89\uFF9E</p>`;
});
var __error = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _error
});
var css$4 = {
  code: ".read-more-wrap.svelte-jfh993{position:relative;padding-bottom:2.5rem;display:grid;grid-template-columns:repeat(auto-fit, 240px);grid-auto-flow:row;gap:1rem;width:100%;justify-content:center;margin:0 auto;max-width:800px}.img-wrap.svelte-jfh993{overflow:hidden}.article-wrap.svelte-jfh993{padding:1rem 0}.read-more-title.svelte-jfh993{text-align:center;font-size:1.125rem;line-height:1.75rem;padding-top:3rem;color:var(--gray-600);letter-spacing:0.05em}h3.svelte-jfh993{font-weight:400;letter-spacing:0em;text-align:left;font-size:1rem;color:var(--gray-600);padding:0.25rem 1rem 1rem 1rem}h3.svelte-jfh993:hover{color:var(--green-500)}img.svelte-jfh993{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:300ms;transform:translate3d(0 0 0 0 0 1 1);width:100%;height:135px;overflow:hidden}img.svelte-jfh993:hover{transform:scale(1.05)}@media(min-width: 650px){.read-more-title.svelte-jfh993{font-size:1.5rem;line-height:2rem}}",
  map: '{"version":3,"file":"ArticleList.svelte","sources":["ArticleList.svelte"],"sourcesContent":["<script>\\n  export let articleData\\n  export let title = \'\u6211\u5011\'\\n<\/script>\\n\\n<style>\\n  .read-more-wrap {\\n    position: relative;\\n    padding-bottom: 2.5rem;\\n    display: grid;\\n    grid-template-columns: repeat(auto-fit, 240px);\\n    grid-auto-flow: row;\\n    gap: 1rem;\\n    width: 100%;\\n    justify-content: center;\\n    margin: 0 auto;\\n    max-width: 800px;\\n  }\\n\\n  .img-wrap {\\n    overflow: hidden;\\n  }\\n\\n  .article-wrap {\\n    padding: 1rem 0;\\n  }\\n\\n  .read-more-title {\\n    text-align: center;\\n    font-size: 1.125rem;\\n    line-height: 1.75rem;\\n    padding-top: 3rem;\\n    color: var(--gray-600);\\n    letter-spacing: 0.05em;\\n  }\\n\\n  h3 {\\n    font-weight: 400;\\n    letter-spacing: 0em;\\n    text-align: left;\\n    font-size: 1rem;\\n    color: var(--gray-600);\\n    padding: 0.25rem 1rem 1rem 1rem;\\n  }\\n\\n  h3:hover {\\n    color: var(--green-500);\\n  }\\n\\n  img {\\n    transition-property: transform;\\n    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\\n    transition-duration: 300ms;\\n    transform: translate3d(0 0 0 0 0 1 1);\\n    width: 100%;\\n    height: 135px;\\n    overflow: hidden;\\n  }\\n\\n  img:hover {\\n    transform: scale(1.05);\\n  }\\n\\n  @media (min-width: 650px) {\\n    .read-more-title {\\n      font-size: 1.5rem;\\n      line-height: 2rem;\\n    }\\n  }</style>\\n\\n<h2 class=\\"read-more-title\\">{title}\u7684\u6587\u7AE0</h2>\\n\\n<div class=\\"read-more-wrap\\">\\n  {#each articleData.slice(0, 6) as { title, cover_image, slug }}\\n    <div class=\\"article-wrap\\">\\n      <div class=\\"img-wrap\\">\\n        <a href={`/article/${slug}`} sveltekit:prefetch>\\n          <img src={cover_image} alt=\\"\\" />\\n        </a>\\n      </div>\\n      <a href={`/article/${slug}`} sveltekit:prefetch>\\n        <h3>{title}</h3>\\n      </a>\\n    </div>\\n  {/each}\\n</div>\\n"],"names":[],"mappings":"AAME,eAAe,cAAC,CAAC,AACf,QAAQ,CAAE,QAAQ,CAClB,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,CACb,qBAAqB,CAAE,OAAO,QAAQ,CAAC,CAAC,KAAK,CAAC,CAC9C,cAAc,CAAE,GAAG,CACnB,GAAG,CAAE,IAAI,CACT,KAAK,CAAE,IAAI,CACX,eAAe,CAAE,MAAM,CACvB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,KAAK,AAClB,CAAC,AAED,SAAS,cAAC,CAAC,AACT,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,aAAa,cAAC,CAAC,AACb,OAAO,CAAE,IAAI,CAAC,CAAC,AACjB,CAAC,AAED,gBAAgB,cAAC,CAAC,AAChB,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,QAAQ,CACnB,WAAW,CAAE,OAAO,CACpB,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IAAI,UAAU,CAAC,CACtB,cAAc,CAAE,MAAM,AACxB,CAAC,AAED,EAAE,cAAC,CAAC,AACF,WAAW,CAAE,GAAG,CAChB,cAAc,CAAE,GAAG,CACnB,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,IAAI,CACf,KAAK,CAAE,IAAI,UAAU,CAAC,CACtB,OAAO,CAAE,OAAO,CAAC,IAAI,CAAC,IAAI,CAAC,IAAI,AACjC,CAAC,AAED,gBAAE,MAAM,AAAC,CAAC,AACR,KAAK,CAAE,IAAI,WAAW,CAAC,AACzB,CAAC,AAED,GAAG,cAAC,CAAC,AACH,mBAAmB,CAAE,SAAS,CAC9B,0BAA0B,CAAE,aAAa,GAAG,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CAAC,CAAC,CAAC,CAAC,CACxD,mBAAmB,CAAE,KAAK,CAC1B,SAAS,CAAE,YAAY,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACrC,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,KAAK,CACb,QAAQ,CAAE,MAAM,AAClB,CAAC,AAED,iBAAG,MAAM,AAAC,CAAC,AACT,SAAS,CAAE,MAAM,IAAI,CAAC,AACxB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,gBAAgB,cAAC,CAAC,AAChB,SAAS,CAAE,MAAM,CACjB,WAAW,CAAE,IAAI,AACnB,CAAC,AACH,CAAC"}'
};
var ArticleList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { articleData } = $$props;
  let { title = "\u6211\u5011" } = $$props;
  if ($$props.articleData === void 0 && $$bindings.articleData && articleData !== void 0)
    $$bindings.articleData(articleData);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$4);
  return `<h2 class="${"read-more-title svelte-jfh993"}">${escape2(title)}\u7684\u6587\u7AE0</h2>

<div class="${"read-more-wrap svelte-jfh993"}">${each(articleData.slice(0, 6), ({ title: title2, cover_image, slug }) => `<div class="${"article-wrap svelte-jfh993"}"><div class="${"img-wrap svelte-jfh993"}"><a${add_attribute("href", `/article/${slug}`, 0)} sveltekit:prefetch><img${add_attribute("src", cover_image, 0)} alt="${""}" class="${"svelte-jfh993"}">
        </a></div>
      <a${add_attribute("href", `/article/${slug}`, 0)} sveltekit:prefetch><h3 class="${"svelte-jfh993"}">${escape2(title2)}</h3></a>
    </div>`)}</div>`;
});
var css$3 = {
  code: ".intro.svelte-3mfbre{font-size:var(--font-size-2);color:var(--gray-6);max-width:520px;margin:0 auto;letter-spacing:var(--letter-spacing);line-height:1.75;padding:0 var(--space-2) 0 var(--space-2)}@media(min-width: 576px){.intro.svelte-3mfbre{line-height:var(--line-height-5)}}",
  map: `{"version":3,"file":"index.svelte","sources":["index.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  export async function load({ fetch }) {\\n    const res = await fetch('/article.json?limit=3')\\n    const data = await res.json()\\n    return { props: { data } }\\n  }\\n<\/script>\\n\\n<script>\\n  import ArticleList from '$lib/shared/ArticleList.svelte'\\n  export let data\\n<\/script>\\n\\n<style>\\n  .intro {\\n    font-size: var(--font-size-2);\\n    color: var(--gray-6);\\n    max-width: 520px;\\n    margin: 0 auto;\\n    letter-spacing: var(--letter-spacing);\\n    line-height: 1.75;\\n    padding: 0 var(--space-2) 0 var(--space-2);\\n  }\\n\\n  @media (min-width: 576px) {\\n    .intro {\\n      line-height: var(--line-height-5);\\n    }\\n  }</style>\\n\\n<svelte:head>\\n  <title>DD Story Hub</title>\\n  <!-- <meta property=\\"og:url\\" content=\\"https://www.dd-story-hub.com\\" />\\n  <link rel=\\"canonical\\" href=\\"https://www.dd-story-hub.com\\" /> -->\\n  <!-- <meta name=\\"description\\" content=\\"\\" /> -->\\n</svelte:head>\\n\\n<p class=\\"intro\\">\\n  \u6211\u5011\u662F\u56E0\u70BA\u559C\u6B61\u7814\u7A76\u6578\u4F4D\u6558\u4E8B\u53CA\u8CC7\u6599\u65B0\u805E\uFF0C\u800C\u805A\u96C6\u5728\u4E00\u8D77\u7684\u5925\u4F34\uFF0C\u671F\u5F85\u80FD\u5920\u900F\u904E\u4E0D\u540C\u7684\u6558\u4E8B\u65B9\u5F0F\uFF0C\u653E\u5927\u6545\u4E8B\u5F71\u97FF\u529B\u3002\\n  \u300C\u878D\u6578\u300D\u7D50\u5408\u6578\u4F4D\uFF08Digital\uFF09\u3001\u6578\u64DA\uFF08Data\uFF09\u7684\u6982\u5FF5\uFF0C\u6211\u5011\u5E0C\u671B\u9019\u500B\u8A08\u756B\u80FD\u5920\u4F5C\u70BA\u540C\u597D\u7684\u805A\u96C6\u5730\uFF0C\u9664\u4E86\u7D00\u9304\u7814\u7A76\u8207\u5B78\u7FD2\u7684\u904E\u7A0B\uFF0C\u4E5F\u5C07\u6301\u7E8C\u5206\u4EAB\u5275\u65B0\u60F3\u6CD5\u3002\\n</p>\\n\\n<ArticleList articleData={data} />\\n"],"names":[],"mappings":"AAcE,MAAM,cAAC,CAAC,AACN,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,SAAS,CAAE,KAAK,CAChB,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,cAAc,CAAE,IAAI,gBAAgB,CAAC,CACrC,WAAW,CAAE,IAAI,CACjB,OAAO,CAAE,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,SAAS,CAAC,AAC5C,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,cAAC,CAAC,AACN,WAAW,CAAE,IAAI,eAAe,CAAC,AACnC,CAAC,AACH,CAAC"}`
};
async function load$3({ fetch: fetch3 }) {
  const res = await fetch3("/article.json?limit=3");
  const data = await res.json();
  return { props: { data } };
}
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css$3);
  return `${$$result.head += `${$$result.title = `<title>DD Story Hub</title>`, ""}`, ""}

<p class="${"intro svelte-3mfbre"}">\u6211\u5011\u662F\u56E0\u70BA\u559C\u6B61\u7814\u7A76\u6578\u4F4D\u6558\u4E8B\u53CA\u8CC7\u6599\u65B0\u805E\uFF0C\u800C\u805A\u96C6\u5728\u4E00\u8D77\u7684\u5925\u4F34\uFF0C\u671F\u5F85\u80FD\u5920\u900F\u904E\u4E0D\u540C\u7684\u6558\u4E8B\u65B9\u5F0F\uFF0C\u653E\u5927\u6545\u4E8B\u5F71\u97FF\u529B\u3002
  \u300C\u878D\u6578\u300D\u7D50\u5408\u6578\u4F4D\uFF08Digital\uFF09\u3001\u6578\u64DA\uFF08Data\uFF09\u7684\u6982\u5FF5\uFF0C\u6211\u5011\u5E0C\u671B\u9019\u500B\u8A08\u756B\u80FD\u5920\u4F5C\u70BA\u540C\u597D\u7684\u805A\u96C6\u5730\uFF0C\u9664\u4E86\u7D00\u9304\u7814\u7A76\u8207\u5B78\u7FD2\u7684\u904E\u7A0B\uFF0C\u4E5F\u5C07\u6301\u7E8C\u5206\u4EAB\u5275\u65B0\u60F3\u6CD5\u3002
</p>

${validate_component(ArticleList, "ArticleList").$$render($$result, { articleData: data }, {}, {})}`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  load: load$3
});
async function load$2({ page, fetch: fetch3 }) {
  const res = await fetch3(`/article.json?category=${page.params.slug}`);
  if (res.ok) {
    return { props: { data: await res.json() } };
  }
  return { status: res.status, error: new Error() };
}
var U5Bslugu5D$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(ArticleList, "ArticleList").$$render($$result, { articleData: data }, {}, {})}`;
});
var _slug_$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D$1,
  load: load$2
});
var css$2 = {
  code: ".article-meta.svelte-1x6qdjg.svelte-1x6qdjg.svelte-1x6qdjg{width:100%;margin:0 auto var(--space-6) auto;max-width:576px;padding:0 var(--space-2)}.article-meta.svelte-1x6qdjg h1{display:block;font-size:var(--font-size-4);padding:var(--space-2) 0;font-weight:500;letter-spacing:var(--letter-spacing-wide);color:var(--gray-7)}.article-meta.svelte-1x6qdjg>div.svelte-1x6qdjg.svelte-1x6qdjg{display:flex}.article-meta.svelte-1x6qdjg>div.svelte-1x6qdjg>div.svelte-1x6qdjg{padding-right:var(--space-5);color:var(--gray-5);letter-spacing:var(--letter-spacing-wide);font-size:var(--font-size-1)}article.svelte-1x6qdjg.svelte-1x6qdjg.svelte-1x6qdjg{width:100%;margin:0 auto;max-width:576px;padding:0 var(--space-2)}article.svelte-1x6qdjg h2{display:block;font-size:var(--font-size-4);padding:var(--space-5) 0 var(--space-2) 0}article.svelte-1x6qdjg>p{font-size:var(--font-size-2);color:var(--gray-6);line-height:var(--line-height-4);letter-spacing:var(--letter-spacing-wide);padding-bottom:var(--space-5)}article.svelte-1x6qdjg ul{letter-spacing:var(--letter-spacing-wide);margin-left:var(--space-5);list-style-position:outside;list-style-type:disc}article.svelte-1x6qdjg li{font-size:var(--font-size-2);color:var(--gray-6);line-height:var(--line-height-3);letter-spacing:var(--letter-spacing-wide);padding-bottom:var(--space-4)}article.svelte-1x6qdjg li:last-of-type{padding-bottom:var(--space-5)}@media(min-width: 576px){.article-meta.svelte-1x6qdjg.svelte-1x6qdjg.svelte-1x6qdjg{padding:0}.article-meta.svelte-1x6qdjg h1{font-size:var(--font-size-6);padding:var(--space-3) 0}.article-meta.svelte-1x6qdjg>div.svelte-1x6qdjg.svelte-1x6qdjg{display:flex}.article-meta.svelte-1x6qdjg>div.svelte-1x6qdjg>div.svelte-1x6qdjg{padding-right:var(--space-7);font-size:var(--font-size-2)}article.svelte-1x6qdjg.svelte-1x6qdjg.svelte-1x6qdjg{padding:0 0}article.svelte-1x6qdjg h2{display:block;font-size:var(--font-size-5);padding:var(--space-5) 0 var(--space-3) 0}article.svelte-1x6qdjg>p{font-size:var(--font-size-3);line-height:var(--line-height-5);padding-bottom:var(--space-6)}article.svelte-1x6qdjg li{font-size:var(--font-size-3);line-height:var(--line-height-4);padding-bottom:var(--space-5)}article.svelte-1x6qdjg li:last-of-type{padding-bottom:var(--space-6)}}@media(min-width: 992px){}",
  map: '{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script context=\\"module\\">\\n  export async function load({ page, fetch }) {\\n    const article = await fetch(`${page.path}.json`).then((res) => res.json())\\n\\n    if (!article) {\\n      return {\\n        status: 400,\\n        error: new Error(\'Article could not be found\'),\\n      }\\n    }\\n    return {\\n      props: {\\n        article,\\n      },\\n    }\\n  }\\n<\/script>\\n\\n<script>\\n  import { formatDate } from \'$lib/utils.js\'\\n\\n  export let article\\n<\/script>\\n\\n<style>\\n  .article-meta {\\n    width: 100%;\\n    margin: 0 auto var(--space-6) auto;\\n    max-width: 576px;\\n    padding: 0 var(--space-2);\\n  }\\n\\n  .article-meta :global(h1) {\\n    display: block;\\n    font-size: var(--font-size-4);\\n    padding: var(--space-2) 0;\\n    font-weight: 500;\\n    letter-spacing: var(--letter-spacing-wide);\\n    color: var(--gray-7);\\n  }\\n\\n  .article-meta > div {\\n    display: flex;\\n  }\\n\\n  .article-meta > div > div {\\n    padding-right: var(--space-5);\\n    color: var(--gray-5);\\n    letter-spacing: var(--letter-spacing-wide);\\n    font-size: var(--font-size-1);\\n  }\\n\\n  article {\\n    width: 100%;\\n    margin: 0 auto;\\n    max-width: 576px;\\n    padding: 0 var(--space-2);\\n  }\\n\\n  article :global(h2) {\\n    display: block;\\n    font-size: var(--font-size-4);\\n    padding: var(--space-5) 0 var(--space-2) 0;\\n  }\\n\\n  article > :global(p) {\\n    font-size: var(--font-size-2);\\n    color: var(--gray-6);\\n    line-height: var(--line-height-4);\\n    letter-spacing: var(--letter-spacing-wide);\\n    padding-bottom: var(--space-5);\\n  }\\n\\n  article :global(ul) {\\n    letter-spacing: var(--letter-spacing-wide);\\n    margin-left: var(--space-5);\\n    list-style-position: outside;\\n    list-style-type: disc;\\n  }\\n\\n  article :global(li) {\\n    font-size: var(--font-size-2);\\n    color: var(--gray-6);\\n    line-height: var(--line-height-3);\\n    letter-spacing: var(--letter-spacing-wide);\\n    padding-bottom: var(--space-4);\\n  }\\n\\n  article :global(li:last-of-type) {\\n    padding-bottom: var(--space-5);\\n  }\\n\\n  @media (min-width: 576px) {\\n    .article-meta {\\n      padding: 0;\\n    }\\n\\n    .article-meta :global(h1) {\\n      font-size: var(--font-size-6);\\n      padding: var(--space-3) 0;\\n    }\\n\\n    .article-meta > div {\\n      display: flex;\\n    }\\n\\n    .article-meta > div > div {\\n      padding-right: var(--space-7);\\n      font-size: var(--font-size-2);\\n    }\\n\\n    article {\\n      padding: 0 0;\\n    }\\n\\n    article :global(h2) {\\n      display: block;\\n      font-size: var(--font-size-5);\\n      padding: var(--space-5) 0 var(--space-3) 0;\\n    }\\n\\n    article > :global(p) {\\n      font-size: var(--font-size-3);\\n      line-height: var(--line-height-5);\\n      padding-bottom: var(--space-6);\\n    }\\n\\n    article :global(li) {\\n      font-size: var(--font-size-3);\\n      line-height: var(--line-height-4);\\n      padding-bottom: var(--space-5);\\n    }\\n\\n    article :global(li:last-of-type) {\\n      padding-bottom: var(--space-6);\\n    }\\n  }\\n\\n  @media (min-width: 992px) {\\n  }</style>\\n\\n<div class=\\"article-meta\\">\\n  <h1>{article.title}</h1>\\n  <div>\\n    <div class=\\"author\\">\u4F5C\u8005\uFF1A<a sveltekit:prefetch href={`../author/${article.author_id}`}>{article.author}</a></div>\\n    <div class=\\"date\\">\u767C\u5E03\u6642\u9593\uFF1A{formatDate(article.published_date)}</div>\\n  </div>\\n</div>\\n<article>\\n  <slot />\\n</article>\\n"],"names":[],"mappings":"AAyBE,aAAa,6CAAC,CAAC,AACb,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CAAC,IAAI,CAAC,IAAI,SAAS,CAAC,CAAC,IAAI,CAClC,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,CAAC,CAAC,IAAI,SAAS,CAAC,AAC3B,CAAC,AAED,4BAAa,CAAC,AAAQ,EAAE,AAAE,CAAC,AACzB,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,OAAO,CAAE,IAAI,SAAS,CAAC,CAAC,CAAC,CACzB,WAAW,CAAE,GAAG,CAChB,cAAc,CAAE,IAAI,qBAAqB,CAAC,CAC1C,KAAK,CAAE,IAAI,QAAQ,CAAC,AACtB,CAAC,AAED,4BAAa,CAAG,GAAG,8BAAC,CAAC,AACnB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,4BAAa,CAAG,kBAAG,CAAG,GAAG,eAAC,CAAC,AACzB,aAAa,CAAE,IAAI,SAAS,CAAC,CAC7B,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,cAAc,CAAE,IAAI,qBAAqB,CAAC,CAC1C,SAAS,CAAE,IAAI,aAAa,CAAC,AAC/B,CAAC,AAED,OAAO,6CAAC,CAAC,AACP,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,CAAC,CAAC,IAAI,SAAS,CAAC,AAC3B,CAAC,AAED,sBAAO,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnB,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,OAAO,CAAE,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,AAC5C,CAAC,AAED,sBAAO,CAAW,CAAC,AAAE,CAAC,AACpB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,WAAW,CAAE,IAAI,eAAe,CAAC,CACjC,cAAc,CAAE,IAAI,qBAAqB,CAAC,CAC1C,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,sBAAO,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnB,cAAc,CAAE,IAAI,qBAAqB,CAAC,CAC1C,WAAW,CAAE,IAAI,SAAS,CAAC,CAC3B,mBAAmB,CAAE,OAAO,CAC5B,eAAe,CAAE,IAAI,AACvB,CAAC,AAED,sBAAO,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,KAAK,CAAE,IAAI,QAAQ,CAAC,CACpB,WAAW,CAAE,IAAI,eAAe,CAAC,CACjC,cAAc,CAAE,IAAI,qBAAqB,CAAC,CAC1C,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,sBAAO,CAAC,AAAQ,eAAe,AAAE,CAAC,AAChC,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,aAAa,6CAAC,CAAC,AACb,OAAO,CAAE,CAAC,AACZ,CAAC,AAED,4BAAa,CAAC,AAAQ,EAAE,AAAE,CAAC,AACzB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,OAAO,CAAE,IAAI,SAAS,CAAC,CAAC,CAAC,AAC3B,CAAC,AAED,4BAAa,CAAG,GAAG,8BAAC,CAAC,AACnB,OAAO,CAAE,IAAI,AACf,CAAC,AAED,4BAAa,CAAG,kBAAG,CAAG,GAAG,eAAC,CAAC,AACzB,aAAa,CAAE,IAAI,SAAS,CAAC,CAC7B,SAAS,CAAE,IAAI,aAAa,CAAC,AAC/B,CAAC,AAED,OAAO,6CAAC,CAAC,AACP,OAAO,CAAE,CAAC,CAAC,CAAC,AACd,CAAC,AAED,sBAAO,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnB,OAAO,CAAE,KAAK,CACd,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,OAAO,CAAE,IAAI,SAAS,CAAC,CAAC,CAAC,CAAC,IAAI,SAAS,CAAC,CAAC,CAAC,AAC5C,CAAC,AAED,sBAAO,CAAW,CAAC,AAAE,CAAC,AACpB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,WAAW,CAAE,IAAI,eAAe,CAAC,CACjC,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,sBAAO,CAAC,AAAQ,EAAE,AAAE,CAAC,AACnB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,WAAW,CAAE,IAAI,eAAe,CAAC,CACjC,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,sBAAO,CAAC,AAAQ,eAAe,AAAE,CAAC,AAChC,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC3B,CAAC"}'
};
async function load$1({ page, fetch: fetch3 }) {
  const article = await fetch3(`${page.path}.json`).then((res) => res.json());
  if (!article) {
    return {
      status: 400,
      error: new Error("Article could not be found")
    };
  }
  return { props: { article } };
}
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { article } = $$props;
  if ($$props.article === void 0 && $$bindings.article && article !== void 0)
    $$bindings.article(article);
  $$result.css.add(css$2);
  return `<div class="${"article-meta svelte-1x6qdjg"}"><h1>${escape2(article.title)}</h1>
  <div class="${"svelte-1x6qdjg"}"><div class="${"author svelte-1x6qdjg"}">\u4F5C\u8005\uFF1A<a sveltekit:prefetch${add_attribute("href", `../author/${article.author_id}`, 0)}>${escape2(article.author)}</a></div>
    <div class="${"date svelte-1x6qdjg"}">\u767C\u5E03\u6642\u9593\uFF1A${escape2(formatDate(article.published_date))}</div></div></div>
<article class="${"svelte-1x6qdjg"}">${slots.default ? slots.default({}) : ``}</article>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout,
  load: load$1
});
var getSideBySideImgOptimalWidth = (leftImg, rightImg) => {
  const x1 = leftImg.width;
  const x2 = rightImg.width;
  const y1 = leftImg.height;
  const y2 = rightImg.height;
  const diff = (y1 - y2) * (x1 * x2 / (x2 * y1 + x1 * y2));
  const leftRatio = Math.round((x1 - diff) / (x1 + x2) * 1e4) / 100;
  return {
    leftRatio,
    rightRatio: 100 - leftRatio
  };
};
var css$1 = {
  code: "figcaption.svelte-y2ecn6>a{text-decoration:underline}figure.svelte-y2ecn6.svelte-y2ecn6{padding-bottom:var(--space-5);width:100%}.side-by-side.svelte-y2ecn6>.wrap.svelte-y2ecn6{display:flex;flex-direction:row;gap:10px}.wrap.svelte-y2ecn6>div.svelte-y2ecn6:nth-of-type(1){margin-left:auto}figcaption.svelte-y2ecn6.svelte-y2ecn6{text-align:center;font-size:var(--font-size-0);padding-top:10px;color:var(--gray-4)}@media(min-width: 576px){figure.svelte-y2ecn6.svelte-y2ecn6{padding-bottom:var(--space-6)}figure.cover.svelte-y2ecn6.svelte-y2ecn6{width:100vw;transform:translateX(calc((576px - 100vw) / 2));padding-bottom:var(--space-8)}figcaption.svelte-y2ecn6.svelte-y2ecn6{font-size:var(--font-size-1)}}@media(min-width: 640px){figure.svelte-y2ecn6.svelte-y2ecn6{width:640px;transform:translateX(calc((576px - 640px) / 2))}}@media(min-width: 800px){figure.side-by-side.svelte-y2ecn6.svelte-y2ecn6{width:800px;transform:translateX(calc((576px - 800px) / 2))}}",
  map: `{"version":3,"file":"Img.svelte","sources":["Img.svelte"],"sourcesContent":["<script>\\n  export let src\\n  export let type = 'base'\\n  export let alt = ''\\n  export let srcLeft\\n  export let srcRight\\n  export let altLeft = ''\\n  export let altRight = ''\\n\\n  import { onMount } from 'svelte'\\n  import { getSideBySideImgOptimalWidth } from '$lib/article/utlis.js'\\n\\n  let leftImg, rightImg\\n  let mounted = false\\n  let sideBySideWidthRatio\\n\\n  onMount(() => {\\n    mounted = true\\n  })\\n\\n  $: if (mounted && leftImg && rightImg) {\\n    // right side image will load before left side iamge\\n    rightImg.onload = function () {\\n      sideBySideWidthRatio = getSideBySideImgOptimalWidth(leftImg, rightImg)\\n      leftImg.parentNode.style.width = sideBySideWidthRatio.leftRatio + '%'\\n      rightImg.parentNode.style.width = sideBySideWidthRatio.rightRatio + '%'\\n    }\\n\\n    // handle safari cache problem\\n    if (rightImg.complete) {\\n      sideBySideWidthRatio = getSideBySideImgOptimalWidth(leftImg, rightImg)\\n      leftImg.parentNode.style.width = sideBySideWidthRatio.leftRatio + '%'\\n      rightImg.parentNode.style.width = sideBySideWidthRatio.rightRatio + '%'\\n    }\\n  }\\n<\/script>\\n\\n<style>\\n  figcaption > :global(a) {\\n    text-decoration: underline;\\n  }\\n  /* base */\\n  figure {\\n    padding-bottom: var(--space-5);\\n    width: 100%;\\n  }\\n\\n  /* side-by-side */\\n  .side-by-side > .wrap {\\n    display: flex;\\n    flex-direction: row;\\n    gap: 10px;\\n  }\\n\\n  .wrap > div:nth-of-type(1) {\\n    margin-left: auto;\\n  }\\n\\n  /* note */\\n  figcaption {\\n    text-align: center;\\n    font-size: var(--font-size-0);\\n    padding-top: 10px;\\n    color: var(--gray-4);\\n  }\\n\\n  @media (min-width: 576px) {\\n    figure {\\n      padding-bottom: var(--space-6);\\n    }\\n\\n    figure.cover {\\n      width: 100vw;\\n      transform: translateX(calc((576px - 100vw) / 2));\\n      padding-bottom: var(--space-8);\\n    }\\n\\n    figcaption {\\n      font-size: var(--font-size-1);\\n    }\\n  }\\n\\n  /* img breakpoint */\\n  @media (min-width: 640px) {\\n    figure {\\n      width: 640px;\\n      transform: translateX(calc((576px - 640px) / 2));\\n    }\\n  }\\n\\n  @media (min-width: 800px) {\\n    figure.side-by-side {\\n      width: 800px;\\n      transform: translateX(calc((576px - 800px) / 2));\\n    }\\n  }</style>\\n\\n<figure class:side-by-side={type === 'side-by-side'} class:cover={type === 'cover'}>\\n  {#if type === 'base'}\\n    <img {src} {alt} />\\n  {:else if type === 'cover'}\\n    <img class=\\"cover\\" {src} {alt} />\\n  {:else if type === 'side-by-side'}\\n    <div class=\\"wrap\\">\\n      <div><img bind:this={leftImg} src={srcLeft} alt={altLeft} /></div>\\n      <div><img bind:this={rightImg} src={srcRight} alt={altRight} /></div>\\n    </div>\\n  {/if}\\n  <figcaption><slot /></figcaption>\\n</figure>\\n"],"names":[],"mappings":"AAsCE,wBAAU,CAAW,CAAC,AAAE,CAAC,AACvB,eAAe,CAAE,SAAS,AAC5B,CAAC,AAED,MAAM,4BAAC,CAAC,AACN,cAAc,CAAE,IAAI,SAAS,CAAC,CAC9B,KAAK,CAAE,IAAI,AACb,CAAC,AAGD,2BAAa,CAAG,KAAK,cAAC,CAAC,AACrB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,GAAG,CAAE,IAAI,AACX,CAAC,AAED,mBAAK,CAAG,iBAAG,aAAa,CAAC,CAAC,AAAC,CAAC,AAC1B,WAAW,CAAE,IAAI,AACnB,CAAC,AAGD,UAAU,4BAAC,CAAC,AACV,UAAU,CAAE,MAAM,CAClB,SAAS,CAAE,IAAI,aAAa,CAAC,CAC7B,WAAW,CAAE,IAAI,CACjB,KAAK,CAAE,IAAI,QAAQ,CAAC,AACtB,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,4BAAC,CAAC,AACN,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,MAAM,MAAM,4BAAC,CAAC,AACZ,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,WAAW,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAChD,cAAc,CAAE,IAAI,SAAS,CAAC,AAChC,CAAC,AAED,UAAU,4BAAC,CAAC,AACV,SAAS,CAAE,IAAI,aAAa,CAAC,AAC/B,CAAC,AACH,CAAC,AAGD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,4BAAC,CAAC,AACN,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,WAAW,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAClD,CAAC,AACH,CAAC,AAED,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AACzB,MAAM,aAAa,4BAAC,CAAC,AACnB,KAAK,CAAE,KAAK,CACZ,SAAS,CAAE,WAAW,KAAK,CAAC,KAAK,CAAC,CAAC,CAAC,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,AAClD,CAAC,AACH,CAAC"}`
};
var Img = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { src: src2 } = $$props;
  let { type = "base" } = $$props;
  let { alt = "" } = $$props;
  let { srcLeft } = $$props;
  let { srcRight } = $$props;
  let { altLeft = "" } = $$props;
  let { altRight = "" } = $$props;
  let leftImg, rightImg;
  let mounted = false;
  let sideBySideWidthRatio;
  onMount(() => {
    mounted = true;
  });
  if ($$props.src === void 0 && $$bindings.src && src2 !== void 0)
    $$bindings.src(src2);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.alt === void 0 && $$bindings.alt && alt !== void 0)
    $$bindings.alt(alt);
  if ($$props.srcLeft === void 0 && $$bindings.srcLeft && srcLeft !== void 0)
    $$bindings.srcLeft(srcLeft);
  if ($$props.srcRight === void 0 && $$bindings.srcRight && srcRight !== void 0)
    $$bindings.srcRight(srcRight);
  if ($$props.altLeft === void 0 && $$bindings.altLeft && altLeft !== void 0)
    $$bindings.altLeft(altLeft);
  if ($$props.altRight === void 0 && $$bindings.altRight && altRight !== void 0)
    $$bindings.altRight(altRight);
  $$result.css.add(css$1);
  {
    if (mounted && leftImg && rightImg) {
      rightImg.onload = function() {
        sideBySideWidthRatio = getSideBySideImgOptimalWidth(leftImg, rightImg);
        leftImg.parentNode.style.width = sideBySideWidthRatio.leftRatio + "%";
        rightImg.parentNode.style.width = sideBySideWidthRatio.rightRatio + "%";
      };
      if (rightImg.complete)
        ;
    }
  }
  return `<figure class="${[
    "svelte-y2ecn6",
    (type === "side-by-side" ? "side-by-side" : "") + " " + (type === "cover" ? "cover" : "")
  ].join(" ").trim()}">${type === "base" ? `<img${add_attribute("src", src2, 0)}${add_attribute("alt", alt, 0)}>` : `${type === "cover" ? `<img class="${"cover"}"${add_attribute("src", src2, 0)}${add_attribute("alt", alt, 0)}>` : `${type === "side-by-side" ? `<div class="${"wrap svelte-y2ecn6"}"><div class="${"svelte-y2ecn6"}"><img${add_attribute("src", srcLeft, 0)}${add_attribute("alt", altLeft, 0)}${add_attribute("this", leftImg, 1)}></div>
      <div class="${"svelte-y2ecn6"}"><img${add_attribute("src", srcRight, 0)}${add_attribute("alt", altRight, 0)}${add_attribute("this", rightImg, 1)}></div></div>` : ``}`}`}
  <figcaption class="${"svelte-y2ecn6"}">${slots.default ? slots.default({}) : ``}</figcaption></figure>`;
});
var metadata$2 = {
  "title": "\u8AB0\u662F\u4E2D\u8077\u4EBA\u6C23\u738B\uFF1F\u54EA\u968A\u7403\u8FF7\u611B\u51FA\u5F81\uFF1FPTT\u8CC7\u6599\u5168\u89E3\u6790",
  "author": "Dennis Tseng",
  "author_id": "dennisqq",
  "description": "\u300C\u559C\u611B\u68D2\u7403\uFF0C\u71B1\u611B\u68D2\u7403\uFF0C\u6C92\u6709\u68D2\u7403\u5C31\u5403\u4E0D\u4E0B\u98EF\uFF0C\u5C31\u7761\u4E0D\u8457\u89BA\uFF0C\u751A\u81F3\u5C31\u6703\u6D3B\u4E0D\u4E0B\u53BB\u7684\u68D2\u7403\u75F4\u3001\u68D2\u7403\u72C2\uFF0C\u5404\u4F4D\u7403\u8FF7\u670B\u53CB\uFF0C\u5927\u5BB6\u597D\uFF01\u300D\u559C\u6B61\u770B\u4E2D\u83EF\u8077\u68D2\u7684\u670B\u53CB\uFF0C\u4E00\u5B9A\u4E0D\u6703\u5C0D\u4E3B\u64AD\u5F90\u5C55\u5143\u7684\u6163\u7528\u958B\u5834\u767D\u611F\u5230\u964C\u751F\u3002",
  "published_date": "2021-04-06T00:00:00.000Z",
  "updated_date": "2021-04-6",
  "tags": "\u68D2\u7403,\u8CC7\u6599,\u6578\u64DA,\u8CC7\u6599\u8996\u89BA\u5316,\u8CC7\u6599\u65B0\u805E",
  "category": "\u8CC7\u6599\u6545\u4E8B",
  "cover_image": "../../assets/article/202104061800/2.png"
};
var _202104061800 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<p>\u300C\u559C\u611B\u68D2\u7403\uFF0C\u71B1\u611B\u68D2\u7403\uFF0C\u6C92\u6709\u68D2\u7403\u5C31\u5403\u4E0D\u4E0B\u98EF\uFF0C\u5C31\u7761\u4E0D\u8457\u89BA\uFF0C\u751A\u81F3\u5C31\u6703\u6D3B\u4E0D\u4E0B\u53BB\u7684\u68D2\u7403\u75F4\u3001\u68D2\u7403\u72C2\uFF0C\u5404\u4F4D\u7403\u8FF7\u670B\u53CB\uFF0C\u5927\u5BB6\u597D\uFF01\u300D\u559C\u6B61\u770B\u4E2D\u83EF\u8077\u68D2\u7684\u670B\u53CB\uFF0C\u4E00\u5B9A\u4E0D\u6703\u5C0D\u4E3B\u64AD\u5F90\u5C55\u5143\u7684\u6163\u7528\u958B\u5834\u767D\u611F\u5230\u964C\u751F\u3002</p>
<p>\u96D6\u7136\u4E2D\u83EF\u8077\u68D2\u7684\u6BD4\u8CFD\u6709\u592A\u591A\u7F3A\u9EDE\uFF0C\u50CF\u662F\u5099\u53D7\u8A6C\u75C5\u7684\u8B8A\u5F62\u87F2\u597D\u7403\u5E36\u3001\u6BD4\u4E0D\u4E0A\u97D3/\u65E5/\u7F8E\u8077\u7684\u7AF6\u6280\u6C34\u6E96\u3001\u96E3\u4EE5\u5FCD\u53D7\u7684\u6BD4\u8CFD\u6642\u9577\u3001\u7CFB\u968A\u7B49\u7D1A\u7684\u5931\u8AA4\u3001\u88AB\u8AF7\u70BA\u8349\u5275\u7684\u898F\u5247\u8207\u5236\u5EA6\u7B49\uFF0C\u4F46\u56E0\u70BA\u5F9E\u5C0F\u770B\u7403\u6709\u7A2E\u89AA\u5207\u611F\uFF0C\u53C8\u88AB\u570B\u969B\u8CFD\u4E2D\u7403\u54E1\u7684\u6D74\u8840\u596E\u6230\u6240\u5438\u5F15\uFF0C\u5373\u4F7F\u4E2D\u9593\u56E0\u70BA\u5047\u7403\u6848\u66FE\u7D93\u5931\u671B\u800C\u9EEF\u7136\u96E2\u958B\uFF0C\u4F46\u9084\u662F\u5FCD\u4E0D\u4F4F\u56DE\u982D\u95DC\u6CE8\u559C\u611B\u7684\u7403\u54E1\u52D5\u614B\u3002</p>
<p>\u9664\u4E86\u5229\u7528\u76F4\u64AD\u5E73\u53F0\u5982\u5716\u5947\u7684\u7559\u8A00\u529F\u80FD\u4EE5\u5916\uFF0C\u7DCA\u8DDF\u6BCF\u5834\u7403\u8CFD\u76F4\u64AD\u7684\u6642\u5019\uFF0C\u7403\u8FF7\u4E5F\u6703\u5230 PTT \u4E0A Elephants, Monkeys, Lions, Guardians, WCDragons \u5404\u500B\u968A\u677F\u7684\u76F4\u64AD\u6587\u7AE0\u4E0B\u65B9\u7559\u8A00\uFF0C\u96A8\u8457\u7403\u8CFD\u9AD8\u4F4E\u6F6E\u767C\u6D29\u60C5\u7DD2\u3002\u6BD4\u8CFD\u7D50\u675F\u5F8C\uFF0C\u4E5F\u6703\u5728\u677F\u4E0A\u8A0E\u8AD6\u4E26\u8A55\u65B7\u7403\u54E1\u8868\u73FE\uFF0C\u6709\u6642\u9F13\u52F5\u6709\u6642\u653B\u8A10\uFF0C\u751A\u81F3\u5230\u5176\u4ED6\u968A\u4F0D\u677F\u4E0A\u55C6\u8072\u53EB\u56C2\uFF0C\u5118\u7BA1\u7D1B\u4E82\u4F46\u4E5F\u591A\u5143\u3002</p>
<p>\u81EA\u5DF1\u56DE\u934B\u770B\u7403\u4E4B\u5F8C\uFF0C\u4E5F\u52A0\u5165\u540C\u597D\u5011\u4E00\u8D77\u7576\u9375\u76E4\u6559\u7DF4\u7684\u884C\u5217\uFF0C\u5728\u968A\u677F\u4E0A\u5E6B\u559C\u6B61\u7684\u7403\u54E1\u6253\u6C23\u6216\u8005\u6068\u9435\u4E0D\u6210\u92FC\u3002\u5728\u9019\u6A23\u7684\u904E\u7A0B\u4E2D\uFF0C\u6DF1\u6DF1\u6B3D\u4F69\u65BC\u7403\u8FF7\u5011\u7684\u71B1\u60C5\u8207\u8A0E\u8AD6\u4E0A\u7684\u6DF1\u5EA6\uFF0C\u4E26\u958B\u59CB\u89BA\u5F97\uFF0C\u6216\u8A31\u80FD\u5920\u5F9E\u9019\u6A23\u7684\u8A0E\u8AD6\u8CC7\u6599\u7576\u4E2D\uFF0C\u627E\u5230\u6709\u8DA3\u7684\u6D1E\u898B\u3002</p>
<p>\u7A0D\u5FAE\u5C07\u81EA\u5DF1\u611F\u8208\u8DA3\u7684\u554F\u984C\u5206\u985E\uFF0C\u53EF\u4EE5\u5206\u70BA\u5E7E\u500B\u5C64\u6B21\u3002\u9996\u5148\uFF0C\u4EE5\u7403\u968A\u4F86\u8AAA\uFF0C\u6211\u5011\u90FD\u77E5\u9053\u5144\u5F1F\u7684\u7403\u8FF7\u4EBA\u6578\u6700\u591A\uFF0C\u4F46\u5176\u4ED6\u968A\u4F0D\u5462\uFF1F\u518D\u4F86\uFF0C\u4EE5\u6642\u9593\u5C3A\u5EA6\u4F86\u770B\uFF0C\u68D2\u7403\u677F(Baseball \u677F\uFF0C\u8A0E\u8AD6\u4E2D\u8077\u3001\u65E5\u8077\u3001\u7F8E\u8077\u7684\u5927\u677F) \u7684\u9AD8\u5CF0\u591A\u534A\u51FA\u73FE\u65BC\u5927\u578B\u570B\u969B\u8CFD\u8207\u4E2D\u8077\u7403\u54E1\u7403\u5834\u5916\u7684\u722D\u8B70\uFF0C\u4F46\u5982\u679C\u4EE5\u968A\u4F0D\u70BA\u55AE\u4F4D\uFF0C\u5404\u968A\u7403\u8FF7\u53C8\u6703\u56E0\u70BA\u4EC0\u9EBC\u6A23\u7684\u4E8B\u4EF6\u800C\u805A\u96C6\uFF1F\u6B64\u5916\uFF0C\u96D6\u7136\u90FD\u662F\u68D2\u7403\u8FF7\uFF0C\u4F46\u7403\u8FF7\u4E5F\u6703\u56E0\u70BA\u652F\u6301\u968A\u4F0D\u4E0D\u540C\u800C\u767C\u751F\u722D\u57F7\uFF0C\u90A3\u9EBC\uFF0C\u6703\u662F\u54EA\u4E9B\u7403\u968A\u7684\u7403\u8FF7\u6700\u5E38\u5230\u5176\u4ED6\u968A\u677F\u4E0A\u767C\u6587\uFF1F\u6700\u5F8C\uFF0C\u5247\u662F\u5404\u968A\u7403\u8FF7\u6700\u5E38\u8A0E\u8AD6\u7684\u5C0D\u8C61\uFF0C\u7A76\u7ADF\u662F\u968A\u4F0D\u4E2D\u54EA\u4E9B\u7403\u54E1\u3001\u6559\u7DF4\u3001\u7BA1\u7406\u4EBA\u54E1\u3001\u6216\u8005\u88AB\u8B7D\u70BA\u7403\u8CFD\u672C\u8CEA\u7684\u5566\u5566\u968A\uFF1F\u4E0D\u50C5\u5982\u6B64\uFF0C\u9664\u4E86\u81EA\u5BB6\u6210\u54E1\u4EE5\u5916\uFF0C\u53C8\u95DC\u6CE8\u54EA\u4E9B\u4ED6\u968A\u6210\u54E1\uFF1F</p>
<p>\u6211\u4EE5\u4E2D\u83EF\u8077\u68D2 31 \u5E74\u70BA\u89C0\u5BDF\u5340\u9593\uFF0C\u6642\u9593\u5B9A\u5728 2019/11/16\u20132020/12/31\uFF0C\u525B\u597D\u662F 2019 \u5E74\u5E95\u4E16\u754C12\u5F37\u68D2\u7403\u8CFD\u7D50\u675F\uFF0C\u4E00\u76F4\u5230\u7D71\u4E00\u7345\u596A\u51A0\u5F8C\u7684\u5E74\u5E95\u70BA\u6B62\uFF0C\u8A66\u5716\u56DE\u7B54\u4E0A\u9762\u7684\u554F\u984C\u3002\u56E0\u70BA\u8CC7\u6599\u53CD\u6620 PTT \u9109\u6C11\u7684\u7528\u8A9E\uFF0C\u6240\u4EE5\u6587\u7AE0\u6703\u7A7F\u63D2\u677F\u4E0A\u5E38\u898B\u7684\u8853\u8A9E/\u884C\u8A71\u3002\u4E0B\u65B9\u63D0\u4F9B\u7C21\u55AE\u7684\u5C0D\u7167\uFF1A</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202104061800/1.png"
  }, {}, { default: () => `\u968A\u4F0D\u3001\u4FD7\u540D\u3001\u984F\u8272\u5C0D\u7167\u8868` })}
<p>\u7576\u7136\uFF0C\u793E\u7FA4\u8CC7\u6599\u4E5F\u6709\u5148\u5929\u4E0A\u7684\u9650\u5236\uFF0C\u50CF\u662F\u4F7F\u7528 PTT \u7684\u5E74\u9F61\u5C64\u4E0D\u4E00\u5B9A\u548C\u4E2D\u8077\u652F\u6301\u8005\u91CD\u5408\u5C0E\u81F4\u62BD\u6A23\u8AA4\u5DEE\u3001\u677F\u4E0A\u7684\u8B3E\u7F75\u6703\u88AB\u522A\u9664\u5C0E\u81F4\u6A23\u672C\u7F3A\u5931\u3001\u5C11\u6578\u677F\u4E0A\u7684\u7528\u8A5E\u96E3\u61C2\u5C0E\u81F4\u8A08\u7B97\u4E0A\u7684\u907A\u6F0F\u7B49\u7B49\uFF0C\u90FD\u662F\u53EF\u80FD\u51FA\u73FE\u7684\u554F\u984C\u3002\u53E6\u5916\uFF0C\u4E5F\u6709\u5176\u4ED6\u5C1A\u672A\u91D0\u6E05\u3001\u4F46\u4E5F\u5341\u5206\u6709\u8DA3\u7684\u8B70\u984C\uFF0C\u8B6C\u5982\u6709\u54EA\u968A\u7403\u8FF7\u6700\u611B\u6D77\u5DE1(\u6307\u53BB\u4ED6\u968A\u968A\u677F\u55C6\u8072\u8B3E\u7F75)\uFF1F\u54EA\u968A\u7403\u8FF7\u7261\u8823\u7D44\u6700\u591A(\u6307\u5373\u4F7F\u7403\u968A\u8868\u73FE\u5DEE\u4ECD\u4E0D\u65B7\u9F13\u52F5\u7403\u54E1)\uFF1F\u968A\u677F\u7684\u98A8\u5411\u8207\u68D2\u7403\u677F\u53C8\u6709\u4F55\u5DEE\u7570\uFF1F\u7403\u8FF7\u5BE6\u969B\u600E\u9EBC\u89AC\u89A6\u6216\u8096\u60F3\u3001\u4E0D\u9F52\u6216\u653B\u64CA\u7403\u54E1\uFF1F\u9019\u4E9B\u90FD\u662F\u53EF\u4EE5\u518D\u5411\u4E0B\u6316\u6DF1\u7684\u8B70\u984C\u3002</p>
<h2>\u5716\u8868\u8207\u5206\u6790</h2>
<p>\u54EA\u652F\u968A\u4F0D\u8A0E\u8AD6\u6700\u70BA\u71B1\u70C8\uFF1F\u82E5\u4EE5\u6587\u7AE0\u7E3D\u6578\u4F86\u770B\uFF0C\u6392\u540D\u4F9D\u5E8F\u662F\u5144\u5F1F\u3001\u6843\u733F\u3001\u7D71\u4E00\u3001\u5BCC\u90A6\uFF0C\u6070\u597D\u5C31\u662F\u5168\u5E74\u7403\u5B63\u7684\u5404\u968A\u6392\u540D\uFF0C\u6539\u770B\u63A8\u6587\u7E3D\u6578\u6642\uFF0C\u7D71\u4E00\u56E0\u70BA\u6709\u8457\u4E0B\u534A\u5B63\u672B\u722D\u6436\u5B63\u51A0\u8ECD\u548C\u53F0\u7063\u5927\u8CFD\u7684\u52A0\u6301\uFF0C\u8D85\u8D8A\u6843\u733F\u6210\u70BA\u7B2C\u4E8C\u3002</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202104061800/2.png"
  }, {}, {})}
<p>\u4EE5\u53BB\u9664\u91CD\u8907\u7684\u767C\u6587\u4EBA\u6578\u8207\u63A8\u6587\u4EBA\u6578\u4F86\u770B\uFF0C\u6392\u540D\u90FD\u662F\u5144\u5F1F\u3001\u7D71\u4E00\u3001\u5BCC\u90A6/\u6843\u733F\uFF0C\u6253\u9032\u5B63\u5F8C\u8CFD\u5C31\u6BD4\u8F03\u5BB9\u6613\u5438\u5F15\u7403\u8FF7\u3002</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202104061800/3.png"
  }, {}, {})}
<p>\u5229\u7528\u767C\u6587\u6578\u91CF\u9664\u4E0A\u53BB\u91CD\u767C\u6587\u4EBA\u6578\u3001\u63A8\u6587\u6578\u91CF\u9664\u4E0A\u53BB\u91CD\u63A8\u6587\u4EBA\u6578\uFF0C\u53EF\u4EE5\u5F97\u5230\u4EBA\u5747\u767C\u6587\u6578\u8207\u4EBA\u5747\u63A8\u6587\u6578\uFF0C\u4EBA\u5747\u767C\u6587\u6578\u7684\u6392\u540D\u662F\u6843\u733F\u3001\u5BCC\u90A6\u3001\u7D71\u4E00\u3001\u5144\u5F1F\uFF0C\u53CD\u6620\u51FA\u6843\u733F\u548C\u5BCC\u90A6\u500B\u90FD\u6709\u7FA4\u76F8\u5C0D\u6B7B\u5FE0\u7684\u7403\u8FF7\u6490\u8D77\u4E86\u677F\u4E0A\u7684\u8A0E\u8AD6\u98A8\u6C23\uFF1B\u4EBA\u5747\u63A8\u6587\u6578\u7684\u6392\u540D\u662F\u5144\u5F1F\u3001\u7D71\u4E00\u3001\u5BCC\u90A6\u3001\u6843\u733F\uFF0C\u5144\u5F1F\u7684\u7403\u8FF7\u4E0D\u53EA\u63A8\u6587\u591A\u3001\u4EBA\u6578\u591A\uFF0C\u5E73\u5747\u4E0D\u8F38\u4EBA\uFF0C\u7121\u6127\u65BC\u4EBA\u6C23\u7403\u968A\u7684\u7A31\u865F\u3002</p>
<p>\u5404\u968A\u677F\u898F\u5C0D\u65BC\u6587\u7AE0\u6A19\u984C\u3001\u683C\u5F0F\u3001\u5167\u6587\u7B49\u6709\u4E00\u5B9A\u9650\u5236\uFF0C\u53EF\u4EE5\u53E6\u5916\u5F9E\u6587\u7AE0\u985E\u578B\u89C0\u5BDF\u968A\u677F\u8A0E\u8AD6\u98A8\u6C23\u3002\u4EE5\u8F49\u64AD\u3001\u975E\u8F49\u64AD\u6587\u7684\u5927\u5206\u985E\u4F86\u770B\uFF0C\u6843\u733F\u7684\u8F49\u64AD\u6587\u6BD4\u4F8B\u76F8\u5C0D\u8F03\u9AD8\uFF0C\u60F3\u5230\u53EF\u80FD\u7684\u8A6E\u91CB\u6709\u5169\u500B\u65B9\u5411\uFF0C\u9996\u5148\u662F\u6843\u733F\u7403\u8FF7\u53EF\u80FD\u8F03\u50BE\u5411\u65BC\u5FE0\u5BE6\u7684\u8F49\u64AD\u6BCF\u5834\u7403\u8CFD\uFF0C\u56E0\u6B64\u4F54\u6BD4\u8F03\u9AD8\uFF1B\u53E6\u4E00\u7A2E\u8A6E\u91CB\u5247\u662F\uFF0C\u76F8\u5C0D\u65BC\u6843\u733F\u5176\u4ED6\u4E09\u652F\u968A\u4F0D\u8A0E\u8AD6\u7403\u54E1\u8868\u73FE\u6216\u662F\u8F49\u8CBC\u76F8\u95DC\u65B0\u805E\u7684\u6587\u7AE0\u8F03\u591A\u3002</p>`;
});
var _202104061800$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _202104061800,
  metadata: metadata$2
});
var metadata$1 = {
  "title": "\u65B0\u805E\u5716\u8868\u5BE6\u6230\u7B46\u8A18\uFF1A\u5982\u4F55\u907F\u514D\u4E00\u5F35\u5716\u8868\uFF0C\u8B80\u8005\u5404\u81EA\u8868\u8FF0\uFF1F",
  "author": "Helene Chien",
  "author_id": "helenecc",
  "description": "\u6B64\u6587\u8A18\u9304\u6211\u7576\u65B0\u805E\u5BA4\u6578\u4F4D\u7DE8\u8F2F\u6642\uFF0C\u505A\u6578\u64DA\u8996\u89BA\u5316\u6642\u8A72\u6CE8\u610F\u7684\u5E7E\u500BTips\uFF0C\u5305\u542B\u5982\u4F55\u540C\u6642\u964D\u4F4E\u8B80\u8005\u7684\u7406\u89E3\u6210\u672C\uFF0C\u4EE5\u53CA\u8AA4\u8B80\u7684\u7A7A\u9593\uFF08\u88FD\u5716\u5DE5\u5177\uFF1AFlourish\uFF09",
  "published_date": "2021-06-06T00:00:00.000Z",
  "updated_date": "2021-06-06T00:00:00.000Z",
  "tags": "covid-19,\u5716\u8868,\u75AB\u60C5\u5716\u8868,\u8CC7\u6599,\u8CC7\u6599\u8996\u89BA\u5316,\u75AB\u60C5\u8CC7\u6599",
  "category": "\u6558\u4E8B\u7814\u7A76",
  "cover_image": "../../assets/article/202106061700/1.png"
};
var _202106061700 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202106061700/1.png"
  }, {}, {})}
<p>\u6211\u5011\u90FD\u77E5\u9053\uFF0C\u4E00\u500B\u4EBA\u651D\u53D6\u7684\u71B1\u91CF\u8DDF\u4ED6\u7684\u9AD4\u91CD\u606F\u606F\u76F8\u95DC\u3002\u60F3\u50CF\u4E00\u4E0B\uFF0C\u7576\u4F60\u62FF\u5230\u81EA\u5DF1\u9019\u4E00\u500B\u6708\u7684\u6BCF\u65E5\u651D\u53D6\u71B1\u91CF\u548C\u6BCF\u65E5\u9AD4\u91CD\u6578\u64DA\u6642\uFF0C\u4F60\u6703\u5982\u4F55\u89E3\u91CB\uFF1F</p>
<p>A. WFH\u8B93\u963F\u5B24\u6709\u6A5F\u6703\u5E6B\u6211\u5F35\u7F85\u4E09\u9910\uFF0C\u651D\u53D6\u904E\u591A\u71B1\u91CF\uFF0C\u5C0E\u81F4\u6211\u9AD4\u91CD\u8B8A\u91CD \u{1F475}\u{1F3FB}</p>
<p>B. \u6211\u5728\u4E0A\u73ED\u6642\u9593\u5077\u5065\u8EAB\uFF0C\u808C\u8089\u589E\u52A0\u3001\u9AD4\u91CD\u8B8A\u91CD\uFF0C\u6240\u4EE5\u9700\u8981\u66F4\u591A\u71B1\u91CF\u4F86\u9054\u5230\u57FA\u790E\u4EE3\u8B1D\u7387\u{1F4AA}\u{1F3FB}</p>
<p>\u5169\u7A2E\u60C5\u5F62\u90FD\u662F\u6709\u53EF\u80FD\u7684\uFF0C\u540C\u6A23\u7684\u5169\u7B46\u6578\u64DA\u53EF\u4EE5\u6709\u5168\u7136\u4E0D\u540C\u7684\u89E3\u91CB\u3002\u56E0\u6B64\u5982\u679C\u4F60\u53EA\u662F\u5728\u5716\u8868\u8EDF\u9AD4\u55AE\u7D14\u8CBC\u4E0A\u6578\u64DA\uFF0C\u4E0D\u52A0\u4EE5\u8ABF\u6574\uFF0C\u53EF\u80FD\u5C0E\u81F4\u6BCF\u500B\u4EBA\u7684\u89E3\u8B80\u90FD\u4E0D\u76E1\u76F8\u540C\uFF0C\u751A\u81F3\u5012\u56E0\u70BA\u679C\u3002</p>
<p>(\u672C\u6587\u6848\u4F8B\u5F15\u7528\u81EA\u4E2D\u592E\u793E\uFF09\u81EA\u5F9E\u672C\u571F\u75AB\u60C5\u7206\u767C\u4EE5\u4F86\uFF0C\u75AB\u82D7\u6210\u70BA\u53F0\u7063\u6700\u71B1\u7684\u8A71\u984C\u3002\u56E0\u70BA\u4E00\u500B\u5730\u5340\u5C45\u6C11\u7684\u75AB\u82D7\u63A5\u7A2E\u7387\u6703\u76F4\u63A5\u5F71\u97FF\u7576\u5730\u75C5\u6BD2\u50B3\u64AD\u901F\u5EA6\uFF0C\u53F0\u7063\u8DDF\u4E16\u754C\u5404\u570B\u7684\u75AB\u82D7\u63A5\u7A2E\u7387\u4E5F\u5F15\u8D77\u8A0E\u8AD6\u3002</p>
<p>\u90A3\u518D\u4F86\u770B\u770B\uFF0C\u4F60\u6703\u5982\u4F55\u89E3\u91CB\u9019\u5F35\u5716\u8868\uFF1F</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202106061700/2.png"
  }, {}, {})}
<p>A. \u672C\u571F\u78BA\u8A3A\u6578\u66B4\u589E\uFF0C\u6240\u4EE5\u5927\u5BB6\u958B\u59CB\u6436\u8457\u63A5\u7A2E\u75AB\u82D7</p>
<p>B. \u63A5\u7A2E\u7387\u8B8A\u9AD8\uFF0C\u5927\u5BB6\u653E\u9B06\u6212\u5099\uFF0C\u6062\u5FA9\u4EBA\u8207\u4EBA\u7684\u9023\u7D50\uFF0C\u7D50\u679C\u78BA\u8A3A\u6578\u589E\u52A0</p>
<p>\u7576\u524D\u7684\u53F0\u7063\u7121\u7591\u662FA\uFF0C\u4F46\u5728\u5176\u4ED6\u75AB\u60C5\u53CD\u8986\u7684\u570B\u5BB6\uFF08\u4E5F\u6709\u53EF\u80FD\u662F\u672A\u4F86\u7684\u53F0\u7063\uFF09\u5C31\u53EF\u80FD\u662FB\u4E86\u3002</p>
<p>\u9019\u4E5F\u662F\u5831\u5C0E\u767C\u5E03\u5F8C\uFF0C\u6536\u5230\u7684\u5176\u4E2D\u4E00\u500B\u8B80\u8005\u56DE\u994B\u3002\u65BC\u662F\u6211\u5011\u5C31\u958B\u59CB\u601D\u8003\uFF0C\u9019\u5F35\u5716\u8868\u53EF\u4EE5\u5982\u4F55\u6B63\u78BA\u50B3\u9054\u6211\u60F3\u8AAA\u7684\u6545\u4E8B\u548C\u908F\u8F2F\u3002</p>
<h2>\u4E00\u3001\u5728\u5716\u8868\u6A19\u984C\u76F4\u63A5\u95E1\u8FF0\u6211\u8981\u5448\u73FE\u7684insight</h2>
<p>\u6211\u5728\u5716\u8868\u4E4B\u524D\uFF0C\u5176\u5BE6\u5DF2\u7D93\u653E\u4E00\u6BB5\u6587\u5B57\u8AAA\u660E\u6211\u7684\u908F\u8F2F\uFF1A</p>
<p>\u6574\u9AD4\u6558\u4E8B\u8108\u7D61\u975E\u5E38\u660E\u78BA\uFF0C\u56E0\u70BA\u672C\u571F\u6848\u4F8B\u589E\u52A0\uFF0C\u6240\u4EE5\u5927\u5BB6\u6436\u8457\u6253\u75AB\u82D7\u3002\u4F46\u5982\u4ECA\u7684\u7DB2\u8DEF\u4E16\u754C\uFF0C\u8CC7\u8A0A\u96A8\u6642\u53EF\u80FD\u88AB\u65B7\u7AE0\u53D6\u7FA9\uFF0C\u5982\u679C\u6709\u4EBA\u523B\u610F\u53EA\u4E0B\u8F09\u3001\u5206\u4EAB\u9019\u5F35\u5716\u8868\uFF0C\u90A3\u53EF\u80FD\u5C31\u6709\u8B80\u8005\u5012\u56E0\u70BA\u679C\u4E86\u3002</p>
<p>\u56E0\u6B64\uFF0C\u6211\u5728\u5716\u6A19\u76F4\u63A5\u544A\u8A34\u8B80\u8005\u6211\u7684insight\uFF0C\u6578\u64DA\u5716\u8868\u5247\u7528\u4F86\u4F50\u8B49\u9019\u500B\u6558\u4E8B\u3002</p>
${validate_component(Img, "Img").$$render($$result, {
    type: "side-by-side",
    srcLeft: "../../assets/article/202106061700/3-left.png",
    srcRight: "../../assets/article/202106061700/3-right.png"
  }, {}, { default: () => `\u6A19\u984C\u4FEE\u6539\u524D\u5F8C\u5C0D\u6BD4` })}
<p>\u57FA\u672C\u4E0A\u5230\u9019\u908A\uFF0C\u8B80\u8005\u5012\u56E0\u70BA\u679C\u7684\u53EF\u80FD\u6027\u5DF2\u7D93\u88AB\u5927\u5E45\u964D\u4F4E\u3002\u9019\u4E5F\u662F\u8FD1\u5E74\u65B0\u805E\u5716\u8868\u5F88\u6D41\u884C\u4E00\u7A2E\u505A\u6CD5\uFF0C\u56E0\u61C9\u8CC7\u8A0A\u788E\u7247\u5316\u3001\u8B80\u8005\u53EF\u80FD\u770B\u4E0D\u5B8C\u9577\u7BC7\u5831\u5C0E\u7684\u60C5\u5F62\uFF0C\u7528\u5438\u775B\u4E14\u5E36\u6709\u5B8C\u6574\u6558\u4E8B\u6A19\u984C\u7684\u5716\u8868\uFF0C\u964D\u4F4E\u8B80\u8005\u7406\u89E3\u7684\u6210\u672C\u3002</p>
<h2>\u4E8C\u3001\u660E\u78BA\u6A19\u793AY\u8EF8\u6578\u503C\u8207\u55AE\u4F4D</h2>
<p>\u8001\u5BE6\u8AAA\uFF0C\u6211\uFF08\u548C\u9019\u500B\u5E73\u53F0\u7684\u5176\u4ED6\u4F5C\u8005\u90FD\uFF09\u6C92\u6709\u5F88\u559C\u6B61\u96D9Y\u8EF8\uFF0C\u539F\u56E0\u6709\u5F88\u591A\uFF0C\u6587\u672B\u6703\u9644\u8CC7\u8A0A\u8996\u89BA\u5316\u5C08\u5BB6\u7684\u8A73\u7D30\u89E3\u91CB\u3002\u4F46\u7C21\u8A00\u4E4B\u5C31\u662F\u8907\u96DC\u3001\u7F8E\u611F\u4E0D\u8DB3\uFF0C\u8B80\u8005\u6C92\u8FA6\u6CD5\u5728\u7B2C\u4E00\u773C\u5206\u8FA8Bar Chart\u8DDFLine Chart\u4EE3\u8868\u4EC0\u9EBC\u3001\u5169\u908AY\u8EF8\u5C0D\u61C9\u5230\u54EA\u7B46\u6578\u64DA\uFF0C\u5C0D\u50CF\u6211\u5011\u9019\u7A2E\u5728\u8CC7\u8A0A\u7206\u70B8\u6642\u4EE3\u9577\u5927\u7684\u61F6\u60F0\u6B7B\u5C0F\u5B69\u4E0D\u5920\u76F4\u89C0\uFF08\uFF1F\uFF1F\uFF09</p>
<p>\u4F46\u70BA\u4EC0\u9EBC\u9019\u6B21\u9084\u6703\u9078\u64C7\u986F\u793A\u96D9Y\u8EF8\u5462\uFF1F\u539F\u56E0\u6709\u5169\u500B\uFF1A</p>`;
});
var _202106061700$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _202106061700,
  metadata: metadata$1
});
var metadata = {
  "title": "\u75AB\u60C5\u8996\u89BA\u5316\uFF1A\u6211\u5011\u5F9E\u4E0D\u540C\u5A92\u9AD4\u7684\u5716\u8868\u8A2D\u8A08\u5B78\u5230\u4EC0\u9EBC\uFF08\u6216\u4E0D\u5B78\u4EC0\u9EBC\uFF09",
  "author": "Ting-Ni Wu",
  "author_id": "tingni",
  "description": "\u53F0\u7063\u57282021\u5E745\u6708\u7206\u767C\u5927\u91CF\u672C\u571F\u78BA\u8A3A\u6848\u4F8B\uFF0C\u5A92\u9AD4\u7DCA\u8FFD\u75AB\u60C5\u767C\u5C55\uFF0C\u5404\u7A2E\u8996\u89BA\u5316\u5716\u8868\u4E5F\u7D1B\u7D1B\u51FA\u7C60\u3002\u8EAB\u70BA\u5C0D\u8CC7\u6599\u8996\u89BA\u5316\u6709\u8208\u8DA3\u7684\u4EBA\uFF0C\u770B\u5230\u5716\u8868\u7E3D\u662F\u5FCD\u4E0D\u4F4F\u60F3\u63A2\u7A76\u539F\u59CB\u8CC7\u6599\uFF0C\u4EE5\u53CA\u89C0\u5BDF\u5716\u8868\u8A2D\u8A08\u8005\u5982\u4F55\u5448\u73FE\u8CC7\u8A0A\u3002",
  "published_date": "2021-05-27T00:00:00.000Z",
  "updated_date": "2021-05-27T00:00:00.000Z",
  "tags": "covid-19,\u5716\u8868,\u75AB\u60C5\u5716\u8868,\u8CC7\u6599,\u8CC7\u6599\u8996\u89BA\u5316,\u75AB\u60C5\u8CC7\u6599",
  "category": "\u7D93\u9A57\u5206\u4EAB",
  "cover_image": "../../assets/article/202106200530/1.jpg"
};
var _202106200530 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Img, "Img").$$render($$result, {
    type: "cover",
    src: "../../assets/article/202106200530/1.jpg"
  }, {}, {})}
<p>\u53F0\u7063\u57282021\u5E745\u6708\u7206\u767C\u5927\u91CF\u672C\u571F\u78BA\u8A3A\u6848\u4F8B\uFF0C\u5A92\u9AD4\u7DCA\u8FFD\u75AB\u60C5\u767C\u5C55\uFF0C\u5404\u7A2E\u8996\u89BA\u5316\u5716\u8868\u4E5F\u7D1B\u7D1B\u51FA\u7C60\u3002\u8EAB\u70BA\u5C0D\u8CC7\u6599\u8996\u89BA\u5316\u6709\u8208\u8DA3\u7684\u4EBA\uFF0C\u770B\u5230\u5716\u8868\u7E3D\u662F\u5FCD\u4E0D\u4F4F\u60F3\u63A2\u7A76\u539F\u59CB\u8CC7\u6599\uFF0C\u4EE5\u53CA\u89C0\u5BDF\u5716\u8868\u8A2D\u8A08\u8005\u5982\u4F55\u5448\u73FE\u8CC7\u8A0A\u3002</p>
<p>\u6211\u5011\u700F\u89BD\u76EE\u524D\u53F0\u7063\u5A92\u9AD4\u88FD\u4F5C\u7684\u75AB\u60C5\u5716\u8868\u53CA\u5C08\u984C\u9801\u9762\uFF0C\u5E0C\u671B\u4E00\u63A2\u6211\u5011\u5C07\u78B0\u5230\u4EC0\u9EBC\u6A23\u7684\u75AB\u60C5\u6578\u5B57\uFF1F\u53EF\u4EE5\u7528\u4EC0\u9EBC\u6A23\u7684\u5716\u8868\u5448\u73FE\uFF1F\u6587\u672B\u4E5F\u5C07\u5EF6\u4F38\u8A0E\u8AD6\uFF0C\u9019\u4E9B\u5716\u8868\u88E1\u9762\u6709\u54EA\u4E9B\u79D8\u5BC6\uFF1F\u8996\u89BA\u5316\u7684\u904E\u7A0B\u6703\u9047\u5230\u54EA\u4E9B\u56F0\u96E3\uFF1F</p>
<p>\uFF08\u5927\u91CF\u5716\u8868\u9810\u8B66\uFF01\u6B61\u8FCE\u5148\u62CD\u624B\u6216\u6536\u85CF\u672C\u6587\uFF0C\u6709\u529B\u6C23\u6642\u518D\u7E7C\u7E8C\u5F80\u4E0B\u95B1\u8B80\u{1F606}\uFF09</p>
<h2>\u{1F062} 1 \u{1F062} \u4FDD\u6301\u5F48\u6027\uFF1A\u8CC7\u6599\u6709\u54EA\u4E9B\u7279\u5FB5\uFF1F\u600E\u9EBC\u6311\u9078\u5408\u9069\u8996\u89BA\u5316\u65B9\u6CD5\uFF1F</h2>
<p>\u6BCF\u5929\u75AB\u60C5\u8A18\u8005\u6703\u9664\u4E86\u300C\u795E\u79D8\u6578\u5B57\u300D\u63ED\u66C9\u6642\u9593\uFF0C\u6307\u63EE\u4E2D\u5FC3\u5F9E5\u670822\u65E5\u958B\u59CB\u516C\u5E03\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\uFF0C\u5C07\u61C9\u7D71\u8A08\u800C\u672A\u5217\u5165\u7684\u6848\u4F8B\u6578\uFF0C\u6309\u7167\u5176\u78BA\u8A3A\u65E5\u671F\u56DE\u6EAF\u3002</p>
<p>\u6D88\u606F\u4E00\u51FA\uFF0C\u9664\u4E86\u8F3F\u8AD6\u5C0D\u300C\u6821\u6B63\u56DE\u6B78\u300D\u540D\u8A5E\u7684\u6D88\u9063\uFF0C\u7FA4\u7D44\u5167\u50B3\u4F86\u66F4\u591A\u7DCA\u76EF\u75AB\u60C5\u6578\u5B57\u7684\u5DE5\u7A0B\u5E2B\u3001\u8A2D\u8A08\u5E2B\u54C0\u568E \u2014 \u2014 \u53EA\u8981\u6307\u63EE\u4E2D\u5FC3\u6EFE\u52D5\u4FEE\u6B63\uFF0C\u8CA0\u8CAC\u8CC7\u8A0A\u5716\u8868\u8A2D\u8A08\u8207\u767C\u4F48\u7684\u4EBA\u5C31\u8981\u8DDF\u8457\u4FEE\u6B63\u8CC7\u6599\u6E90\u3002\uFF08\u554F\u984C\u4E0D\u50C5\u65BC\u6B64\uFF0C\u6307\u63EE\u4E2D\u5FC3\u7576\u6642\u4E26\u672A\u540C\u6B65\u516C\u5E03\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\u8A73\u7D30\u8CC7\u6599\uFF0C\u4F8B\u5982\u7E23\u5E02\u5225\u22EF\u22EF\uFF09</p>
<p>\u66F4\u91CD\u8981\u7684\u662F\uFF0C\u8A72\u5982\u4F55\u5448\u73FE\u300C\u6821\u6B63\u56DE\u6B78\u300D\u5F8C\u7684\u6848\u4F8B\u6578\uFF1F\u600E\u9EBC\u5728\u63D0\u4F9B\u8A73\u5BE6\u6578\u5B57\u7684\u72C0\u6CC1\u4E0B\uFF0C\u5E6B\u52A9\u8B80\u8005\u7406\u89E3\u75AB\u60C5\u8DA8\u52E2\uFF1F\u6211\u5011\u53EF\u4EE5\u5F9E\u300A\u5831\u5C0E\u8005\u300B\u7684\u5716\u8868\u7ABA\u898B\u4ED6\u5011\u5982\u4F55\u63A5\u62DB\uFF1A</p>
<p><strong>5/21</strong>\uFF5C\u6307\u63EE\u4E2D\u5FC3\u5C1A\u672A\u958B\u59CB\u516C\u5E03\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\uFF0C\u300A\u5831\u5C0E\u8005\u300B\u4EE5\u5730\u5716\u65B9\u5F0F\u5448\u73FE\u75AB\u60C5\u78BA\u8A3A\u6578\u5206\u4F48</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202106200530/2.jpg",
    note: "\u5716\u7247\u53D6\u81EA\uFF0F\u300A\u5831\u5C0E\u8005\u300B\u81C9\u66F8\u7C89\u7D72\u5C08\u9801"
  }, {}, {})}
<p><strong>5/22</strong>\uFF5C\u6307\u63EE\u4E2D\u5FC3\u7B2C\u4E00\u6B21\u516C\u5E03\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\uFF0C\u300A\u5831\u5C0E\u8005\u300B\u9664\u4E86\u75AB\u60C5\u5730\u5716\uFF0C\u65B0\u589E\u6BCF\u65E5\u6821\u6B63\u56DE\u6B78\u75C5\u4F8B\u8207\u7576\u65E5\u516C\u5E03\u78BA\u8A3A\u6578\u7D2F\u8A08\u5806\u758A\u76F4\u65B9\u5716</p>
${validate_component(Img, "Img").$$render($$result, {
    src: "../../assets/article/202106200530/3.png"
  }, {}, {})}
<p>\u5F9E\u9019\u500B\u6848\u4F8B\u4E2D\uFF0C\u9664\u4E86\u53EF\u898B\u8CC7\u6599\u8655\u7406\u8005\u9762\u5C0D\u8CC7\u6599\u7279\u5FB5\u8B8A\u5316\u7684\u5FEB\u901F\u53CD\u61C9\u80FD\u529B\uFF0C\u6211\u5011\u4E5F\u89C0\u5BDF\u5230\u8A2D\u8A08\u8005\u7684\u5DE7\u601D\uFF1A\u5C07\u5806\u758A\u76F4\u65B9\u5716\u4E0A\u7684\u8CC7\u8A0A\u5F9E<code>\u6BCF\u65E5\u65B0\u589E\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\u6578</code> + \u6307\u63EE\u4E2D\u5FC3\u7576\u65E5\u516C\u5E03\u78BA\u8A3A\u6578\u6539\u6210<code>\u7E3D\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\u6578 + \u6307\u63EE\u4E2D\u5FC3\u7576\u65E5\u516C\u5E03\u78BA\u8A3A\u6578</code> \uFF0C\u4E26\u65B0\u589E7\u65E5\u5E73\u5747\u65B0\u589E\u78BA\u8A3A\u6578\u7684\u8DA8\u52E2\u7DDA\u3002</p>
<p>\u6211\u5011\u8A8D\u70BA\u65B0\u7248\u7684\u5716\u8868\u89E3\u6C7A\u5169\u500B\u554F\u984C\uFF1A</p>
<ul><li><p>\u907F\u514D\u5806\u758A\u76F4\u65B9\u5716\u8CC7\u8A0A\u904E\u5EA6\u8907\u96DC\uFF1A\u5728\u539F\u5716\u8868\u4E2D\uFF0C\u6BCF\u65E5\u65B0\u589E\u7684\u6848\u4F8B\u6578\u90FD\u9700\u8981\u4E00\u500B\u984F\u8272\uFF0C\u82E5\u8981\u7DAD\u6301\u6BCF\u65E5\u8A73\u5BE6\u5448\u73FE\u65B0\u589E\u300C\u6821\u6B63\u56DE\u6B78\u300D\u6848\u4F8B\u6578\uFF0C\u53C8\u8981\u5C07\u6BCF\u65E5\u7684\u8CC7\u8A0A\u505A\u51FA\u5340\u9694\uFF0C\u5047\u8A2D\u6307\u63EE\u4E2D\u5FC3\u9023\u7E8C100\u5929\u516C\u5E03\u6821\u6B63\u56DE\u6B78\u6578\u5B57\uFF0C\u8A2D\u8A08\u5E2B\u8272\u7968\u53EF\u80FD\u6703\u4E0D\u5920\u7528</p></li>
<li><p>\u4EE57\u65E5\u5E73\u5747\u503C\u4F86\u5448\u73FE\u75AB\u60C5\u8B8A\u5316\u8DA8\u52E2\uFF0C\u964D\u4F4E\u76F4\u65B9\u5716\u7684\u9AD8\u4F4E\u8C37\u5C0D\u8996\u89BA\u5224\u65B7\u6BCF\u65E5\u8B8A\u5316\u7684\u963B\u7919\uFF1A7\u65E5\u5E73\u5747\u503C\u5176\u5BE6\u4E5F\u53EF\u4EE5\u662F3\u65E5\u300110\u65E5\u621614\u65E5\uFF0C\u7B97\u6CD5\u8DDF\u5747\u7DDA\u7684\u4E00\u6A23\uFF0C\u6709\u5728\u770B\u76E4\u7684\u670B\u53CB\u61C9\u8A72\u4E0D\u96E3\u7406\u89E3\uFF0C\u800C\u6307\u63EE\u4E2D\u5FC3\u6BCF\u6B21\u5E7E\u4E4E\u90FD\u6821\u6B63\u524D\u4E94\u5929\u4EE5\u4E0A\u7684\u6848\u4F8B\uFF0C\u56E0\u6B64\u9019\u88E1\u9078\u75287\u5929\u5728\u76EE\u524D\u770B\u4F86\u4E5F\u8A31\u662F\u76F8\u5C0D\u9069\u5408\u7684\u6642\u9593\u5340\u9593\u3002</p></li></ul>
<p>\u4EE5\u4E0B\u85C9\u7531\u5E7E\u500B\u7BC4\u4F8B\u4F86\u89C0\u5BDF\u5716\u8868\u8A2D\u8A08\u8005\u5982\u4F55\u5F15\u5C0E\u95B1\u8B80\uFF1A</p>
<ul><li>\u900F\u904E\u984F\u8272\u8207\u7269\u4EF6\u5927\u5C0F\u4F86\u5F15\u5C0E\uFF1A</li></ul>
${validate_component(Img, "Img").$$render($$result, {
    type: "side-by-side",
    srcRight: "../../assets/article/202106200530/4-left.png",
    srcLeft: "../../assets/article/202106200530/4-right.png"
  }, {}, {
    default: () => `\u5DE6\u5716\u53D6\u81EA\uFF0F\u300A\u7AEF\u50B3\u5A92\u300B\u7DB2\u7AD9\u3001\u53F3\u5716\u53D6\u81EA\uFF0F\u300A\u516C\u8996\u65B0\u805E\u7DB2\u300B\u81C9\u66F8\u7C89\u7D72\u5C08\u9801`
  })}
<p>\u5F9E\u5716\u8868\u985E\u578B\u4F86\u8AC7\uFF0C\u5730\u5716\uFF0F\u9762\u91CF\u5716\u4E26\u975E\u7528\u4F86\u76F4\u63A5\u6BD4\u8F03\u6578\u5B57\u5927\u5C0F\uFF0C\u800C\u8F03\u5E38\u7D50\u5408\u4EBA\u53E3\u7279\u5FB5\u8CC7\u6599\uFF0C\u4F8B\u5982\u5C45\u4F4F\u4EBA\u53E3\u7B49\uFF0C\u8A0E\u8AD6\u5404\u5730\u67D0\u8CC7\u6599\u5206\u4F48\u5BC6\u96C6\u7A0B\u5EA6\u3002</p>
<p>\u4E0D\u904E\u76EE\u524D\u53F0\u7063\u6848\u4F8B\u6578\u76F8\u5C0D\u7E3D\u4EBA\u53E3\u6578\u8F03\u5C0F\uFF0C\u82E5\u4EE5\u4EBA\u53E3\u5BC6\u5EA6\u5448\u73FE\uFF0C\u5F88\u96E3\u76F4\u89C0\u770B\u51FA\u75AB\u60C5\u56B4\u91CD\u7A0B\u5EA6\uFF1B\u518D\u52A0\u4E0A\u8B80\u8005\u6700\u9700\u8981\u7684\u6578\u5B57\u53EF\u80FD\u662F\u78BA\u5207\u78BA\u8A3A\u4EBA\u6578\uFF0C\u800C\u975E\u7576\u5730\u78BA\u8A3A\u5BC6\u5EA6\uFF0C\u56E0\u6B64\u76EE\u524D\u53EF\u80FD\u9084\u7528\u4E0D\u4E0A\u9762\u91CF\u5716\u3002</p>
<p>\u82E5\u8981\u5448\u73FE\u75AB\u60C5\u56B4\u91CD\u7A0B\u5EA6\uFF0C\u75AB\u60C5\u5730\u5716\u4E26\u4E0D\u80FD\u78BA\u5BE6\u9054\u5230\u6BD4\u8F03\u78BA\u8A3A\u6578\u591A\u5BE1\u7684\u76EE\u7684\uFF0C\u8D8A\u7C21\u55AE\u7684\u5716\u8868\u4E5F\u8A31\u624D\u662F\u8F03\u5408\u9069\u7684\u5448\u73FE\u65B9\u5F0F\uFF0C\u4F8B\u5982\u76F4\u63A5\u63D0\u4F9B\u75AB\u60C5\u6578\u5B57\u8868\u683C\uFF1A</p>
<p>\u5F9E\u53F0\u5317\u5E02\u653F\u5E9C\u63D0\u4F9B\u7684\u5716\u5361\uFF0C\u4E5F\u53EF\u4EE5\u770B\u51FA\u82E5\u8981\u76F4\u63A5\u770B\u51FA\u75AB\u60C5\u71B1\u5340\uFF0C\u8868\u683C\u8CC7\u8A0A\u6BD4\u5730\u5716\u6E05\u695A\u5F88\u591A\u3002</p>
${validate_component(Img, "Img").$$render($$result, {
    type: "side-by-side",
    srcLeft: "../../assets/article/202106200530/5-left.jpg",
    srcRight: "../../assets/article/202106200530/5-right.jpg"
  }, {}, {
    default: () => `\u5716\u7247\u53D6\u81EA\uFF0F<a href="${"https://www.google.com"}">\u53F0\u5317\u5E02\u885B\u751F\u5C40\u7DB2\u7AD9</a>`
  })}
<p>\u770B\u8457\u6EFE\u52D5\u4FEE\u6B63\u7684\u75AB\u60C5\u6578\u5B57\uFF0C\u4EE5\u53CA\u6307\u63EE\u5B98\u9673\u6642\u4E2D\u624B\u4E2D\u7684\u8CC7\u6599\u5716\u5361\u8D8A\u4F86\u8D8A\u591A\uFF0C\u6211\u5011\u60F3\u7684\u662F\uFF1A\u75AB\u60C5\u8CC7\u6599\u7E3D\u662F\u770B\u5F97\u5230\u3001\u62FF\u4E0D\u5230\u3002\u82E5\u5B98\u65B9\u80FD\u62FF\u51FA\u76F8\u95DC\u7D71\u8A08\u5716\u8868\uFF0C\u4EE3\u8868\u5DF2\u9032\u884C\u8CC7\u6599\u7D71\u6574\uFF0C\u7136\u800C\u9019\u4E9B\u8CC7\u6599\u537B\u4ECD\u672A\u80FD\u70BA\u8CC7\u6599\u5206\u6790\u8005\u6240\u7528\u3002</p>`;
});
var _202106200530$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _202106200530,
  metadata
});
async function load({ page, fetch: fetch3 }) {
  const res = await fetch3(`/article.json?author=${page.params.slug}`);
  const resAuthor = await fetch3("/assets/author/authors.json").then((d2) => d2.json());
  if (res.ok) {
    return {
      props: {
        data: await res.json(),
        author: await resAuthor.filter((d2) => d2.id === page.params.slug)[0]
      }
    };
  }
  return { status: res.status, error: new Error() };
}
var U5Bslugu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props, { author } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  if ($$props.author === void 0 && $$bindings.author && author !== void 0)
    $$bindings.author(author);
  return `${validate_component(ArticleList, "ArticleList").$$render($$result, { articleData: data, title: author.name }, {}, {})}`;
});
var _slug_ = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": U5Bslugu5D,
  load
});
var css = {
  code: "p.svelte-1p5z9pc{text-align:center}",
  map: '{"version":3,"file":"about.svelte","sources":["about.svelte"],"sourcesContent":["<style>\\n  p {\\n    text-align: center;\\n  }</style>\\n\\n<p>\u0295\u2022\u0361\u1D25\u2022\u0294 \u95DC\u65BC\u6211\u5011 \u0295\u2022\u0361\u1D25\u2022\u0294</p>\\n"],"names":[],"mappings":"AACE,CAAC,eAAC,CAAC,AACD,UAAU,CAAE,MAAM,AACpB,CAAC"}'
};
var About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<p class="${"svelte-1p5z9pc"}">\u0295\u2022\u0361\u1D25\u2022\u0294 \u95DC\u65BC\u6211\u5011 \u0295\u2022\u0361\u1D25\u2022\u0294</p>`;
});
var about = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About
});

// .svelte-kit/vercel/entry.js
init();
var entry_default = async (req, res) => {
  const { pathname, searchParams } = new URL(req.url || "", "http://localhost");
  let body;
  try {
    body = await getRawBody(req);
  } catch (err) {
    res.statusCode = err.status || 400;
    return res.end(err.reason || "Invalid request body");
  }
  const rendered = await render({
    method: req.method,
    headers: req.headers,
    path: pathname,
    query: searchParams,
    rawBody: body
  });
  if (rendered) {
    const { status, headers, body: body2 } = rendered;
    return res.writeHead(status, headers).end(body2);
  }
  return res.writeHead(404).end();
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
