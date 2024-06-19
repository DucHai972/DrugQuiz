document.addEventListener('DOMContentLoaded', () => {
    let currentQuestionIndex = 0;
    let questions = [];
    let parsedData = [];
    const columns = ["Dược liệu", "Tên Khoa học", "Tính", "Vị", "Quy kinh", "Công năng", "Chủ trị"];

    fetch('DrugQuiz.csv')
        .then(response => response.text())
        .then(data => {
            parsedData = parseCSV(data);
            generateQuestions(parsedData);
            shuffleArray(questions); // Shuffle questions to make them random
            displayQuestion(currentQuestionIndex);
        });

    function parseCSV(data) {
        const rows = data.split('\n').filter(row => row.trim() !== '');
        return rows.map(row => row.split(';'));
    }

    function generateQuestions(data) {
        data.forEach(item => {
            columns.forEach((col, colIndex) => {
                if (colIndex > 0) { // Generate questions for columns other than the first one
                    questions.push({
                        question: `Đâu là ${col} của ${item[0]}?`,
                        correctAnswer: item[colIndex],
                        options: getOptions(data, colIndex, item[colIndex])
                    });
                } else { // Generate questions for the first column
                    for (let i = 1; i < columns.length; i++) {
                        questions.push({
                            question: `Dược liệu nào có ${columns[i]}: ${item[i]}?`,
                            correctAnswer: item[0],
                            options: getOptions(data, 0, item[0])
                        });
                    }
                }
            });
        });
    }

    function getOptions(data, colIndex, correctAnswer) {
        const options = new Set();
        options.add(correctAnswer);
        while (options.size < 4) {
            const randomIndex = Math.floor(Math.random() * data.length);
            options.add(data[randomIndex][colIndex]);
        }
        return shuffleArray(Array.from(options));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayQuestion(index) {
        if (index >= questions.length) {
            document.body.innerHTML = "<h1>Quiz Completed!</h1>";
            return;
        }
        const questionData = questions[index];

        const questionContainer = document.getElementById('question-container');
        const questionText = document.getElementById('question-text');
        const choicesList = document.getElementById('choices-list');
        const feedback = document.getElementById('feedback');
        const nextButton = document.getElementById('next-question');

        questionText.innerText = questionData.question;
        choicesList.innerHTML = ''; // Clear previous options

        questionData.options.forEach(option => {
            const listItem = document.createElement('li');
            const optionButton = document.createElement('button');
            optionButton.innerText = option;
            optionButton.addEventListener('click', () => {
                if (option === questionData.correctAnswer) {
                    feedback.innerText = 'Correct!';
                } else {
                    feedback.innerText = 'Incorrect';
                }
                nextButton.style.display = 'block';
            });
            listItem.appendChild(optionButton);
            choicesList.appendChild(listItem);
        });

        nextButton.onclick = () => {
            feedback.innerText = '';
            nextButton.style.display = 'none';
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        };
    }
});
