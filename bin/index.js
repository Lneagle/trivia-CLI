#!usr/bin/env node

import { questions } from "../src/lib/Questions.js";

let currentQuestion = questions.splice(Math.floor(Math.random() * questions.length), 1);