const questions = [
  {
    employer: 'Civic Welcome Studio · Example employer',
    short: 'Help a resident find the right service',
    question: 'A resident cannot find the right city service. What would you ask first?',
    context: 'The team wants to make it easier for residents to find a useful next step.',
    times: ['10:10', '10:30'],
    experience: 'At a volunteer event, I asked what help a visitor needed, then walked them to the right desk.',
    approach: 'I would ask what they need first, then offer the next step in plain language.'
  },
  {
    employer: 'Northstar Mobility · Example employer',
    short: 'Make a bus delay easier to understand',
    question: 'A bus is delayed. What should passengers know so they can decide what to do next?',
    context: 'The team is exploring how to make service updates more useful when plans change.',
    times: ['10:20', '10:40'],
    experience: 'When event plans changed, I wrote one clear update with the new time and next step.',
    approach: 'I would say what changed, how long it may take, and what passengers can do now.'
  },
  {
    employer: 'Harbor Library · Example employer',
    short: 'Help people find a community workshop',
    question: 'People keep missing a community workshop. What would make it easier to find?',
    context: 'The team wants more people to discover activities that are already available.',
    times: ['10:15', '10:50'],
    experience: 'I rewrote event instructions so new volunteers could find the room and time.',
    approach: 'I would make the details shorter, then ask someone to find the time and place.'
  }
];

const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

let stageName = 'choose';
let questionIndex = 0;
let answerType = 'experience';
let answerText = questions[0].experience;
let selectedTime = questions[0].times[0];

function currentQuestion() { return questions[questionIndex]; }

function renderProgress() {
  const steps = ['Choose', 'Share', 'Meet'];
  const stepIndex = ['choose'].includes(stageName) ? 0
    : ['share'].includes(stageName) ? 1 : 2;
  const finished = ['done', 'passed'].includes(stageName);
  $('#progress').innerHTML = steps.map((step, index) => {
    const complete = index < stepIndex || finished;
    const active = index === stepIndex && !finished;
    return `<div class="progress-step ${complete ? 'complete' : ''} ${active ? 'active' : ''}" ${active ? 'aria-current="step"' : ''}>
      <span class="progress-number">${complete ? '✓' : `0${index + 1}`}</span><span>${step}</span>
    </div>`;
  }).join('');
  $('#progress').setAttribute('aria-label', `Step ${stepIndex + 1} of 3: ${steps[stepIndex]}`);
}

function questionCard(question, index) {
  return `<button class="question-option ${index === questionIndex ? 'selected' : ''}" type="button" data-question="${index}" aria-pressed="${index === questionIndex}">
    <span class="employer-name">${escapeHTML(question.employer)}</span>
    <strong>${escapeHTML(question.short)}</strong>
  </button>`;
}

function renderChoose() {
  const question = currentQuestion();
  return `<div class="stage-content">
    <p class="stage-kicker">Step 1 · Choose</p>
    <h2>Choose a work question.</h2>
    <p class="stage-lead">Pick the one you would like to talk about.</p>
    <div class="question-options">${questions.map(questionCard).join('')}</div>
    <div class="question-preview"><span>Example work question</span><p>“${escapeHTML(question.question)}”</p></div>
    <button class="primary-button" type="button" data-action="share">Choose this question <span aria-hidden="true">→</span></button>
  </div>`;
}

function renderShare() {
  const question = currentQuestion();
  return `<div class="stage-content">
    <button class="stage-back" type="button" data-action="back">← Back to questions</button>
    <p class="stage-kicker">Step 2 · Share</p>
    <h2>Tell a short story or idea.</h2>
    <p class="stage-lead">There is no perfect answer. Choose what feels true to you.</p>
    <div class="question-preview"><span>${escapeHTML(question.employer)}</span><p>“${escapeHTML(question.question)}”</p></div>
    <div class="answer-options" role="group" aria-label="Choose what to share">
      <button class="answer-choice ${answerType === 'experience' ? 'selected' : ''}" type="button" data-type="experience" aria-pressed="${answerType === 'experience'}">A story from my life</button>
      <button class="answer-choice ${answerType === 'approach' ? 'selected' : ''}" type="button" data-type="approach" aria-pressed="${answerType === 'approach'}">What I would try</button>
    </div>
    <label class="example-label" for="answerText">Your example <small>Use your own words</small></label>
    <textarea class="answer-box" id="answerText" maxlength="240">${escapeHTML(answerText)}</textarea>
    <p class="privacy-note">The employer sees this short response for this request. Your CV stays hidden here.</p>
    <button class="primary-button" type="button" data-action="meet">Continue <span aria-hidden="true">→</span></button>
  </div>`;
}

function renderMeet() {
  const question = currentQuestion();
  return `<div class="stage-content">
    <button class="stage-back" type="button" data-action="back">← Back to your example</button>
    <p class="stage-kicker">Step 3 · Meet</p>
    <h2>Ask for a short chat.</h2>
    <p class="stage-lead">Choose a time for a 10-minute chat. The employer can confirm or pass.</p>
    <div class="request-card">
      <span class="request-label">10-minute chat · ${escapeHTML(question.employer)}</span>
      <h3>${escapeHTML(question.short)}</h3>
      <p>${escapeHTML(question.context)}</p>
      <blockquote>“${escapeHTML(answerText)}”</blockquote>
    </div>
    <div class="slot-options" role="group" aria-label="Choose a time">
      ${question.times.map(time => `<button class="slot-option ${selectedTime === time ? 'selected' : ''}" type="button" data-time="${time}" aria-pressed="${selectedTime === time}">${time}</button>`).join('')}
    </div>
    <p class="privacy-note">The employer sees your example before the meeting. This is not a hiring decision.</p>
    <button class="primary-button" type="button" data-action="send">Ask to meet at ${selectedTime} <span aria-hidden="true">→</span></button>
  </div>`;
}

function renderSent() {
  return `<div class="stage-content">
    <p class="stage-kicker">Request sent</p>
    <h2>Your example goes to the employer.</h2>
    <p class="stage-lead">They can see your response and chosen time. Your CV stays hidden in this step.</p>
    <div class="status"><strong>Requested · ${selectedTime} · 10 minutes</strong>The employer chooses whether to meet.</div>
    <button class="primary-button" type="button" data-action="employer">See the employer's view <span aria-hidden="true">→</span></button>
  </div>`;
}

function renderEmployer() {
  const question = currentQuestion();
  return `<div class="stage-content">
    <button class="stage-back" type="button" data-action="back-to-request">← Back</button>
    <p class="stage-kicker">Employer view · Example</p>
    <h2>A person wants to meet.</h2>
    <div class="request-card">
      <span class="request-label">10-minute chat · ${escapeHTML(question.employer)} · ${selectedTime}</span>
      <h3>${escapeHTML(question.short)}</h3>
      <p>“${escapeHTML(question.question)}”</p>
      <blockquote>“${escapeHTML(answerText)}”</blockquote>
      <div class="cv-hidden"><span aria-hidden="true">◌</span>CV hidden · no score or ranking</div>
    </div>
    <p class="stage-lead">The employer decides whether to confirm or pass.</p>
    <button class="primary-button" type="button" data-action="confirm">Confirm the 10-minute chat <span aria-hidden="true">→</span></button>
    <button class="secondary-button" type="button" data-action="pass">Pass</button>
  </div>`;
}

function renderOutcome(confirmed) {
  return `<div class="stage-content">
    <div class="closing-mark" aria-hidden="true">${confirmed ? '✓' : '↺'}</div>
    <p class="stage-kicker">${confirmed ? 'Both chose to meet' : 'Request passed'}</p>
    <h2>${confirmed ? 'A 10-minute chat is agreed.' : 'Try another question.'}</h2>
    <p class="stage-lead">${confirmed ? 'They can talk about the work before anyone makes a hiring decision.' : 'Common Ground does not score the person or decide who gets hired.'}</p>
    <div class="status"><strong>${confirmed ? `Confirmed · ${selectedTime}` : 'No score. No ranking.'}</strong>${confirmed ? 'A first conversation gives both people a chance to learn more.' : 'The person can choose another work question.'}</div>
    <button class="primary-button" type="button" data-action="restart">Try the example again</button>
  </div>`;
}

function render() {
  renderProgress();
  const view = {
    choose: renderChoose,
    share: renderShare,
    meet: renderMeet,
    sent: renderSent,
    employer: renderEmployer,
    done: () => renderOutcome(true),
    passed: () => renderOutcome(false)
  }[stageName];
  $('#stage').innerHTML = view();
  bindStageActions();
}

function bindStageActions() {
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
    questionIndex = Number(button.dataset.question);
    answerType = 'experience';
    answerText = currentQuestion().experience;
    selectedTime = currentQuestion().times[0];
    render();
  }));
  document.querySelectorAll('[data-type]').forEach(button => button.addEventListener('click', () => {
    saveAnswer();
    answerType = button.dataset.type;
    answerText = currentQuestion()[answerType];
    render();
  }));
  $('#answerText')?.addEventListener('input', saveAnswer);
  document.querySelectorAll('[data-time]').forEach(button => button.addEventListener('click', () => {
    selectedTime = button.dataset.time;
    render();
  }));
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
    const action = button.dataset.action;
    if (action === 'share') stageName = 'share';
    if (action === 'meet') { saveAnswer(); stageName = 'meet'; }
    if (action === 'send') stageName = 'sent';
    if (action === 'employer') stageName = 'employer';
    if (action === 'confirm') stageName = 'done';
    if (action === 'pass') stageName = 'passed';
    if (action === 'back') stageName = stageName === 'share' ? 'choose' : 'share';
    if (action === 'back-to-request') stageName = 'sent';
    if (action === 'restart') reset();
    render();
  }));
}

function saveAnswer() {
  const field = $('#answerText');
  if (field) answerText = field.value;
}

function reset() {
  stageName = 'choose';
  questionIndex = 0;
  answerType = 'experience';
  answerText = questions[0].experience;
  selectedTime = questions[0].times[0];
  render();
}

$('#restart').addEventListener('click', reset);
render();
