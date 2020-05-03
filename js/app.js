// Quiz Questions, Options and Answers Array
const quizArray = [
    {
        question: 'How did you hear about StartNG? 🙄',
        options: ["Facebook", "Instagram", "Twitter", "Friend Referral", "Netflix"],
        answer: 2
    }, 
    {
        question: 'Who is the Baba Isale of StartNG? 🤔',
        options: ["Mark Essien", "Seyi Onifade", "Abasifreke Ekwere", "Jeff Ogah", "Tomisin Lalude"],
        answer: 1
    },
    {
        question: "What is @KingAbesh's favorite emoji name?",
        options: ["Grim Reaper 🔪", "Egungun 😷", "Eye Roll 🙄", "Crown 👑", "Purple Heart 💜"],
        answer: 1
    },
    {
        question: "Which Slack channel has the most cruise? 🤣🤣",
        options: ["#class", "#probation", "#random", "#general", "#announcement"],
        answer: 2
    },
    {
        question: "Which Slack channel is the most dangerous? 💀",
        options: ["#class", "#probation", "#random", "#general", "#announcement"],
        answer: 1
    }
];

let questionIndex;
let index = 0;
let myArray = [];
let testArr = []
let score = 0;


// UI Controller
const UIController = (function() {
    const UISelector = {
        question: '.questions',
        currentQuestion: '.current-question',
        totalQuestion: '.total-question',
        options: '.options',
        option: '.options div',
        option1: '.option1',
        option2: '.option2',
        option3: '.option3',
        option4: '.option4',
        option5: '.option5',
        nextBtn: '.btn',
        progress: '.progress',
        modal: '#mainModal',
        modalBtn: '#modalBtn',
        closeBtn: '.closeBtn',
        resultBoard: '.result',
        correctAnswers: '.correct-answers',
        retryGame: '.retry'
    }

    return {
        getSelectors: function(){
            return UISelector;
          }
    }
})();


// App Controller
const App = (function(UIController) {

    // Get UI Selectors
    const UISelectors = UIController.getSelectors()

    // Build Modal
    const modal = document.querySelector(UISelectors.modal)
    const closeBtn = document.querySelector(UISelectors.closeBtn)

    const option = document.querySelectorAll(UISelectors.option)
    const progressBar = document.querySelector(UISelectors.progress)

    // Total Questions
    document.querySelector(UISelectors.totalQuestion).innerHTML = quizArray.length;

    // Load Event Listeners
    const loadQuestion = () => {
        // Input Question to Quiz Board
        document.querySelector(UISelectors.question).innerHTML = quizArray[questionIndex].question
        // Set Current Question Number
        document.querySelector(UISelectors.currentQuestion).innerHTML = index + 1
        // Set Current Question Options
        document.querySelector(UISelectors.option1).innerHTML = quizArray[questionIndex].options[0]
        document.querySelector(UISelectors.option2).innerHTML = quizArray[questionIndex].options[1]
        document.querySelector(UISelectors.option3).innerHTML = quizArray[questionIndex].options[2]
        document.querySelector(UISelectors.option4).innerHTML = quizArray[questionIndex].options[3]
        document.querySelector(UISelectors.option5).innerHTML = quizArray[questionIndex].options[4]
        // Increase Index Count
        index++
    }

    const checkQuestion = (e) => {
        if (e.id == quizArray[questionIndex].answer) {
            e.classList.add('success')
            progressTrackerUpdate('success');
            score++
        } else {
            e.classList.add('error')
            progressTrackerUpdate('error')
        }

        disableOptions()
    } 

    const disableOptions = () => {
        for (let i = 0; i < option.length; i++) {
            option[i].classList.add('disabled')

            if (option[i].id == quizArray[questionIndex].answer) {
                option[i].classList.add('success')
            }
        }
    }

    const enableOptions = () => {
        for (let i = 0; i < option.length; i++) {
            option[i].classList.remove('disabled', 'error', 'success')
        }
    }
    
    const openModal = () => modal.style.display = "block";
    const closeModal = (e) => modal.style.display = "none";

    const validateInput = () => {
        if (!option[0].classList.contains('disabled')) {
            openModal()
        } else {
            enableOptions();
            randomQuestion()
        }
    }

    const nextQuestion = () => {
        validateInput()
    }
    
    const randomQuestion = () => {
        let randomNumber = Math.floor(Math.random() * quizArray.length)
        questionIndex = randomNumber
        let duplicateQuestion = 0
        
        if (index == quizArray.length) {
            gameOver()
        } else {
            if (myArray.length > 0) {
                for (let i = 0; i < myArray.length; i++) {
                    if (myArray[i] == randomNumber) {
                        duplicateQuestion = 1
                        break
                    }
                }

                if (duplicateQuestion == 1) {
                    randomQuestion()
                } else {
                    questionIndex = randomNumber;
                    loadQuestion()
                    testArr.push(randomNumber)
                }
            }
            if (myArray.length == 0) {
                questionIndex = randomNumber;
                loadQuestion()
                testArr.push(randomNumber)
            }
            console.log('TestArray : ', testArr)
            myArray.push(randomNumber)
        }
    }

    const progressTracker = () => {
        for (let i = 0; i < quizArray.length; i++) {
            const div = document.createElement('div')
            progressBar.appendChild(div)
        }
    }

    const progressTrackerUpdate = (className) => {
        progressBar.children[index - 1].classList.add(className)
    }   

    const gameOver = () => {
        console.log('Quiz Over')
        document.querySelector(UISelectors.resultBoard).classList.add('show')
        document.querySelector(UISelectors.correctAnswers).innerHTML = score;
    }
    const resetGame = () => {
        window.location.reload()
        // document.querySelector(UISelectors.resultBoard).classList.remove('show')
    }

    for (let i = 0; i < option.length; i++) {
        option[i].addEventListener('click', (e) => {
            checkQuestion(option[i])
        })
    }


    // Listen for close click
    closeBtn.addEventListener("click", closeModal);
    // Next Question Button Click Event
    document.querySelector(UISelectors.nextBtn).addEventListener('click', nextQuestion)

    // Reset Game
    document.querySelector(UISelectors.retryGame).addEventListener('click', resetGame)


    return {
        init: function() {
            randomQuestion();
            progressTracker()
        }
    }
})(UIController)

App.init()