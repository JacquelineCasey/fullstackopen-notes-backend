
const palindrome = require('../utils/for_testing').palindrome;


/* Each test is defined with the test command. The first param is a description.
 * The second param is the function that the test runs. */
test('palindrome of a', () => {
    const result = palindrome('a');

    // expect wraps a value with a bunch of functions that can be used to check correctness. (Ex: toBe())
    expect(result).toBe('a');
});

test('palindrome of react', () => {
    const result = palindrome('react');

    expect(result).toBe('tcaer');
});

test('palindrome of releveler', () => {
    const result = palindrome('releveler');

    expect(result).toBe('releveler');
});
