# rsresult

A library to work with [serde_json](https://github.com/serde-rs/json) serialized `Result` objects. This library provides functions for creating, checking, and manipulating results, simplifying error handling in your JavaScript projects.

## Installation

```bash
npm install rsresult
```

## Usage

```typescript
import assert from "node:assert";
import * as RsResult from "rsresult";

// Successful Result
const success: RsResult.Result<number, never> = RsResult.ok(123);

assert(RsResult.isOk(success)); // passes
assert(RsResult.isErr(success)); // fails

// Map successful results
const mappedSuccess = RsResult.map(success, (value) => value * 2);

assert(RsResult.unwrap(mappedSuccess) === 246);

// Failed Result
const failed: RsResult.Result<never, string> = RsResult.err("Error message");

// Map error results
const mappedError = RsResult.mapErr(failed, (value) => `Error: ${value}`);
assert(RsResult.unwrap(mappedError) === "Error: Error message"); // This assertion will pass

assert(RsResult.isErr(failed)); // passes
assert(RsResult.isOk(failed)); // fails

try {
  RsResult.unwrap(failed); // Throws an error
} catch (error) {
  assert(error instanceof Error); //This assertion will pass
  assert(error.message.includes("Unwrapping an error result")); //This assertion will pass
}

//Example using ifOkOr
RsResult.ifOk(success, (value) => console.log("Success:", value));

RsResult.ifOkOr(
  failed,
  (value) => console.log("Success:", value),
  (error) => console.error("Error:", error)
);
```

## License

MIT
