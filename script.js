const storyTemplates = {
  Kindness: {
    title: 'The Kindness Lantern',
    body: 'In a quiet forest, a little {hero} named Maya found a glowing lantern under a fern. It was not a magical lantern at all, but it made every small act of kindness look brighter. When Maya shared the warm light with her friends, they found the courage to help others too.',
    moral: 'Kindness grows brighter when it is shared with others.',
    quiz: ['The lantern made kindness brighter.', 'The forest became noisy.', 'Maya hid the lantern.'],
    emoji: '🕯️'
  },
  Adventure: {
    title: 'The Lost Path in the Meadow',
    body: 'One windy morning, {hero} followed a tiny trail through the meadow and discovered a stone arch covered with moss. Behind it was a hidden path leading to a bright pond and a family of ducks. Every step taught {hero} to look carefully, listen to nature, and keep moving forward.',
    moral: 'Curiosity and bravery help us uncover new adventures.',
    quiz: ['The path led to a hidden pond.', 'The meadow was empty.', '{hero} gave up immediately.'],
    emoji: '🌿'
  },
  Animals: {
    title: 'The Friendly Forest Parade',
    body: 'As the rain ended, the forest woke up in a joyful parade. A fox, a squirrel, and a little {hero} marched through the grass and sang a song for every animal they met. Each friend had a different sound, and together they made a perfect rhythm for the morning.',
    moral: 'Every friend brings a special gift to the group.',
    quiz: ['The animals made a joyful parade together.', 'The forest stayed silent.', 'The squirrel left the forest.'],
    emoji: '🦊'
  },
  Nature: {
    title: 'The Singing Willow Tree',
    body: 'By the riverbank, a gentle willow tree whispered in the breeze. It told {hero} about seeds, rain, and the way every leaf grows a little stronger with sunlight. When {hero} listened carefully, the whole garden seemed to sing a soft welcome song.',
    moral: 'Nature teaches us patience, wonder, and care.',
    quiz: ['The willow shared lessons about nature.', 'The riverbank was empty.', '{hero} ignored the tree.'],
    emoji: '🌳'
  },
  Courage: {
    title: 'The Brave Little Kite',
    body: 'When the sky turned dark, a tiny kite almost gave up before it rose above the trees. {hero} held the string tight and whispered, “I can try again.” Soon the kite danced high in the wind, bright and fearless, as everyone in the park cheered.',
    moral: 'Bravery grows when we try again, even when we feel nervous.',
    quiz: ['The kite rose high after trying again.', 'The kite stayed on the ground forever.', '{hero} was afraid to hold the string.'],
    emoji: '🪁'
  },
  Learning: {
    title: 'The Curious Star Map',
    body: 'On a moonlit evening, {hero} found a dusty map covered in shining stars. It showed how to measure the sky, count constellations, and notice the small shapes hidden above the houses. The journey taught {hero} that learning is like a treasure hunt with endless discoveries.',
    moral: 'Learning helps us discover the world in new and exciting ways.',
    quiz: ['The star map led to a lesson about learning.', 'The map was lost forever.', '{hero} ignored the stars.'],
    emoji: '⭐'
  }
};

const poemTemplates = {
  Kindness: {
    title: 'Little Hands, Big Hearts',
    body: 'Share a smile, share a toy,\nHelp a friend and bring joy.\nA warm hello, a gentle day,\nMakes the world bright in every way.',
    moral: 'Small acts of kindness can make the world feel happier.',
    emoji: '🌼'
  },
  Adventure: {
    title: 'Hop to the Rainbow Trail',
    body: 'Skip along the rainbow trail,\nPast the clouds and morning dew.\nFind a pebble, find a rhyme,\nAnd bright new songs for you.',
    moral: 'Adventure begins with curiosity and a brave step forward.',
    emoji: '🌈'
  },
  Animals: {
    title: 'The Forest Song',
    body: 'The squirrel taps, the owl says hi,\nThe duckling wiggles by the sky.\nThe deer steps softly, slow and sweet,\nAnd every animal dances in the street.',
    moral: 'Friends with different voices can still make beautiful music together.',
    emoji: '🐾'
  },
  Nature: {
    title: 'Rainy-Day Rhymes',
    body: 'Rain on leaves, rain on grass,\nRain on flowers in a glass.\nPitter-patter, soft and slow,\nGrowing gardens begin to glow.',
    moral: 'Nature has a rhythm that helps everything grow.',
    emoji: '🌧️'
  },
  Courage: {
    title: 'Try Again, Little One',
    body: 'If the day feels hard to climb,\nTake a breath and try one more time.\nA brave heart learns to soar,\nAnd grow strong at every door.',
    moral: 'Confidence grows each time we keep trying.',
    emoji: '🦅'
  },
  Learning: {
    title: 'Count the Sunshine',
    body: 'One bright star, two shining rays,\nThree happy giggles, four kind ways.\nFive little steps to learn and play,\nSix wonders brighten the day.',
    moral: 'Learning and play are both ways to discover joy.',
    emoji: '☀️'
  }
};

const apiBaseUrl = 'http://localhost:8001';

const libraryCards = [
  {
    title: 'The Kindness Lantern',
    type: 'Story',
    summary: 'A child learns that helping others makes their world brighter.',
    emoji: '🕯️',
    category: 'Kindness'
  },
  {
    title: 'Forest Parade',
    type: 'Story',
    summary: 'Animals sing and celebrate a happy morning together.',
    emoji: '🦊',
    category: 'Animals'
  },
  {
    title: 'Little Hands, Big Hearts',
    type: 'Poem',
    summary: 'A cheerful rhyme about sharing and caring for friends.',
    emoji: '🌼',
    category: 'Kindness'
  },
  {
    title: 'Rainy-Day Rhymes',
    type: 'Poem',
    summary: 'A gentle poem about the joy and rhythm of rain.',
    emoji: '🌧️',
    category: 'Nature'
  },
  {
    title: 'The Brave Little Kite',
    type: 'Story',
    summary: 'A small kite learns to rise higher with confidence and patience.',
    emoji: '🪁',
    category: 'Courage'
  },
  {
    title: 'Count the Sunshine',
    type: 'Poem',
    summary: 'A playful counting rhyme full of fun and imagination.',
    emoji: '☀️',
    category: 'Learning'
  }
];

const state = {
  contentType: 'story',
  age: '5-6',
  language: 'English',
  category: 'Kindness',
  theme: 'Kindness',
  hero: 'Rabbit'
};

const ageMap = {
  '5-6': 'simple and cheerful',
  '6-7': 'balanced and playful',
  '7-8': 'adventurous and thoughtful'
};

const titleEl = document.getElementById('viewerTitle');
const storyBodyEl = document.getElementById('storyBody');
const moralEl = document.getElementById('storyMoral');
const quizListEl = document.getElementById('quizList');
const previewTitleEl = document.getElementById('previewTitle');
const previewTagEl = document.getElementById('previewTag');
const previewCopyEl = document.getElementById('previewCopy');
const libraryGridEl = document.getElementById('libraryGrid');
const artworkPanelEl = document.getElementById('artworkPanel');
const sceneArtEl = document.getElementById('sceneArt');

function renderLibrary() {
  libraryGridEl.innerHTML = libraryCards
    .map(
      (card) => `
        <article class="library-card">
          <div class="card-media" aria-hidden="true">${card.emoji}</div>
          <div class="card-meta">
            <span class="card-type">${card.type}</span>
            <span class="tag">${card.category}</span>
          </div>
          <div>
            <h4>${card.title}</h4>
          </div>
          <p>${card.summary}</p>
          <div class="card-footer">
            <span>${card.type === 'Story' ? 'Learning adventure' : 'Rhyming fun'}</span>
            <button class="ghost small" type="button">Read now</button>
          </div>
        </article>
      `
    )
    .join('');
}

function buildQuestionOptions(options, correctAnswer) {
  const shuffled = [...options].sort(() => Math.random() - 0.5);
  const formatted = shuffled.map((option) => ({
    label: option.replace('{hero}', state.hero),
    correct: option === correctAnswer
  }));

  return formatted;
}

function renderQuiz(options, correctAnswer) {
  const fullOptions = buildQuestionOptions(options, correctAnswer);

  quizListEl.innerHTML = fullOptions
    .map(
      (option) => `
        <li>
          <button type="button" class="option-btn" data-correct="${option.correct}">
            ${option.label}
          </button>
        </li>
      `
    )
    .join('');

  quizListEl.querySelectorAll('.option-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const isCorrect = button.dataset.correct === 'true';
      quizListEl.querySelectorAll('.option-btn').forEach((optionButton) => {
        const optionCorrect = optionButton.dataset.correct === 'true';
        optionButton.classList.toggle('correct', optionCorrect);
        if (optionButton !== button && optionButton.dataset.correct === 'false') {
          optionButton.classList.add('incorrect');
        }
      });

      if (isCorrect) {
        button.classList.add('correct');
      } else {
        button.classList.add('incorrect');
      }
    });
  });
}

function applyContentData(payload) {
  const title = payload.title || 'SmartGrow AI';
  const body = payload.body || '';
  const moral = payload.moral || '';

  titleEl.textContent = title;
  storyBodyEl.innerHTML = body
    .split('\n')
    .map((line) => `<p>${line}</p>`)
    .join('');

  moralEl.textContent = moral;
  previewTitleEl.textContent = title;
  previewTagEl.textContent = payload.category || state.category;
  previewCopyEl.textContent = body.slice(0, 120) + (body.length > 120 ? '...' : '');

  const quizOptions = Array.isArray(payload.quiz) && payload.quiz.length ? payload.quiz : [moral];
  const correctAnswer = quizOptions[0] || moral;
  renderQuiz(quizOptions, correctAnswer);

  const emoji = payload.emoji || '📚';
  artworkPanelEl.innerHTML = `
    <div class="art-sun"></div>
    <div class="art-cloud cloud-one"></div>
    <div class="art-cloud cloud-two"></div>
    <div class="art-tree"></div>
    <div class="art-figure">${emoji}</div>
  `;

  document.title = `SmartGrow AI | ${title}`;
}

function generateContent(contentType = state.contentType, category = state.category) {
  const template = contentType === 'story' ? storyTemplates[category] : poemTemplates[category];
  const hero = state.hero || 'Rabbit';
  const theme = state.theme || category;

  if (!template) {
    return;
  }

  const title = template.title;
  const body = template.body
    .replace(/\{hero\}/g, hero)
    .replace(/\{theme\}/g, theme);

  applyContentData({
    title,
    body,
    moral: template.moral,
    category,
    quiz: contentType === 'story' ? template.quiz : [template.moral, 'Poems are only for adults.', 'Rhymes make learning playful.'],
    emoji: template.emoji || '📚'
  });
}

async function fetchGeneratedContent() {
  try {
    const query = new URLSearchParams({
      type: state.contentType,
      category: state.category,
      age: state.age,
      language: state.language,
      hero: state.hero || 'Rabbit'
    });

    const response = await fetch(`${apiBaseUrl}/api/content?${query.toString()}`);
    if (!response.ok) {
      throw new Error('Unable to fetch content');
    }

    const payload = await response.json();
    applyContentData(payload);
  } catch (error) {
    generateContent(state.contentType, state.category);
  }
}

function speakText() {
  const textToSpeak = `${titleEl.textContent}. ${storyBodyEl.textContent}. ${moralEl.textContent}`;
  if (!('speechSynthesis' in window)) {
    alert('Audio narration is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

function syncControls() {
  document.getElementById('ageSelect').value = state.age;
  document.getElementById('languageSelect').value = state.language;
  document.getElementById('categorySelect').value = state.category;
  document.getElementById('contentTypeSelect').value = state.contentType;
  document.getElementById('themeInput').value = state.theme;
  document.getElementById('heroInput').value = state.hero;
}

function handleGenerate() {
  state.category = document.getElementById('categorySelect').value;
  state.theme = document.getElementById('themeInput').value || state.category;
  state.hero = document.getElementById('heroInput').value || 'Rabbit';
  state.contentType = document.getElementById('contentTypeSelect').value;
  state.age = document.getElementById('ageSelect').value;
  state.language = document.getElementById('languageSelect').value;

  const typeLabel = state.contentType === 'story' ? 'Story' : 'Poem';
  const details = `${state.theme} • ${ageMap[state.age]} • ${state.language}`;
  document.querySelector('.brand-tag').textContent = `${typeLabel} • ${details}`;

  fetchGeneratedContent();
}

document.getElementById('applyFiltersBtn').addEventListener('click', handleGenerate);
document.getElementById('customGenerateBtn').addEventListener('click', handleGenerate);
document.getElementById('generateStoryBtn').addEventListener('click', () => {
  state.contentType = 'story';
  syncControls();
  fetchGeneratedContent();
});
document.getElementById('generatePoemBtn').addEventListener('click', () => {
  state.contentType = 'poem';
  syncControls();
  fetchGeneratedContent();
});
document.getElementById('headerGenerateBtn').addEventListener('click', () => {
  state.contentType = state.contentType === 'story' ? 'poem' : 'story';
  syncControls();
  fetchGeneratedContent();
});
document.getElementById('previewListenBtn').addEventListener('click', speakText);
document.getElementById('previewQuizBtn').addEventListener('click', () => {
  document.getElementById('quizBox').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
document.getElementById('speakBtn').addEventListener('click', speakText);

document.getElementById('themeInput').addEventListener('input', (event) => {
  state.theme = event.target.value || state.category;
});
document.getElementById('heroInput').addEventListener('input', (event) => {
  state.hero = event.target.value || 'Rabbit';
});
document.getElementById('categorySelect').addEventListener('change', (event) => {
  state.category = event.target.value;
  state.theme = state.category;
  document.getElementById('themeInput').value = state.theme;
  fetchGeneratedContent();
});

document.getElementById('contentTypeSelect').addEventListener('change', (event) => {
  state.contentType = event.target.value;
  fetchGeneratedContent();
});

renderLibrary();
syncControls();
fetchGeneratedContent();
