# rsresult

A library to work with [serde_json](https://github.com/serde-rs/json) serialized `Result` objects

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

assert(unwrap(failed) === 246); // Throws
```
