#!usr/bin/env node

import { questions } from "../src/lib/Questions.js";
/* let questions = [
    {
        question: "What is the term for a group of flamingos?",
        options: ["Murder", "Flamboyance", "Herd", "Gaggle"],
        answer: "Flamboyance"
    }
];*/

import { select } from "@inquirer/prompts";
import chalk from "chalk";

let responses = [];

async function displayQuestion() {
    let currentQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1);
    currentQuestion = currentQuestion[0];
    const userChoice = await select({ 
        message: currentQuestion.question,
        choices: currentQuestion.options.map((option) => ({ name: option, value: option }))
    });
    responses.push({questionText: currentQuestion.question, answer: currentQuestion.answer, correct: userChoice === currentQuestion.answer ? true : false});
    if (questions.length > 0 && timer > 0) {
        console.log(`${timer} seconds left!`);
        displayQuestion();
    } else {
        if (timer > 0) {
            console.log("No more questions!");
            clearInterval(timerId);
        } else {
            console.log ("Time's up!");
        }
        displayFeedback();
    }
}

function displayFeedback() {
    console.log(`Great game! You answered ${responses.length} questions.  Let's see how you did.`);
    let numCorrect = 0;
    responses.forEach((response) => {
        console.log(response.questionText);
        if (response.correct) {
            console.log(chalk.green(`Correct! The answer was ${response.answer}`));
            numCorrect++;
        } else {
            console.log(chalk.red(`Sorry! The answer was ${response.answer}`));
        }
    });
    console.log(`You got ${numCorrect} out of ${responses.length} correct!`)
}

let timer = 60;
let timerId;

const action = await select({
    message: "Main Menu",
    choices: [
        { name: "Start Game", value: "start" },
        { name: "Quit", value: "quit" }
    ]
});

switch (action) {
    case "start":
        console.log("Welcome to Trivia CLI! Answer as many questions as you can in 1 minute.")
        timerId = setInterval(() => {
            if (timer > 0) {
                timer--;
            } else {
                clearInterval(timerId);
            }
        }, 1000);
        await displayQuestion();
        break;
    case "quit":
        console.log("Goodbye!");
        process.exit(0);
}

//program.parse(process.argv);