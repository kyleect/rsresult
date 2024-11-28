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
import * as RsResult from "rsresult";

const success: RsResult.Result<number> = ok(123);

assert(RsResult.isOk(success)); // passes
assert(RsResult.isErr(success)); // fails

const mappedSuccess = RsResult.map(success, (value) => value * 2);

assert(RsResult.unwrap(mappedSuccess) === 246);

const failed: Result<never, string> = RsResult.err("Error message");

assert(RsResult.isErr(failed)); // passes
assert(RsResult.isOk(failed)); // fails

assert(RsResult.unwrap(failed) === 246); // Throws
```
