const {REGEX: {LETTER, NUMBER, OTHER}} = require('./constants');

isValidPassword.oldPasswordSet = new Set();

function isValidPassword(oldPassword, newPassword)
{
    if (newPassword.search(LETTER) !== -1 && newPassword.search(NUMBER) !== -1 && newPassword.search(OTHER) !== -1)
    {
        for (const char of oldPassword)
        {
            isValidPassword.oldPasswordSet.add(char);
        }
        const newPasswordSet = new Set(newPassword);
        let sameCharNum = 0;
        for (const char of newPasswordSet)
        {
            if (isValidPassword.oldPasswordSet.has(char))
            {
                sameCharNum++;
            }
            if (sameCharNum > 3)
            {
                break;
            }
        }
        return sameCharNum <= 3;
    }
    else
    {
        return false;
    }
}

module.exports = {
    isValidPassword
};
