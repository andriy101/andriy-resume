#!/usr/bin/env node
'use strict';

const names = require('./ascii-art');

const inquirer = require('inquirer');
const chalk = require('chalk');

const title = chalk.bold.green;
const response = chalk.italic.green;

const resume = require('./resume.json');


const resumePrompts = {
  type: 'list',
  name: 'resumeOptions',
  message: 'What would do you like to discover about me?',
  choices: [...Object.keys(resume), 'Exit']
};

function main() {
  const greeting = 'Hello, my name is Andriy Malish, welcome to my resume\n';
  if (process.stdout.columns > 111) {
    let index = 0;
    const interval = setInterval(_ => {
      console.clear(); 
      console.log(chalk.yellow(names[++index % 2]));

      if (index === 14) {
        clearInterval(interval);
        console.log(greeting);
        resumeHandler();
      }
    }, 200);
  }
  else {
    console.clear(); 
    console.log(greeting);
    resumeHandler();
  }
}

function resumeHandler() {
  inquirer.prompt(resumePrompts).then(answer => {
    if (answer.resumeOptions == 'Exit') {
      return;
    }
    const option = answer.resumeOptions;

    console.log(response('--------------------------------------'));

    resume[`${option}`].forEach((info, ind) => {
      if (typeof info === 'string') {
        console.log(response(`  ${info}`));
      }
      else {
        Object.values(info).forEach((value, ind) => {
          if (ind) {
            console.log(response(`    ${value}`));
          }
          else {
            console.log(title(`  ${value.padEnd(38)}`));
          }
        });
        ind !== resume[`${option}`].length - 1 && console.log(response('--------------------------------------'));
      }
    });
    
    console.log(response('--------------------------------------'));

    inquirer
      .prompt({
        type: 'list',
        name: 'exitBack',
        message: 'Go back or Exit?',
        choices: ['Back', 'Exit']
      })
      .then(choice => {
        if (choice.exitBack == 'Back') {
          resumeHandler();
        } else {
          return;
        }
      });
  });
}

main();