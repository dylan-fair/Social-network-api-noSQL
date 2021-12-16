const dayjs = require('dayjs');
const dateFormater = function(date) {
    return dayjs(date).format('MMM/DD/YYYY');
}

module.exports = dateFormater;