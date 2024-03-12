const inputText = document.getElementById('input-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const outputText = document.getElementById('output-text');
const translateBtn = document.getElementById('translate-btn');

populateLanguageDropdowns();

translateBtn.addEventListener('click', () => {
  const text = inputText.value;
  const source = sourceLang.value;
  const targets = Array.from(targetLang.selectedOptions, option => option.value);

  if (text && source && targets.length) {
    translateText(text, source, targets)
      .then(translations => {
        let outputHtml = '';
        translations.forEach(translation => {
          outputHtml += `<h3>${translation.language}</h3><p>${translation.translation}</p>`;
        });
        outputText.innerHTML = outputHtml;
      })
      .catch(error => {
        console.error('Translation error:', error);
      });
  }
});

function translateText(text, source, targets) {
  const promises = targets.map(target => {
    const url = `https://libretranslate.com/translate?q=${encodeURIComponent(text)}&source=${source}&target=${target}&format=text`;

    return fetch(url)
      .then(response => response.json())
      .then(data => ({ language: target, translation: data.translatedText }))
      .catch(error => {
        throw new Error(`Translation error for ${target}: ${error}`);
      });
  });

  return Promise.all(promises);
}

function populateLanguageDropdowns() {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'fr', name: 'French' },
    { code: 'kn', name: 'Kannada' }
  ];

  const sourceLanguageDropdown = document.getElementById('source-lang');
  const targetLanguageDropdown = document.getElementById('target-lang');

  languages.forEach(language => {
    const option = document.createElement('option');
    option.value = language.code;
    option.textContent = language.name;

    sourceLanguageDropdown.appendChild(option.cloneNode(true));
    targetLanguageDropdown.appendChild(option.cloneNode(true));
  });
}