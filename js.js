const keyboardKeys = document.querySelectorAll(".keyboard .keyboard-keys"),
  inputsqrs = document.querySelectorAll(".play-area .inp-box"),
  lines = document.querySelectorAll(".play-area section"),
  deleteBtn = document.querySelector(".deletebtn"),
  enterBtn = document.querySelector(".enterBtn");
//const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
//console.log(deleteBtn);
let curletter = 0,
  x,
  curline = 0;
let nextline = false;
let guessWord = "",
  enteredWord = "",
  differentLetterSaver = [],
  CheckIfLetterIsINRightPlace = [];
let AllowToTypeOnKeyBoard = true;
let gameOver = false;
function setRandomWord() {
  fetch("guessWords.json")
    .then((response) => response.json())
    .then((data) => {
      let randomNum = Math.ceil(Math.random() * 51) - 1;
      guessWord = data.words[randomNum];
      console.log(guessWord);
    });
}
setRandomWord();

let checkIfWordIsReal = true;
keyboardKeys.forEach((key) => {
  key.addEventListener("click", () => {
    if ((curletter < 5 + 5 * curline || nextline) && !gameOver) {
      nextline = false;
      inputsqrs[curletter].innerHTML = key.innerHTML;
      enteredWord += String(inputsqrs[curletter].innerHTML);
      inputsqrs[curletter].style.animation = "none";
      void inputsqrs[curletter].offsetWidth;
      inputsqrs[curletter].style.animation = "enterLetter 0.15s";
      key.style.animation = "none";
      void key.offsetWidth;
      key.style.animation = "enterLetter .15s";
      curletter++;
    }
  });
});
function chechIfWin() {
  for (let i = curletter - 5; i < 5 + 5 * (curline - 1); i++) {
    if (inputsqrs[i].innerHTML != guessWord[i % 5].toUpperCase()) {
      return false;
    }
  }
  return true;
}
deleteBtn.addEventListener("click", () => {
  if (curletter > 0 && curletter > 5 * curline) {
    curletter--;
    enteredWord = enteredWord.substring(0, curletter % 5);
    inputsqrs[curletter].innerHTML = "";
    deleteBtn.style.animation = "none";
    void deleteBtn.offsetWidth;
    deleteBtn.style.animation = "enterLetter .15s";
  }
});
function feedbackPopUp(def) {
  let fCont = document.createElement("div");
  document.querySelector(".popupsCont").appendChild(fCont);
  document
    .querySelector(".popupsCont")
    .insertBefore(fCont, document.querySelector(".popupsCont").firstChild);
  fCont.classList.add("popUpsign");
  if (def == 1) {
    fCont.innerHTML = "Not enough letters";
  } else if (def == 0) {
    fCont.innerHTML = "Not in word list";
  }
  setTimeout(() => {
    fCont.style.animation = "dissepearAni .4s";
  }, 1000);
  setTimeout(() => {
    document.querySelector(".popupsCont").removeChild(fCont);
  }, 1380);
}
function countCertainLettersInWord() {
  for (let i = 65; i <= 90; i++) {
    differentLetterSaver[i] = 0;
  }
  for (let i = 0; i < 5; i++) {
    differentLetterSaver[guessWord.toUpperCase().charCodeAt(i)]++;
  }
  for (let i = curletter; i < 5 + 5 * curline; i++) {
    if (inputsqrs[i].innerHTML == guessWord[i % 5].toUpperCase()) {
      differentLetterSaver[inputsqrs[i].innerHTML.charCodeAt(0)]--;
    }
  }
}

function rotateSqrs() {
  inputsqrs[curletter].style.animation = "none";
  void inputsqrs[curletter].offsetWidth;
  inputsqrs[curletter].style.animation = "rotateX 0.5s forwards";
  setTimeout(() => {
    if (
      inputsqrs[curletter].innerHTML.toLowerCase() == guessWord[curletter % 5]
    ) {
      inputsqrs[curletter].classList.add("rightLetterInRightPlace");
      inputsqrs[curletter].style.border = "solid 2px #55a94e";
      for (let i = 0; i < 26; i++) {
        if (keyboardKeys[i].innerHTML == inputsqrs[curletter].innerHTML) {
          keyboardKeys[i].classList.remove("wrongGueassButForKey");
          keyboardKeys[i].classList.remove("rightLetterInWrongPlace");
          keyboardKeys[i].classList.add("rightLetterInRightPlace");
          break;
        }
      }
    } else if (
      guessWord.includes(inputsqrs[curletter].innerHTML.toLowerCase()) &&
      differentLetterSaver[inputsqrs[curletter].innerHTML.charCodeAt(0)] > 0
    ) {
      inputsqrs[curletter].classList.add("rightLetterInWrongPlace");
      inputsqrs[curletter].style.border = "solid 2px #dec039";
      differentLetterSaver[inputsqrs[curletter].innerHTML.charCodeAt(0)]--;
      for (let i = 0; i < 26; i++) {
        if (
          keyboardKeys[i].innerHTML == inputsqrs[curletter].innerHTML &&
          !keyboardKeys[i].classList.contains("rightLetterInRightPlace")
        ) {
          keyboardKeys[i].classList.remove("wrongGueassButForKey");
          keyboardKeys[i].classList.remove("rightLetterInRightPlace");
          keyboardKeys[i].classList.add("rightLetterInWrongPlace");
          break;
        }
      }
    } else {
      inputsqrs[curletter].classList.add("wrongGuess");
      for (let i = 0; i < 26; i++) {
        if (
          keyboardKeys[i].innerHTML == inputsqrs[curletter].innerHTML &&
          !keyboardKeys[i].classList.contains("rightLetterInRightPlace") &&
          !keyboardKeys[i].classList.contains("rightLetterInWrongPlace")
        ) {
          keyboardKeys[i].classList.remove("rightLetterInWrongPlace");
          keyboardKeys[i].classList.remove("rightLetterInRightPlace");
          keyboardKeys[i].classList.add("wrongGueassButForKey");
          break;
        }
      }
    }

    curletter++;
  }, 200);
  let sound = new Audio("pop-sound-forSwitch.mp3");
  sound.play();
  if (curletter == 5 + 5 * curline - 1) {
    curline++;
    if (curline == 6) {
      gameOver = true;
    }
    clearInterval(x);
  }
}
//**************************************************************************************
//*************************************** enter ****************************************
//**************************************************************************************
enterBtn.addEventListener("click", () => {
  if (!gameOver) {
    enteredWord = enteredWord.toLowerCase();
    checkIfWordIsReal = true;
    fetch("words.json")
      .then((response) => response.json())
      .then((data) => {
        const validWords = data.words;
        if (validWords.includes(enteredWord)) {
          checkIfWordIsReal = true;
        } else {
          checkIfWordIsReal = false;
        }
        enteredWord = "";
        enterBtn.style.animation = "none";
        void enterBtn.offsetWidth;
        enterBtn.style.animation = "enterLetter .15s";
        if (curletter == 5 + 5 * curline && checkIfWordIsReal) {
          lines[curline].style.animation = "none";
          AllowToTypeOnKeyBoard = false;
          keyboardKeys.forEach((key) => {
            key.classList.add("disabled");
          });
          deleteBtn.classList.add("disabled");
          nextline = true;
          curletter -= 5;
          countCertainLettersInWord();
          rotateSqrs();
          x = setInterval(() => {
            rotateSqrs();
          }, 380);
          setTimeout(() => {
            keyboardKeys.forEach((key) => {
              key.classList.remove("disabled");
            });
            deleteBtn.classList.remove("disabled");
            if (chechIfWin()) {
              document.querySelector(".winPopUp").classList.remove("hide");
            } else {
              AllowToTypeOnKeyBoard = true;
            }
          }, 1800);
        } else {
          if (curletter < 5 + 5 * curline) {
            feedbackPopUp(1);
          } else if (!checkIfWordIsReal) {
            feedbackPopUp(0);
          }
          lines[curline].style.animation = "none";
          void lines[curline].offsetWidth;
          lines[curline].style.animation = "shakeAni 0.7s forwards";
        }
      })
      .catch((error) => {
        console.log("Error occurred:", error);
      });
  }
});

document.querySelector(".btnContainer button").addEventListener("click", () => {
  location.reload();
});
document.querySelector(".check-box1").addEventListener("click", () => {
  document.querySelector("body").classList.toggle("light");

  document
    .querySelector(".slider .theme-changer .bx")
    .classList.toggle("bx-moon");
  document
    .querySelector(".slider .theme-changer .bx")
    .classList.toggle("bx-sun");
  let sound = new Audio("mixkit-gate-latch-click-1924.wav");
  sound.play();
});

document.addEventListener("keyup", (e) => {
  if (AllowToTypeOnKeyBoard && !gameOver) {
    if (
      (curletter < 5 + 5 * curline && e.keyCode >= 65 && e.keyCode <= 90) ||
      (nextline && e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      let rkeyboardLetter = String.fromCharCode(e.keyCode);
      nextline = false;
      inputsqrs[curletter].innerHTML = rkeyboardLetter;

      inputsqrs[curletter].style.animation = "none";
      void inputsqrs[curletter].offsetWidth;
      inputsqrs[curletter].style.animation = "enterLetter 0.15s";
      enteredWord += String(inputsqrs[curletter].innerHTML);
      curletter++;
    } else if (e.keyCode == 8) {
      if (curletter > 0 && curletter > 5 * curline) {
        curletter--;
        enteredWord = enteredWord.substring(0, curletter % 5);
        inputsqrs[curletter].innerHTML = "";
      }
    } else if (e.keyCode == 13) {
      enteredWord = enteredWord.toLowerCase();
      checkIfWordIsReal = true;
      fetch("words.json")
        .then((response) => response.json())
        .then((data) => {
          const validWords = data.words;
          if (validWords.includes(enteredWord)) {
            checkIfWordIsReal = true;
          } else {
            checkIfWordIsReal = false;
          }
          enteredWord = "";
          enterBtn.style.animation = "none";
          void enterBtn.offsetWidth;
          enterBtn.style.animation = "enterLetter .15s";
          if (curletter == 5 + 5 * curline && checkIfWordIsReal) {
            lines[curline].style.animation = "none";
            AllowToTypeOnKeyBoard = false;
            keyboardKeys.forEach((key) => {
              key.classList.add("disabled");
            });
            deleteBtn.classList.add("disabled");
            nextline = true;
            curletter -= 5;
            countCertainLettersInWord();
            rotateSqrs();
            x = setInterval(() => {
              rotateSqrs();
            }, 380);
            setTimeout(() => {
              keyboardKeys.forEach((key) => {
                key.classList.remove("disabled");
              });
              deleteBtn.classList.remove("disabled");
              if (chechIfWin()) {
                document.querySelector(".winPopUp").classList.remove("hide");
              } else {
                AllowToTypeOnKeyBoard = true;
              }
            }, 1800);
          } else {
            if (curletter < 5 + 5 * curline) {
              feedbackPopUp(1);
            } else if (!checkIfWordIsReal) {
              feedbackPopUp(0);
            }
            lines[curline].style.animation = "none";
            void lines[curline].offsetWidth;
            lines[curline].style.animation = "shakeAni 0.7s forwards";
          }
        })
        .catch((error) => {
          console.log("Error occurred:", error);
        });
    }
  }
});
