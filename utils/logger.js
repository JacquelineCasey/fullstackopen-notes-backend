/* Why seperate out logging to one file? Then, if we want to change the way all
 * logging works, it is easy. In the future, we may want to use a dedicated
 * logging service. */

const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.log(...params);
    }
};

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
        console.error(...params);
    }
};


module.exports = {
    info, error
};
