// third party modules
export { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";
export type { DotenvConfig } from "https://deno.land/std@0.167.0/dotenv/mod.ts";
export { compress as brotli_compress } from "https://deno.land/x/brotli@0.1.7/mod.ts";
export { deflate, gzip } from "https://deno.land/x/compress@v0.4.5/mod.ts";
export {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.31.1/mod.ts";

import etag from "https://cdn.skypack.dev/etag";
export { etag };

// std modules
export {
  join,
  parse,
  resolve,
} from "https://deno.land/std@0.167.0/path/mod.ts";
export type { ParsedPath } from "https://deno.land/std@0.167.0/path/mod.ts";
export { readRange } from "https://deno.land/std@0.167.0/io/files.ts";
