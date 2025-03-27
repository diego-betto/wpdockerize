#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import {resolve} from 'path';

const prompts = [{
    type: 'input',
    name: 'GENERATE_DOCKER_PREFIX',
    message: 'Docker prefix (only letters, numbers and "-"), will became for example <prefix>-db, <prefix>-wordpress, etc.',
    validate: function (value) {
        const pass = value.match(/^[a-z0-9-]+$/);
        if (pass) {
            return true;
        }

        return 'Please enter a valid prefix (only letters, numbers and "-")';
    }
},
{
    type: 'number',
    name: 'GENERATE_MYSQL_EXPOSE_PORT',
    message: 'MySQL port to expose, default 3306',
    default: 3306,
},
{
    type: 'input',
    name: 'GENERATE_MYSQL_DATABASE',
    message: 'MySQL database, default wp',
    default: 'wp',
},
{
    type: 'input',
    name: 'GENERATE_MYSQL_USER',
    message: 'MySQL WordPress user, default wp',
    default: 'wp',
},
{
    type: 'input',
    name: 'GENERATE_MYSQL_PASSWORD',
    message: 'MySQL WordPress password, default wp',
    default: 'wp',
},
{
    type: 'input',
    name: 'GENERATE_MYSQL_ROOT_PASSWORD',
    message: 'MySQL root password, default wp',
    default: 'wp',
},
{
    type: 'number',
    name: 'GENERATE_MAILHOG_PORT',
    message: 'Mailhog port to expose, default 8025',
    default: 8025,
},
{
    type: 'number',
    name: 'GENERATE_WEB_PORT',
    message: 'Website port to expose, default 80',
    default: 80,
},
];

process.on('uncaughtException', (error) => {
    if (error instanceof Error && error.name === 'ExitPromptError') {
        console.log('👋 until next time!');
    } else {
        throw error;
    }
});

inquirer
    .prompt(prompts)
    .then((inputs) => {
        fs.readFile(resolve(import.meta.dirname, './tpl/docker-compose.yml'), 'utf8', (err, data) => {
            if (err) {
                return console.error('Errore nella lettura del file:', err);
            }

            let updatedData = data;
            for (const [key, value] of Object.entries(inputs)) {
                updatedData = updatedData.replace(new RegExp(`${key}`, 'g'), `${value}`);
            }

            fs.writeFile(`docker-compose.yml`, updatedData, 'utf8', (err) => {
                if (err) {
                    return console.error('Errore nella scrittura del file:', err);
                }
            });
        });

        console.info(`\n\nDone! Now you can run 'docker-compose up -d' to start the services. Happy coding 😃`);
    });