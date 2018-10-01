#!/usr/local/bin/node
const {argv, exit} = process;
const readline = require('readline');
const {log, error} = console;
const {isValidPassword} = require('./functions');
const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

if (argv.length !== 3)
{
    error('参数数量错误。使用方法: main.js {最初密码}');
    exit(1);
}
let oldPassword = argv[2];
log(`目前的密码是: ${oldPassword}, 请输入新密码: `);
input.on('line', (newPassword) =>
{
    const result = isValidPassword(oldPassword, newPassword);
    if (result)
    {
        log('新密码合法');
        oldPassword = newPassword;
    }
    else
    {
        error('新密码不合法');
    }
    log(`目前的密码是: ${oldPassword}, 请输入新密码: `);
});
