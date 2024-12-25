import { describe, test, expect } from "bun:test";
import { Event } from "@ovo-apps/api/event";

describe("api", () => {
  test("Event", () => {
    expect(new Event()).toBeInstanceOf(Event);
  });
});
