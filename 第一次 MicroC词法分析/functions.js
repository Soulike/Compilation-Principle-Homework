const fs = require('fs');

async function readFileAsync(path, options = {})
{
    return new Promise(async (resolve, reject) =>
    {
        fs.readFile(path, options, (err, data) =>
        {
            if (err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    });
}

function generateRegex(patternArray)
{
    let regex = '';
    patternArray.forEach((pattern) =>
    {
        if (['+', '*', '?', '.', '(', ')', '[', ']', '{', '}', '|', '^', '$', '\\', '/'].includes(pattern))
        {
            regex += `\\${pattern}|`;
        }
        else
        {
            regex += `${pattern}|`;
        }

    });
    if (regex.length !== 0)
    {
        regex = regex.slice(0, -1);
    }
    return new RegExp(regex, 'g');
}

module.exports = {
    readFileAsync,
    generateRegex
};
