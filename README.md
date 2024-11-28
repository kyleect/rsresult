# rsresult

A library for working with Rust `Result` serialized to JSON using serde_json.

```json
{
  "Ok": 123
}
```

```json
{
  "Err": "Error message"
}
```

## Installation

```shell
npm install rsresult
```

## Usage

```typescript
import assert from "node:assert";
import { ok, err, isOk, isErr, map, unwrap, type Result } from "rsresult";

const success: Result<number> = ok(123);

assert(isOk(success)); // passes
assert(isErr(success)); // fails

const mappedSuccess = map(success, (value) => value * 2);

assert(unwrap(mappedSuccess) === 246);

const failed: Result<never, string> = err("Error message");

assert(isErr(failed)); // passes
assert(isOk(failed)); // fails
```
