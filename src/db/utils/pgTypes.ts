import { types } from "pg";

/**
 * PostgreSQL type parsers
 *
 * This file customizes how the `pg` driver parses values coming from the database.
 * Import it *before* initializing your Kysely instance.
 */

// --------------------
// 🔢 BIGINT (int8) → number
// --------------------
// OID 20 = int8
types.setTypeParser(20, (val) => (val === null ? null : Number(val)));

// --------------------
// NUMERIC / DECIMAL → number
// --------------------
// OID 1700 = numeric
// Safe for prices, rates, etc. (e.g. numeric(10,2))
// NOTE: If you ever store high-precision decimals, use a library like decimal.js instead.
types.setTypeParser(1700, (val) => (val === null ? null : parseFloat(val)));

// --------------------
// TIMESTAMP (without time zone) → Date
// --------------------
// OID 1114 = timestamp
types.setTypeParser(1114, (val) => (val === null ? null : new Date(val + "Z")));

// --------------------
// TIMESTAMPTZ (with time zone) → Date
// --------------------
// OID 1184 = timestamptz
types.setTypeParser(1184, (val) => (val === null ? null : new Date(val)));

// --------------------
// Optional: FLOAT8 → number (just to be consistent)
// --------------------
// OID 701 = float8 / double precision
types.setTypeParser(701, (val) => (val === null ? null : parseFloat(val)));

// --------------------
// Example: JSONB (3802) → JSON.parse(val)
// --------------------
// types.setTypeParser(3802, (val) => (val === null ? null : JSON.parse(val)));
