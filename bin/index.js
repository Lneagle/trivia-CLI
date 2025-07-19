#!/usr/bin/env node

import { questions } from "../src/lib/questions.js";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

let responses = [];

async function displayQuestion() {
    let currentQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1); //chooses a random question from the list
    currentQuestion = currentQuestion[0];
    const userChoice = await select({ //Displays multiple-choice question and waits for user to answer
        message: currentQuestion.question,
        choices: currentQuestion.options.map((option) => ({ name: option, value: option }))
    }); 

    responses.push({questionText: currentQuestion.question, answer: currentQuestion.answer, correct: userChoice === currentQuestion.answer ? true : false}); //stores question, correct answer, and whether or not user answered correctly for feedback at the end

    if (questions.length > 0 && timer > 0) { //if there are questions left and time has not run out, show the time left and display another question
        console.log(chalk.yellow(`\n${timer} seconds left!`));
        displayQuestion();
    } else {
        if (timer > 0) { //time is left but all questions have been answered
            console.log(chalk.yellow("\nYou've answered all the questions!"));
            clearInterval(timerId);
        } else { //time has run out
            console.log (chalk.yellow("Time's up!"));
        }
        displayFeedback();
    }
}

function displayFeedback() {
    console.log(chalk.blue(`\nGreat game! You answered ${responses.length} questions.  Let's see how you did.`));
    let numCorrect = 0;

    responses.forEach((response) => { //Display each question answered, whether the user answered correctly or not, and the correct answer
        console.log(response.questionText);
        if (response.correct) {
            console.log(chalk.green(`Correct! The answer was ${response.answer}`));
            numCorrect++; //Keep a count of correct answers
        } else {
            console.log(chalk.red(`Sorry! The answer was ${response.answer}`));
        }
    });
    console.log(chalk.blue(`\nYou got ${numCorrect} out of ${responses.length} correct!`)); //Display number correct
}

let timer = 60; //One minute timer
let timerId;

const action = await select({ //Main menu
    message: "Welcome to Trivia CLI!",
    choices: [
        { name: "Start Game", value: "start" },
        { name: "Quit", value: "quit" }
    ]
});

switch (action) {
    case "start":
        console.log(chalk.blue("\nAnswer as many questions as you can in 1 minute.\n"));
        timerId = setInterval(() => { //Initialize the timer
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