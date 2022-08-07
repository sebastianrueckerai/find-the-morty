import { fisherYatesShuffle } from "./randomShuffle";

test("randomly shuffels an array", () => {
  const unshuffeledArray = Array.from(Array(100).keys());
  const shuffeledArray = fisherYatesShuffle(Array.from(Array(100).keys()));
  // Array length should be unchanged
  expect(shuffeledArray.length === unshuffeledArray.length).toBeTruthy();
  // Array values should equal
  expect(shuffeledArray).toEqual(expect.arrayContaining(unshuffeledArray));
  // Array indices should differ (*)
  expect(
    shuffeledArray
      .map((element, idx) => element !== unshuffeledArray[idx])
      .some((e) => e)
  ).toBeTruthy();
  // * There is a small chance that this test may fail before the universe ends
  // ...because the shuffeled array might look like the original!
});
