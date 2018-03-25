const crypto = require('crypto');

module.exports = ({username, password}) => {
    const key = process.env.HASH_SECRET;
    const hash = crypto.createHmac('sha512', key)
        .update(username)
        .digest('hex')
        .toString()
        .slice(0, 4);
    return password === hash;
};
