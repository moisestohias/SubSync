document.addEventListener('DOMContentLoaded', function () {
  const loadTextButton = document.getElementById('load-text-button');
  const loadAudioButton = document.getElementById('load-audio-button');
  const editor = document.getElementById('editor');
  const audio = document.getElementById('audio');
  let words = [];

  loadTextButton.addEventListener('change', function () {
    const file = loadTextButton.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const json = JSON.parse(e.target.result);
      words = json.segments.flatMap(segment => segment.words);

      editor.innerHTML = '';

      words.forEach(function (word) {
        const span = document.createElement('span');
        span.textContent = word.word + ' ';
        span.dataset.start = word.start;
        span.dataset.end = word.end;
        editor.appendChild(span);
      });
    };

    reader.readAsText(file);
  });

  loadAudioButton.addEventListener('change', function () {
    const file = loadAudioButton.files[0];
    const audioURL = URL.createObjectURL(file);
    audio.setAttribute("src", audioURL);

    // get the audio duration and display it in the UI getElementById <h1 id="time">0</h1>
    // audio.addEventListener('loadedmetadata', function () {
    //   const Duration = document.getElementById('Duration');
    //   Duration.textContent = audio.duration;
    // });


    // Highlight text, once the time start updating.
    audio.addEventListener('timeupdate', highlightText);
  });

  function highlightText() {
    const audio = document.getElementById('audio');
    const currentTime = audio.currentTime;

    // log current duration
    // const TimeStamp = document.getElementById('CurrentTime');
    // TimeStamp.textContent = currentTime;

    words.forEach(function (word) {
      const span = editor.querySelector(`span[data-start="${word.start}"][data-end="${word.end}"]`);

      if (span) {
        if (currentTime >= word.start && currentTime <= word.end) {
          span.classList.add('highlight');
        } else {
          span.classList.remove('highlight');
        }
      }
    });
  }
});
