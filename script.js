document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let questions = [];
    let parsedData = [];

    fetch('testbank.csv')
        .then(response => response.text())
        .then(data => {
            parsedData = parseCSV(data);
            generateAndDisplayQuestion();
        });

    function parseCSV(data) {
        const lines = data.split('\n').map(line => line.trim()).filter(line => line);
        return lines.map(line => {
            const [drugName, scientificName] = line.split(';');
            return { drugName, scientificName };
        });
    }

    function generateQuestion(data) {
        const item = data[Math.floor(Math.random() * data.length)];
        const correctAnswer = item.scientificName;
        const incorrectAnswers = data.filter(d => d.scientificName !== correctAnswer)
                                     .sort(() => 0.5 - Math.random())
                                     .slice(0, 3)
                                     .map(d => d.scientificName);
        const choices = [correctAnswer, ...incorrectAnswers].sort(() => 0.5 - Math.random());
        return { question: item.drugName, choices, correctAnswer };
    }

    function generateAndDisplayQuestion() {
        const question = generateQuestion(parsedData);
        displayQuestion(question);
    }

    function displayQuestion(question) {
        const questionContainer = document.getElementById('question-container');
        const questionText = document.getElementById('question-text');
        const choicesList = document.getElementById('choices-list');
        const feedback = document.getElementById('feedback');
        const nextButton = document.getElementById('next-question');

        questionText.textContent = "Tên khoa học của " + question.question;
        choicesList.innerHTML = '';
        feedback.textContent = '';
        nextButton.style.display = 'none';

        question.choices.forEach(choice => {
            const choiceItem = document.createElement('li');
            const choiceButton = document.createElement('button');
            choiceButton.textContent = choice;
            choiceButton.addEventListener('click', () => checkAnswer(choice, question.correctAnswer));
            choiceItem.appendChild(choiceButton);
            choicesList.appendChild(choiceItem);
        });

        nextButton.addEventListener('click', generateAndDisplayQuestion);
    }

    function checkAnswer(selectedChoice, correctAnswer) {
        const feedback = document.getElementById('feedback');
        const nextButton = document.getElementById('next-question');
        if (selectedChoice === correctAnswer) {
            feedback.textContent = 'Correct!';
            feedback.style.color = 'green';
        } else {
            feedback.textContent = `Incorrect! The correct answer was: ${correctAnswer}`;
            feedback.style.color = 'red';
        }
        nextButton.style.display = 'block';
    }
});