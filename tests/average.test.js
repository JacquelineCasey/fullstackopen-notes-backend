
const average = require('../utils/for_testing').average;

// This describe block can be used to group similar tests.
// They also enable shared setup and teardown before and after a bunch of tests.
describe('average', () => {
    test('of one value is the value itself', () => {
        expect(average([1])).toBe(1); // Also note the compactness here.
    });

    test('of many is calculated right', () => {
        expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
    });

    test('of empty array is zero', () => {
        expect(average([])).toBe(0);
    });
});
