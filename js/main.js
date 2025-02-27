const THEME_TOGGLER_BUTTON = '.theme-toggler';
const CURRENT_ADVICE = {
  id: 117,
  advice: `“It is easy to sit up and take notice, what's difficult is getting up and taking action.”`
};

function init () {
  // Get theme toggler button  
  const elThemeTogglerButton = document.querySelector(THEME_TOGGLER_BUTTON);

  // Get elements that are used in JS manipulation
  const elGenerateAdviceButton = document.querySelector('#generate-advice-button');
  const elCardIndex = document.querySelector('.card__index');
  const elCardQuoteText = document.querySelector('.card__quote-text');
  const elCardError = document.querySelector('.card__error');

  // Functions
  function setCurrentAdvice (advice) {
    CURRENT_ADVICE.id = advice.slip.id;
    CURRENT_ADVICE.advice = `"${advice.slip.advice}"`;
  }

  function setLoadingState() {
    elCardIndex.textContent = "...";
    elCardQuoteText.textContent = "Loading...";
  }

  // Update respective elements' textContent
  function displayAdvice () {
    elCardIndex.textContent = CURRENT_ADVICE.id;
    elCardQuoteText.textContent = CURRENT_ADVICE.advice;
  }

  function displayErrorMessage (error) {
    elCardError.removeAttribute('hidden');
    elCardError.textContent = error;
  }

  function hideErrorMessage () {
    elCardError.setAttribute('hidden', true);
  }

  // Get random advice from Advice Slip API
  async function getAdvice () {
    hideErrorMessage();
    setLoadingState();

    try {
      const adviceResponse = await fetch('https://api.adviceslip.com/advice');
      const advice = await adviceResponse.json();
      setCurrentAdvice(advice);
      displayAdvice();
    } catch (error) {
      console.error('Error', error);
      displayErrorMessage(error);
      displayAdvice();
    }
  }


  // DOM handlers
  function switchTheme () {
    const elRoot = document.documentElement
    let dataTheme = elRoot.getAttribute('data-theme');

    let newTheme = (dataTheme === 'light') ? 'dark' : 'light';

    elRoot.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);
  }

  function generateAdviceButtonClickHandler () {
    getAdvice();
  }

  function documentKeyUpHandler (evt) {
    if (evt.code !== "Space" || document.activeElement === elGenerateAdviceButton || document.activeElement === elThemeTogglerButton) {
      return;
    }

    getAdvice();
  }


  // Event listeners
  if (elThemeTogglerButton) {
    elThemeTogglerButton.addEventListener('click', switchTheme);
  }

  if (elGenerateAdviceButton) {
    elGenerateAdviceButton.addEventListener('click', generateAdviceButtonClickHandler);
  }
  document.addEventListener('keyup', documentKeyUpHandler);
}

document.addEventListener('DOMContentLoaded', init);
