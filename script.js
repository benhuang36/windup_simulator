const desktop = document.getElementById('desktop');
const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');
const taskButtons = document.getElementById('task-buttons');
const windowArea = document.getElementById('window-area');
const clock = document.getElementById('clock');

let zIndexCounter = 10;
let windowCount = 0;

const windowContent = {
  computer: {
    title: 'My Computer',
    render: () => `
      <div class="window-toolbar">
        <button class="toolbar-button">文件與資料夾</button>
        <button class="toolbar-button">本機磁碟</button>
      </div>
      <div class="listing">
        <div class="listing-item">Local Disk (C:)</div>
        <div class="listing-item">Shared Documents</div>
        <div class="listing-item">CD Drive (D:)</div>
      </div>
    `,
  },
  documents: {
    title: 'My Documents',
    render: () => `
      <div class="listing">
        <div class="listing-item">Report.doc</div>
        <div class="listing-item">Budget.xls</div>
        <div class="listing-item">Vacation.jpg</div>
      </div>
    `,
  },
  pictures: {
    title: 'My Pictures',
    render: () => `
      <div class="listing">
        <div class="listing-item">Sunset.png</div>
        <div class="listing-item">Family.bmp</div>
        <div class="listing-item">Wallpaper.jpg</div>
      </div>
    `,
  },
  music: {
    title: 'My Music',
    render: () => `
      <div class="listing">
        <div class="listing-item">Favorite Song.mp3</div>
        <div class="listing-item">Playlist.wpl</div>
        <div class="listing-item">Classics.wav</div>
      </div>
    `,
  },
  browser: {
    title: 'Internet Explorer',
    render: () => `
      <div class="window-toolbar">
        <button class="toolbar-button">Back</button>
        <button class="toolbar-button">Forward</button>
        <button class="toolbar-button">Home</button>
        <button class="toolbar-button">Favorites</button>
      </div>
      <div class="browser-preview">Welcome to a Windows XP inspired web!</div>
    `,
  },
  notepad: {
    title: 'Notepad',
    render: () => `
      <div class="window-toolbar">
        <button class="toolbar-button">File</button>
        <button class="toolbar-button">Edit</button>
        <button class="toolbar-button">Format</button>
        <button class="toolbar-button">Help</button>
      </div>
      <textarea class="notepad-area">This Notepad is ready for typing...</textarea>
    `,
  },
  recycle: {
    title: 'Recycle Bin',
    render: () => `
      <div class="listing">
        <div class="listing-item">Old Shortcut.lnk</div>
        <div class="listing-item">Temp File.tmp</div>
      </div>
    `,
  },
  control: {
    title: 'Control Panel',
    render: () => `
      <div class="listing">
        <div class="listing-item">Display</div>
        <div class="listing-item">Network</div>
        <div class="listing-item">Add/Remove Programs</div>
      </div>
    `,
  },
  help: {
    title: 'Help and Support',
    render: () => `
      <p>Search for help topics or browse the categories to learn about Windows XP style features.</p>
    `,
  },
  search: {
    title: 'Search',
    render: () => `
      <p>Type a name, word, or phrase to search for files and folders on this simulated PC.</p>
    `,
  },
  run: {
    title: 'Run',
    render: () => `
      <p>Type the name of a program, folder, document, or Internet resource.</p>
      <input type="text" style="width:100%; padding:8px; border-radius:6px; border:1px solid #b2c8e5" value="cmd" />
    `,
  },
};

function createWindow(key) {
  const config = windowContent[key];
  if (!config) return;

  const template = document.getElementById('window-template');
  const windowEl = template.content.firstElementChild.cloneNode(true);
  const contentEl = windowEl.querySelector('.window-content');
  const titleEl = windowEl.querySelector('.title-text');

  titleEl.textContent = config.title;
  contentEl.innerHTML = config.render();
  windowEl.style.top = `${30 + windowCount * 20}px`;
  windowEl.style.left = `${30 + windowCount * 20}px`;
  windowEl.dataset.windowKey = key;
  windowEl.dataset.state = 'normal';

  makeDraggable(windowEl);

  const closeBtn = windowEl.querySelector('.btn-close');
  const minimizeBtn = windowEl.querySelector('.btn-minimize');
  const maximizeBtn = windowEl.querySelector('.btn-maximize');

  closeBtn.addEventListener('click', () => closeWindow(windowEl));
  minimizeBtn.addEventListener('click', () => minimizeWindow(windowEl));
  maximizeBtn.addEventListener('click', () => toggleMaximize(windowEl));

  windowEl.addEventListener('mousedown', () => focusWindow(windowEl));

  windowArea.appendChild(windowEl);
  focusWindow(windowEl);
  createTaskButton(windowEl, config.title);
  windowCount++;
}

function focusWindow(windowEl) {
  zIndexCounter++;
  windowEl.style.zIndex = zIndexCounter;
  windowArea.querySelectorAll('.window').forEach((win) => win.classList.remove('active'));
  windowEl.classList.add('active');
  const key = windowEl.dataset.windowKey;
  taskButtons.querySelectorAll('.task-button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.windowKey === key);
  });
}

function closeWindow(windowEl) {
  const key = windowEl.dataset.windowKey;
  const taskButton = taskButtons.querySelector(`[data-window-key="${key}"]`);
  if (taskButton) taskButton.remove();
  windowEl.remove();
}

function minimizeWindow(windowEl) {
  windowEl.style.display = 'none';
  const key = windowEl.dataset.windowKey;
  const btn = taskButtons.querySelector(`[data-window-key="${key}"]`);
  if (btn) btn.classList.remove('active');
}

function toggleMaximize(windowEl) {
  const state = windowEl.dataset.state;
  if (state === 'normal') {
    windowEl.dataset.previous = `${windowEl.style.left},${windowEl.style.top},${windowEl.style.width}`;
    windowEl.style.left = '8px';
    windowEl.style.top = '8px';
    windowEl.style.width = 'calc(100% - 16px)';
    windowEl.style.height = 'calc(100% - 64px)';
    windowEl.dataset.state = 'maximized';
  } else {
    const [left, top, width] = windowEl.dataset.previous.split(',');
    windowEl.style.left = left;
    windowEl.style.top = top;
    windowEl.style.width = width || '420px';
    windowEl.style.height = '';
    windowEl.dataset.state = 'normal';
  }
}

function restoreWindow(key) {
  const windowEl = windowArea.querySelector(`[data-window-key="${key}"]`);
  if (windowEl) {
    windowEl.style.display = 'block';
    focusWindow(windowEl);
    return windowEl;
  }
  createWindow(key);
}

function createTaskButton(windowEl, title) {
  const existing = taskButtons.querySelector(`[data-window-key="${windowEl.dataset.windowKey}"]`);
  if (existing) return;

  const btn = document.createElement('button');
  btn.className = 'task-button active';
  btn.dataset.windowKey = windowEl.dataset.windowKey;
  btn.innerHTML = `<span class="menu-icon icon-${windowEl.dataset.windowKey}"></span>${title}`;
  btn.addEventListener('click', () => {
    const target = restoreWindow(btn.dataset.windowKey);
    focusWindow(target);
    btn.classList.add('active');
  });
  taskButtons.appendChild(btn);
}

function makeDraggable(windowEl) {
  const titleBar = windowEl.querySelector('.title-bar');
  let offsetX = 0;
  let offsetY = 0;
  let dragging = false;

  titleBar.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
    focusWindow(windowEl);
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    windowEl.style.left = `${e.clientX - offsetX}px`;
    windowEl.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });
}

function toggleStartMenu() {
  const isVisible = startMenu.classList.toggle('visible');
  startButton.setAttribute('aria-expanded', isVisible);
  startMenu.setAttribute('aria-hidden', !isVisible);
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  clock.textContent = `${hours}:${minutes}`;
}

function arrangeIcons() {
  const icons = document.querySelectorAll('.icon');
  let top = 12;
  icons.forEach((icon) => {
    icon.style.position = 'absolute';
    icon.style.top = `${top}px`;
    icon.style.left = '12px';
    top += 90;
  });
}

function bindInteractions() {
  document.querySelectorAll('.icon').forEach((icon) => {
    icon.addEventListener('dblclick', () => restoreWindow(icon.dataset.window));
  });

  document.querySelectorAll('.start-menu .menu-item').forEach((item) => {
    item.addEventListener('click', () => {
      const key = item.dataset.window;
      if (key) {
        restoreWindow(key);
        startMenu.classList.remove('visible');
        startButton.setAttribute('aria-expanded', false);
        startMenu.setAttribute('aria-hidden', true);
      }
    });
  });

  startButton.addEventListener('click', toggleStartMenu);

  document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && e.target !== startButton) {
      startMenu.classList.remove('visible');
      startButton.setAttribute('aria-expanded', false);
      startMenu.setAttribute('aria-hidden', true);
    }
  });
}

arrangeIcons();
bindInteractions();
updateClock();
setInterval(updateClock, 1000);
