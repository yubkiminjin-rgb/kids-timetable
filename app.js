/* ===================== 상수 ===================== */
const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const SEMESTERS = [
  { key: 'semester1', label: '1학기' },
  { key: 'summer', label: '여름방학' },
  { key: 'semester2', label: '2학기' },
  { key: 'winter', label: '겨울방학' },
];
const DEFAULT_CATEGORIES = [
  { id: 'cat-school', name: '학교', color: '#cdeac0' },
  { id: 'cat-after', name: '방과후', color: '#ffe0b8' },
  { id: 'cat-academy', name: '학원', color: '#c9def7' },
];
const FALLBACK_COLOR = '#e3e0f3';
const STORAGE_KEY = 'kidsTimetableData_v1';
const ROW_H = 32; // px, .time-grid 한 칸(30분) 높이 - style.css --row-h 와 일치
const SCHOOL_CATEGORY_ID = 'cat-school';

const P1_REGULAR = [
  { title: '1교시', start: '09:00', end: '09:40' },
  { title: '2교시', start: '09:50', end: '10:30' },
  { title: '3교시', start: '10:40', end: '11:20' },
  { title: '4교시', start: '11:30', end: '12:10' },
  { title: '점심시간', start: '12:10', end: '12:50' },
  { title: '5교시', start: '12:50', end: '13:30' },
];
const P1_WED = P1_REGULAR.slice(0, 5); // 1~4교시 + 점심시간

const P3_REGULAR = [
  { title: '1교시', start: '09:00', end: '09:40' },
  { title: '2교시', start: '09:50', end: '10:30' },
  { title: '3교시', start: '10:40', end: '11:20' },
  { title: '4교시', start: '11:30', end: '12:10' },
  { title: '5교시', start: '12:20', end: '13:00' },
  { title: '점심시간', start: '13:00', end: '13:40' },
];
const P3_TUE = [...P3_REGULAR, { title: '6교시', start: '13:40', end: '14:20' }];

const DEFAULT_SCHOOL_PRESETS = [
  {
    id: 'preset-solgae-1',
    name: '솔개초 1학년',
    days: {
      0: P1_REGULAR, 1: P1_REGULAR, 2: P1_WED, 3: P1_REGULAR, 4: P1_REGULAR, 5: [], 6: [],
    },
  },
  {
    id: 'preset-solgae-3',
    name: '솔개초 3학년',
    days: {
      0: P3_REGULAR, 1: P3_TUE, 2: P3_REGULAR, 3: P3_REGULAR, 4: P3_REGULAR, 5: [], 6: [],
    },
  },
];

/* 처음 접속한 사용자에게 보여줄 샘플 프로필 (자유롭게 수정/삭제 가능) */
const SAMPLE_PROFILE_ID = 'sample-profile-1';
const SAMPLE_PROFILE = {
  id: SAMPLE_PROFILE_ID,
  name: '다민(샘플)',
  startTime: '09:00',
  endTime: '20:00',
  schoolPresetId: 'preset-solgae-3',
  days: [0, 1, 2, 3, 4],
};

/* 1학기 학교 일정 (요일별 1~5교시 + 점심시간, 화요일은 6교시 추가) */
const SAMPLE_SEMESTER1_SCHOOL_DAY = [
  { title: '1교시', start: '09:00', end: '09:40' },
  { title: '2교시', start: '09:50', end: '10:30' },
  { title: '3교시', start: '10:40', end: '11:20' },
  { title: '4교시', start: '11:30', end: '12:10' },
  { title: '5교시', start: '12:20', end: '13:00' },
  { title: '점심시간', start: '13:00', end: '13:30', customColor: '#fffc9e' },
];
const SAMPLE_SEMESTER1_TUE_EXTRA = { title: '6교시', start: '13:40', end: '14:20' };

const SAMPLE_SEMESTER1_EXTRA = [
  { day: 0, start: '13:30', end: '14:30', title: '피아노', note: '', categoryId: 'cat-academy', customColor: null },
  { day: 0, start: '15:30', end: '18:00', title: '에이프릴', note: '동일 스위트\n후문', categoryId: 'cat-academy', customColor: '#ffd6ec' },
  { day: 1, start: '17:00', end: '20:00', title: '수학의아침', note: 'OK부동산 탑승\n솔개초 하차', categoryId: 'cat-academy', customColor: '#d8d4ff' },
  { day: 2, start: '14:30', end: '16:00', title: '성당', note: '', categoryId: 'cat-after', customColor: '#ffe2c2' },
  { day: 2, start: '16:00', end: '18:00', title: '에이프릴', note: '동일 후문', categoryId: 'cat-academy', customColor: '#ffd6ec' },
  { day: 2, start: '18:30', end: '19:00', title: '밀크티 맞춤톡', note: '', categoryId: 'cat-academy', customColor: '#ffe2c2' },
  { day: 3, start: '13:30', end: '14:30', title: '피아노', note: '', categoryId: 'cat-academy', customColor: null },
  { day: 3, start: '15:30', end: '18:30', title: '수학의 아침', note: '탑승 OK부동산, 하차 솔개초', categoryId: 'cat-school', customColor: '#d8d4ff' },
  { day: 4, start: '14:00', end: '15:00', title: '피아노', note: '', categoryId: 'cat-academy', customColor: null },
  { day: 4, start: '15:30', end: '18:00', title: '에이프릴', note: '동일 후문', categoryId: 'cat-academy', customColor: '#ffd6ec' },
];

function buildSampleSchedule() {
  const sched = { semester1: [], summer: [], semester2: [], winter: [] };

  for (let d = 0; d < 5; d++) {
    const periods = SAMPLE_SEMESTER1_SCHOOL_DAY.concat(d === 1 ? [SAMPLE_SEMESTER1_TUE_EXTRA] : []);
    periods.forEach((period) => {
      sched.semester1.push({
        id: uid(),
        day: d,
        start: period.start,
        end: period.end,
        title: period.title,
        note: '',
        categoryId: SCHOOL_CATEGORY_ID,
        customColor: period.customColor || null,
      });
    });
  }
  SAMPLE_SEMESTER1_EXTRA.forEach((e) => {
    sched.semester1.push({ id: uid(), ...e });
  });

  const preset3 = DEFAULT_SCHOOL_PRESETS.find((p) => p.id === 'preset-solgae-3');
  for (let d = 0; d < 5; d++) {
    (preset3.days[d] || []).forEach((period) => {
      sched.semester2.push({
        id: uid(),
        day: d,
        start: period.start,
        end: period.end,
        title: period.title,
        note: '',
        categoryId: SCHOOL_CATEGORY_ID,
        customColor: null,
      });
    });
  }

  return sched;
}

/* ===================== 상태 / 저장 ===================== */
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.categories || !parsed.categories.length) {
        parsed.categories = DEFAULT_CATEGORIES.map((c) => ({ ...c }));
      }
      if (!parsed.schoolPresets || !parsed.schoolPresets.length) {
        parsed.schoolPresets = JSON.parse(JSON.stringify(DEFAULT_SCHOOL_PRESETS));
      }
      parsed.profiles = parsed.profiles || [];
      parsed.schedules = parsed.schedules || {};
      return parsed;
    }
  } catch (e) {
    console.warn('failed to load state', e);
  }
  return {
    profiles: [{ ...SAMPLE_PROFILE }],
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    schoolPresets: JSON.parse(JSON.stringify(DEFAULT_SCHOOL_PRESETS)),
    schedules: { [SAMPLE_PROFILE_ID]: buildSampleSchedule() },
    currentProfileId: null,
    currentSemester: 'semester1',
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function uid() {
  return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function ensureSchedule(profileId) {
  if (!state.schedules[profileId]) {
    state.schedules[profileId] = { semester1: [], summer: [], semester2: [], winter: [] };
  }
  return state.schedules[profileId];
}

function getCurrentProfile() {
  return state.profiles.find((p) => p.id === state.currentProfileId) || null;
}

/* ===================== 시간 유틸 ===================== */
function timeToMin(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}
function minToTime(min) {
  min = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}
function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/* ===================== 카테고리 색상 ===================== */
function getEntryColor(entry) {
  if (entry.customColor) return entry.customColor;
  const cat = state.categories.find((c) => c.id === entry.categoryId);
  return cat ? cat.color : FALLBACK_COLOR;
}

/* ===================== 표시 요일 / 일정 병합 ===================== */
function getDisplayDays(profile) {
  return (profile.days && profile.days.length) ? profile.days : [0, 1, 2, 3, 4, 5, 6];
}

function entrySignature(entry) {
  return [entry.start, entry.end, entry.title, entry.note || '', entry.categoryId, entry.customColor || ''].join('|');
}

// displayDays 순서대로 dayLayouts(각 요일의 layoutDayEntries 결과)를 받아
// 연속된 요일에서 동일한 일정(단독 항목)을 찾아 병합 그룹을 반환
// 반환: { used: Set<entryId>, mergedGroups: [{ entry, topPct, heightPct, startPos, span, group }] }
function findMergedGroups(dayLayouts, N) {
  const used = new Set();
  const mergedGroups = [];
  for (let pos = 0; pos < N; pos++) {
    for (const l of dayLayouts[pos]) {
      if (l.isExtra || l.widthPct !== 100 || used.has(l.entry.id)) continue;
      const sig = entrySignature(l.entry);
      const group = [l.entry];
      const usedHere = [l.entry.id];
      let span = 1;
      for (let p2 = pos + 1; p2 < N; p2++) {
        const match = dayLayouts[p2].find((l2) =>
          !l2.isExtra && l2.widthPct === 100 && !used.has(l2.entry.id) &&
          l2.topPct === l.topPct && l2.heightPct === l.heightPct &&
          entrySignature(l2.entry) === sig
        );
        if (!match) break;
        group.push(match.entry);
        usedHere.push(match.entry.id);
        span++;
      }
      if (span >= 2) {
        usedHere.forEach((id) => used.add(id));
        mergedGroups.push({ entry: l.entry, topPct: l.topPct, heightPct: l.heightPct, startPos: pos, span, group });
      }
    }
  }
  return { used, mergedGroups };
}

/* ===================== 겹침 레이아웃 계산 ===================== */
// entries: 같은 요일의 일정 배열
// 반환: [{ entry, topPct, heightPct, leftPct, widthPct, isExtra }]
function layoutDayEntries(entries, profStart, profEnd) {
  const totalMin = profEnd - profStart;
  if (!entries.length) return [];

  const sorted = [...entries].sort((a, b) => {
    const sa = timeToMin(a.start), sb = timeToMin(b.start);
    if (sa !== sb) return sa - sb;
    return a.id < b.id ? -1 : 1;
  });

  // transitive overlap clustering
  const clusters = [];
  let current = [];
  let currentMaxEnd = -Infinity;
  for (const e of sorted) {
    const s = timeToMin(e.start), en = timeToMin(e.end);
    if (current.length && s < currentMaxEnd) {
      current.push(e);
      currentMaxEnd = Math.max(currentMaxEnd, en);
    } else {
      if (current.length) clusters.push(current);
      current = [e];
      currentMaxEnd = en;
    }
  }
  if (current.length) clusters.push(current);

  const result = [];
  for (const cluster of clusters) {
    cluster.forEach((entry, idx) => {
      const s = clamp(timeToMin(entry.start), profStart, profEnd);
      const en = clamp(timeToMin(entry.end), profStart, profEnd);
      const topPct = ((s - profStart) / totalMin) * 100;
      const heightPct = ((en - s) / totalMin) * 100;

      if (cluster.length === 1) {
        result.push({ entry, topPct, heightPct, leftPct: 0, widthPct: 100, isExtra: false });
      } else if (idx === 0) {
        result.push({ entry, topPct, heightPct, leftPct: 0, widthPct: 50, isExtra: false });
      } else if (idx === 1) {
        result.push({ entry, topPct, heightPct, leftPct: 50, widthPct: 50, isExtra: false });
      } else {
        result.push({ entry, topPct, heightPct: Math.max(heightPct, 4), leftPct: 0, widthPct: 100, isExtra: true });
      }
    });
  }
  return result;
}

/* ===================== 화면 전환 ===================== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ===================== 프로필 목록 화면 ===================== */
function renderProfileList() {
  const list = document.getElementById('profile-list');
  list.innerHTML = '';
  state.profiles.forEach((profile) => {
    const card = document.createElement('div');
    card.className = 'profile-card';

    const info = document.createElement('div');
    info.className = 'profile-card-info';
    const name = document.createElement('div');
    name.className = 'profile-card-name';
    name.textContent = profile.name;
    const time = document.createElement('div');
    time.className = 'profile-card-time';
    time.textContent = `${profile.startTime} ~ ${profile.endTime}`;
    info.appendChild(name);
    info.appendChild(time);

    const actions = document.createElement('div');
    actions.className = 'profile-card-actions';
    const editBtn = document.createElement('button');
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProfileModal(profile);
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.className = 'danger';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`'${profile.name}' 프로필과 시간표를 삭제할까요?`)) {
        state.profiles = state.profiles.filter((p) => p.id !== profile.id);
        delete state.schedules[profile.id];
        saveState();
        renderProfileList();
      }
    });
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    card.appendChild(info);
    card.appendChild(actions);
    card.addEventListener('click', () => selectProfile(profile.id));
    list.appendChild(card);
  });

  document.getElementById('profile-empty-hint').style.display = state.profiles.length ? 'none' : 'block';
}

function selectProfile(id) {
  state.currentProfileId = id;
  state.currentSemester = 'semester1';
  ensureSchedule(id);
  saveState();
  renderTimetableScreen();
  showScreen('screen-timetable');
}

/* ===================== 프로필 추가/수정 모달 ===================== */
let editingProfileId = null;

function openProfileModal(profile) {
  editingProfileId = profile ? profile.id : null;
  document.getElementById('profile-form-title').textContent = profile ? '프로필 수정' : '프로필 추가';
  document.getElementById('profile-name-input').value = profile ? profile.name : '';
  document.getElementById('profile-start-input').value = profile ? profile.startTime : '07:00';
  document.getElementById('profile-end-input').value = profile ? profile.endTime : '22:00';
  renderDayPicker(profile ? getDisplayDays(profile) : [0, 1, 2, 3, 4, 5, 6]);
  renderSchoolPresetSelect(profile ? profile.schoolPresetId : '');
  document.getElementById('profile-preset-apply-row').style.display =
    profile && profile.schoolPresetId ? 'block' : 'none';
  openModal('modal-profile-form');
}

function renderDayPicker(selectedDays) {
  const wrap = document.getElementById('profile-day-picker');
  wrap.innerHTML = '';
  DAYS.forEach((label, i) => {
    const chip = document.createElement('div');
    chip.className = 'day-chip' + (selectedDays.includes(i) ? ' selected' : '');
    chip.textContent = label;
    chip.dataset.day = i;
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
    wrap.appendChild(chip);
  });
}

function renderSchoolPresetSelect(selectedId) {
  const select = document.getElementById('profile-school-preset-select');
  select.innerHTML = '';
  const noneOpt = document.createElement('option');
  noneOpt.value = '';
  noneOpt.textContent = '사용 안 함';
  select.appendChild(noneOpt);
  state.schoolPresets.forEach((preset) => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = preset.name;
    select.appendChild(opt);
  });
  select.value = selectedId || '';
}

/* 프리셋을 프로필의 1학기/2학기 '학교' 일정에 적용 (기존 학교 일정은 덮어씀) */
function applySchoolPreset(profileId, presetId) {
  const preset = state.schoolPresets.find((p) => p.id === presetId);
  if (!preset) return;
  const sched = ensureSchedule(profileId);
  ['semester1', 'semester2'].forEach((semKey) => {
    const remaining = sched[semKey].filter((e) => e.categoryId !== SCHOOL_CATEGORY_ID);
    for (let d = 0; d < 7; d++) {
      const periods = preset.days[d] || [];
      periods.forEach((period) => {
        remaining.push({
          id: uid(),
          day: d,
          start: period.start,
          end: period.end,
          title: period.title,
          note: '',
          categoryId: SCHOOL_CATEGORY_ID,
          customColor: null,
        });
      });
    }
    sched[semKey] = remaining;
  });
  saveState();
}

function saveProfile() {
  const name = document.getElementById('profile-name-input').value.trim();
  let start = document.getElementById('profile-start-input').value;
  let end = document.getElementById('profile-end-input').value;
  if (!name) {
    alert('이름을 입력해주세요.');
    return;
  }
  if (!start || !end || timeToMin(start) >= timeToMin(end)) {
    alert('시작 시간이 종료 시간보다 빨라야 해요.');
    return;
  }
  const presetId = document.getElementById('profile-school-preset-select').value || null;

  const dayChips = [...document.querySelectorAll('#profile-day-picker .day-chip')];
  const selectedDays = dayChips
    .filter((c) => c.classList.contains('selected'))
    .map((c) => Number(c.dataset.day))
    .sort((a, b) => a - b);
  if (!selectedDays.length) {
    alert('표시할 요일을 1개 이상 선택해주세요.');
    return;
  }

  if (editingProfileId) {
    const p = state.profiles.find((p) => p.id === editingProfileId);
    p.name = name;
    p.startTime = start;
    p.endTime = end;
    p.days = selectedDays;
    p.schoolPresetId = presetId;
  } else {
    const id = uid();
    state.profiles.push({ id, name, startTime: start, endTime: end, days: selectedDays, schoolPresetId: presetId });
    ensureSchedule(id);
    if (presetId) applySchoolPreset(id, presetId);
  }
  saveState();
  closeAllModals();
  renderProfileList();
  if (state.currentProfileId === editingProfileId) renderTimetableScreen();
}

/* ===================== 시간표 화면 ===================== */
function renderTimetableScreen() {
  const profile = getCurrentProfile();
  if (!profile) return;
  document.getElementById('profile-title-display').textContent = profile.name;
  renderSemesterTabs();
  renderGrid();
}

function renderSemesterTabs() {
  const wrap = document.getElementById('semester-tabs');
  wrap.innerHTML = '';
  SEMESTERS.forEach((sem) => {
    const btn = document.createElement('button');
    btn.className = 'semester-tab' + (state.currentSemester === sem.key ? ' active' : '');
    btn.textContent = sem.label;
    btn.addEventListener('click', () => {
      state.currentSemester = sem.key;
      saveState();
      renderSemesterTabs();
      renderGrid();
    });
    wrap.appendChild(btn);
  });
}

function renderGrid() {
  const profile = getCurrentProfile();
  const container = document.getElementById('time-grid');
  container.innerHTML = '';
  const grid = buildScreenGrid(profile, getCurrentEntries(), { showTime: true });
  container.appendChild(grid);
}

function getCurrentEntries() {
  const profile = getCurrentProfile();
  const sched = ensureSchedule(profile.id);
  return sched[state.currentSemester];
}

/* 화면용 그리드 DOM 생성 */
function buildScreenGrid(profile, entries, opts) {
  opts = opts || { showTime: true };
  const profStart = timeToMin(profile.startTime);
  const profEnd = timeToMin(profile.endTime);
  const totalSlots = (profEnd - profStart) / 30;
  const totalHeight = totalSlots * ROW_H;
  const displayDays = getDisplayDays(profile);
  const N = displayDays.length;

  const root = document.createElement('div');

  // 헤더
  const header = document.createElement('div');
  header.className = 'grid-header';
  const corner = document.createElement('div');
  corner.className = 'corner-cell';
  header.appendChild(corner);
  displayDays.forEach((d) => {
    const dh = document.createElement('div');
    dh.className = 'day-header' + (d >= 5 ? ' weekend' : '');
    dh.textContent = DAYS[d];
    header.appendChild(dh);
  });
  root.appendChild(header);

  // 본문
  const body = document.createElement('div');
  body.className = 'grid-body';

  const timeCol = document.createElement('div');
  timeCol.className = 'time-col';
  timeCol.style.height = totalHeight + 'px';
  for (let h = Math.ceil(profStart / 60) * 60; h < profEnd; h += 60) {
    const label = document.createElement('div');
    label.className = 'time-label';
    label.style.top = ((h - profStart) / (profEnd - profStart)) * totalHeight + 'px';
    const span = document.createElement('span');
    span.textContent = minToTime(h);
    label.appendChild(span);
    timeCol.appendChild(label);
  }
  body.appendChild(timeCol);

  const daysRow = document.createElement('div');
  daysRow.className = 'days-row';
  daysRow.style.height = totalHeight + 'px';

  const dayLayouts = displayDays.map((d) => {
    const dayEntries = entries.filter((e) => e.day === d);
    return layoutDayEntries(dayEntries, profStart, profEnd);
  });
  const { used, mergedGroups } = findMergedGroups(dayLayouts, N);

  displayDays.forEach((d, pos) => {
    const dayCol = document.createElement('div');
    dayCol.className = 'day-col';
    dayCol.style.height = totalHeight + 'px';
    dayCol.dataset.day = d;

    const dayEntries = entries.filter((e) => e.day === d);
    dayLayouts[pos].forEach((l) => {
      if (used.has(l.entry.id)) return;
      dayCol.appendChild(buildEntryBox(l, opts));
    });

    dayCol.addEventListener('click', (e) => {
      const box = e.target.closest('.entry-box');
      if (box) {
        const entry = dayEntries.find((en) => en.id === box.dataset.entryId);
        if (entry) openEntryModal(d, null, entry, null);
        return;
      }
      const rect = dayCol.getBoundingClientRect();
      const pct = (e.clientY - rect.top) / rect.height;
      const totalMin = profEnd - profStart;
      let startMin = profStart + Math.floor((pct * totalMin) / 30) * 30;
      startMin = clamp(startMin, profStart, profEnd - 30);
      openEntryModal(d, startMin, null, null);
    });

    daysRow.appendChild(dayCol);
  });

  // 연속 요일에 동일한 일정이 있으면 하나로 병합해 표시
  mergedGroups.forEach((g) => {
    const box = buildEntryBox({
      entry: g.entry,
      topPct: g.topPct,
      heightPct: g.heightPct,
      leftPct: (g.startPos / N) * 100,
      widthPct: (g.span / N) * 100,
      isExtra: false,
    }, opts);
    box.classList.add('merged');
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      openEntryModal(g.entry.day, null, g.entry, g.group);
    });
    daysRow.appendChild(box);
  });

  body.appendChild(daysRow);
  root.appendChild(body);

  return root;
}

function buildEntryBox(layout, opts) {
  opts = opts || { showTime: true };
  const { entry, topPct, heightPct, leftPct, widthPct, isExtra } = layout;
  const box = document.createElement('div');
  box.className = 'entry-box' + (isExtra ? ' is-extra' : '');
  box.dataset.entryId = entry.id;
  box.style.top = topPct + '%';
  box.style.height = heightPct + '%';
  box.style.left = leftPct + '%';
  box.style.width = widthPct + '%';
  box.style.background = getEntryColor(entry);

  const title = document.createElement('div');
  title.className = 'entry-title';
  title.textContent = entry.title;
  box.appendChild(title);

  if (!isExtra) {
    if (opts.showTime) {
      const time = document.createElement('div');
      time.className = 'entry-time' + (opts.showTime === 'small' ? ' entry-time-mini' : '');
      time.textContent = `${entry.start}-${entry.end}`;
      box.appendChild(time);
    }

    if (entry.note) {
      const note = document.createElement('div');
      note.className = 'entry-note';
      note.textContent = entry.note;
      box.appendChild(note);
    }
  }
  return box;
}

/* ===================== 일정 항목 편집 모달 ===================== */
const PASTEL_COLORS = [
  '#ffd6d6', '#ffe2c2', '#fff6b8', '#d8f5c4',
  '#c2efe0', '#c7e6ff', '#d8d4ff', '#ffd6ec',
];

let editingEntry = null;
let editingDay = null;
let selectedCategoryId = null;
let selectedCustomColor = PASTEL_COLORS[0];
let editingGroup = null; // 연속 요일에 병합된 동일 일정을 함께 수정할 때 사용

function renderColorPalette() {
  const wrap = document.getElementById('entry-color-palette');
  wrap.innerHTML = '';
  PASTEL_COLORS.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch' + (color === selectedCustomColor ? ' selected' : '');
    swatch.style.background = color;
    swatch.addEventListener('click', () => {
      selectedCustomColor = color;
      renderColorPalette();
    });
    wrap.appendChild(swatch);
  });
}

function openEntryModal(day, defaultStartMin, entry, group) {
  editingEntry = entry || null;
  editingDay = day;
  editingGroup = (group && group.length > 1) ? group : null;
  const profile = getCurrentProfile();
  const profStart = timeToMin(profile.startTime);
  const profEnd = timeToMin(profile.endTime);

  document.getElementById('entry-edit-title').textContent = entry
    ? (editingGroup ? `일정 수정 (${editingGroup.length}개 요일 공통)` : '일정 수정')
    : '일정 추가';
  document.getElementById('entry-title-input').value = entry ? entry.title : '';
  document.getElementById('entry-note-input').value = entry ? entry.note || '' : '';
  document.getElementById('entry-error-msg').textContent = '';

  let startMin, endMin;
  if (entry) {
    startMin = timeToMin(entry.start);
    endMin = timeToMin(entry.end);
  } else {
    startMin = defaultStartMin != null ? defaultStartMin : profStart;
    endMin = clamp(startMin + 60, startMin + 30, profEnd);
  }
  document.getElementById('entry-start-input').value = minToTime(startMin);
  document.getElementById('entry-end-input').value = minToTime(endMin);

  selectedCategoryId = entry ? entry.categoryId : (state.categories[0] ? state.categories[0].id : null);
  renderCategoryPicker();

  const overrideCheck = document.getElementById('entry-color-override-check');
  overrideCheck.checked = entry ? !!entry.customColor : false;
  selectedCustomColor = (entry && entry.customColor) ? entry.customColor : PASTEL_COLORS[0];
  renderColorPalette();
  document.getElementById('entry-color-palette').classList.toggle('disabled', !overrideCheck.checked);

  document.getElementById('btn-entry-delete').style.display = entry ? 'inline-flex' : 'none';

  openModal('modal-entry-edit');
}

function getCategoryById(id) {
  return state.categories.find((c) => c.id === id);
}

function renderCategoryPicker() {
  const wrap = document.getElementById('entry-category-picker');
  wrap.innerHTML = '';
  state.categories.forEach((cat) => {
    const chip = document.createElement('div');
    chip.className = 'category-chip' + (cat.id === selectedCategoryId ? ' selected' : '');
    chip.textContent = cat.name;
    chip.style.background = cat.color;
    chip.addEventListener('click', () => {
      selectedCategoryId = cat.id;
      renderCategoryPicker();
      const overrideCheck = document.getElementById('entry-color-override-check');
      if (!overrideCheck.checked) {
        document.getElementById('entry-color-input').value = cat.color;
      }
    });
    wrap.appendChild(chip);
  });
}

function saveEntry() {
  const profile = getCurrentProfile();
  const profStart = timeToMin(profile.startTime);
  const profEnd = timeToMin(profile.endTime);

  const title = document.getElementById('entry-title-input').value.trim();
  const note = document.getElementById('entry-note-input').value.trim();
  let start = document.getElementById('entry-start-input').value;
  let end = document.getElementById('entry-end-input').value;
  const errorEl = document.getElementById('entry-error-msg');

  if (!title) {
    errorEl.textContent = '메인 제목을 입력해주세요.';
    return;
  }
  if (!start || !end) {
    errorEl.textContent = '시작/종료 시간을 입력해주세요.';
    return;
  }
  const startMin = timeToMin(start);
  const endMin = timeToMin(end);

  if (startMin >= endMin) {
    errorEl.textContent = '시작 시간이 종료 시간보다 빨라야 해요.';
    return;
  }
  if (startMin < profStart || endMin > profEnd) {
    errorEl.textContent = `시간표 범위(${profile.startTime}~${profile.endTime}) 안에서 입력해주세요.`;
    return;
  }
  if (!selectedCategoryId) {
    errorEl.textContent = '카테고리를 선택해주세요.';
    return;
  }

  const overrideCheck = document.getElementById('entry-color-override-check');
  const customColor = overrideCheck.checked ? selectedCustomColor : null;

  const entries = getCurrentEntries();

  if (editingGroup) {
    editingGroup.forEach((ge) => {
      const idx = entries.findIndex((e) => e.id === ge.id);
      if (idx >= 0) {
        entries[idx] = {
          ...entries[idx],
          start: minToTime(startMin),
          end: minToTime(endMin),
          title,
          note,
          categoryId: selectedCategoryId,
          customColor,
        };
      }
    });
  } else {
    const entryData = {
      id: editingEntry ? editingEntry.id : uid(),
      day: editingDay,
      start: minToTime(startMin),
      end: minToTime(endMin),
      title,
      note,
      categoryId: selectedCategoryId,
      customColor,
    };
    if (editingEntry) {
      const idx = entries.findIndex((e) => e.id === editingEntry.id);
      entries[idx] = entryData;
    } else {
      entries.push(entryData);
    }
  }
  saveState();
  closeAllModals();
  renderGrid();
}

function deleteEntry() {
  if (!editingEntry) return;
  const entries = getCurrentEntries();
  if (editingGroup) {
    if (!confirm(`이 일정(${editingGroup.length}개 요일에 공통 적용됨)을 모두 삭제할까요?`)) return;
    const ids = new Set(editingGroup.map((e) => e.id));
    const filtered = entries.filter((e) => !ids.has(e.id));
    const sched = ensureSchedule(getCurrentProfile().id);
    sched[state.currentSemester] = filtered;
  } else {
    if (!confirm('이 일정을 삭제할까요?')) return;
    const idx = entries.findIndex((e) => e.id === editingEntry.id);
    if (idx >= 0) entries.splice(idx, 1);
  }
  saveState();
  closeAllModals();
  renderGrid();
}

/* ===================== 카테고리 설정 모달 ===================== */
function openSettingsModal() {
  renderCategoryList();
  renderPresetList();
  openModal('modal-settings');
}

function renderCategoryList() {
  const wrap = document.getElementById('category-list');
  wrap.innerHTML = '';
  state.categories.forEach((cat) => {
    const row = document.createElement('div');
    row.className = 'category-row';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = cat.color;
    colorInput.addEventListener('input', () => {
      cat.color = colorInput.value;
      saveState();
      renderGrid();
    });

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = cat.name;
    nameInput.maxLength = 10;
    nameInput.addEventListener('input', () => {
      cat.name = nameInput.value;
      saveState();
    });
    nameInput.addEventListener('blur', () => renderGrid());

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => {
      if (state.categories.length <= 1) {
        alert('최소 1개의 카테고리가 필요해요.');
        return;
      }
      if (!confirm(`'${cat.name}' 카테고리를 삭제할까요? (이 카테고리를 쓰는 일정은 회색으로 표시돼요)`)) return;
      state.categories = state.categories.filter((c) => c.id !== cat.id);
      saveState();
      renderCategoryList();
      renderGrid();
    });

    row.appendChild(colorInput);
    row.appendChild(nameInput);
    row.appendChild(delBtn);
    wrap.appendChild(row);
  });
}

function addCategory() {
  state.categories.push({ id: uid(), name: '새 카테고리', color: '#e3e0f3' });
  saveState();
  renderCategoryList();
}

/* ===================== 학교 시간표 기본값 ===================== */
let editingPresetId = null;

function renderPresetList() {
  const wrap = document.getElementById('preset-list');
  wrap.innerHTML = '';
  state.schoolPresets.forEach((preset) => {
    const row = document.createElement('div');
    row.className = 'preset-row';

    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = preset.name;
    nameInput.maxLength = 20;
    nameInput.addEventListener('input', () => {
      preset.name = nameInput.value;
      saveState();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = '편집';
    editBtn.addEventListener('click', () => openPresetEditModal(preset));

    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.className = 'danger';
    delBtn.addEventListener('click', () => {
      if (!confirm(`'${preset.name}' 기본값을 삭제할까요?`)) return;
      state.schoolPresets = state.schoolPresets.filter((p) => p.id !== preset.id);
      state.profiles.forEach((p) => {
        if (p.schoolPresetId === preset.id) p.schoolPresetId = null;
      });
      saveState();
      renderPresetList();
    });

    row.appendChild(nameInput);
    row.appendChild(editBtn);
    row.appendChild(delBtn);
    wrap.appendChild(row);
  });
}

function addPreset() {
  const preset = { id: uid(), name: '새 기본값', days: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] } };
  state.schoolPresets.push(preset);
  saveState();
  renderPresetList();
  openPresetEditModal(preset);
}

function openPresetEditModal(preset) {
  editingPresetId = preset.id;
  document.getElementById('preset-name-input').value = preset.name;
  renderPresetDaysEditor(preset);
  openModal('modal-preset-edit');
}

function renderPresetDaysEditor(preset) {
  const wrap = document.getElementById('preset-days-editor');
  wrap.innerHTML = '';
  for (let d = 0; d < 7; d++) {
    if (!preset.days[d]) preset.days[d] = [];
    const block = document.createElement('div');
    block.className = 'preset-day-block';

    const title = document.createElement('div');
    title.className = 'preset-day-title';
    title.textContent = DAYS[d] + '요일';
    block.appendChild(title);

    preset.days[d].forEach((period, idx) => {
      const row = document.createElement('div');
      row.className = 'period-row';

      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.value = period.title;
      titleInput.placeholder = '예: 1교시';
      titleInput.maxLength = 10;
      titleInput.addEventListener('input', () => {
        period.title = titleInput.value;
        saveState();
      });

      const startInput = document.createElement('input');
      startInput.type = 'time';
      startInput.value = period.start;
      startInput.step = 1800;
      startInput.addEventListener('input', () => {
        period.start = startInput.value;
        saveState();
      });

      const endInput = document.createElement('input');
      endInput.type = 'time';
      endInput.value = period.end;
      endInput.step = 1800;
      endInput.addEventListener('input', () => {
        period.end = endInput.value;
        saveState();
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', () => {
        preset.days[d].splice(idx, 1);
        saveState();
        renderPresetDaysEditor(preset);
      });

      row.appendChild(titleInput);
      row.appendChild(startInput);
      row.appendChild(endInput);
      row.appendChild(delBtn);
      block.appendChild(row);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'btn-add-period';
    addBtn.textContent = '+ 교시 추가';
    addBtn.addEventListener('click', () => {
      const list = preset.days[d];
      const last = list[list.length - 1];
      const start = last ? last.end : '09:00';
      list.push({ title: `${list.length + 1}교시`, start, end: minToTime(timeToMin(start) + 40) });
      saveState();
      renderPresetDaysEditor(preset);
    });
    block.appendChild(addBtn);

    wrap.appendChild(block);
  }
}

function closePresetEditModal() {
  renderPresetList();
  openModal('modal-settings');
}

/* ===================== 학기 일정 복사 ===================== */
function openCopySemesterModal() {
  const fromSelect = document.getElementById('copy-from-select');
  const toSelect = document.getElementById('copy-to-select');
  fromSelect.innerHTML = '';
  toSelect.innerHTML = '';
  SEMESTERS.forEach((sem) => {
    const opt1 = document.createElement('option');
    opt1.value = sem.key;
    opt1.textContent = sem.label;
    fromSelect.appendChild(opt1);
    const opt2 = document.createElement('option');
    opt2.value = sem.key;
    opt2.textContent = sem.label;
    toSelect.appendChild(opt2);
  });
  fromSelect.value = state.currentSemester;
  toSelect.value = SEMESTERS.find((s) => s.key !== state.currentSemester).key;
  openModal('modal-copy-semester');
}

function copySemesterSchedule() {
  const fromKey = document.getElementById('copy-from-select').value;
  const toKey = document.getElementById('copy-to-select').value;
  if (fromKey === toKey) {
    alert('원본과 대상 학기가 같아요. 다른 학기를 선택해주세요.');
    return;
  }
  const fromLabel = SEMESTERS.find((s) => s.key === fromKey).label;
  const toLabel = SEMESTERS.find((s) => s.key === toKey).label;
  if (!confirm(`${toLabel} 일정을 모두 지우고 ${fromLabel} 일정으로 덮어쓸까요?`)) return;

  const profile = getCurrentProfile();
  const sched = ensureSchedule(profile.id);
  sched[toKey] = sched[fromKey].map((entry) => ({ ...entry, id: uid() }));
  saveState();
  if (state.currentSemester === toKey) renderGrid();
  closeAllModals();
}

/* ===================== 모달 공통 ===================== */
function openModal(id) {
  document.querySelectorAll('.modal').forEach((m) => m.classList.remove('open'));
  document.getElementById(id).classList.add('open');
  document.getElementById('modal-overlay').classList.add('open');
}
function closeAllModals() {
  document.querySelectorAll('.modal').forEach((m) => m.classList.remove('open'));
  document.getElementById('modal-overlay').classList.remove('open');
}

/* ===================== 이미지 저장 (JPG) ===================== */
let currentImageFormat = 'basic';

function buildBasicImageCard(profile, entries, titleText) {
  const card = document.createElement('div');
  card.style.background = '#ffffff';
  card.style.padding = '20px';
  card.style.fontFamily = "'Pretendard', sans-serif";
  card.style.width = '660px';

  const title = document.createElement('div');
  title.style.fontSize = '20px';
  title.style.fontWeight = '800';
  title.style.marginBottom = '12px';
  title.style.color = '#34304a';
  title.style.textAlign = 'center';
  title.textContent = titleText;
  card.appendChild(title);

  card.appendChild(buildScreenGrid(profile, entries, { showTime: 'small' }));
  return card;
}

// 인스타그램 스토리(9:16)에 어울리는 세로형 카드
function buildStoryImageCard(profile, entries, titleText, host) {
  const CARD_W = 1080;
  const CARD_H = 1920;
  const PAD = 64;

  const card = document.createElement('div');
  card.style.width = CARD_W + 'px';
  card.style.height = CARD_H + 'px';
  card.style.boxSizing = 'border-box';
  card.style.padding = PAD + 'px';
  card.style.background = 'linear-gradient(180deg, #f3f0fd 0%, #ffffff 45%)';
  card.style.fontFamily = "'Pretendard', sans-serif";
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.alignItems = 'center';
  card.style.overflow = 'hidden';

  const title = document.createElement('div');
  title.style.fontSize = '52px';
  title.style.fontWeight = '800';
  title.style.color = '#34304a';
  title.style.textAlign = 'center';
  title.style.marginTop = '12px';
  title.style.marginBottom = '48px';
  title.textContent = titleText;
  card.appendChild(title);

  const gridWrap = document.createElement('div');
  gridWrap.style.flex = '1';
  gridWrap.style.display = 'flex';
  gridWrap.style.alignItems = 'center';
  gridWrap.style.justifyContent = 'center';
  gridWrap.style.width = '100%';
  gridWrap.style.minHeight = '0';
  gridWrap.style.position = 'relative';

  const gridInner = document.createElement('div');
  gridInner.style.transformOrigin = 'center center';

  const grid = buildScreenGrid(profile, entries, { showTime: 'small' });
  gridInner.appendChild(grid);
  gridWrap.appendChild(gridInner);
  card.appendChild(gridWrap);

  // 측정을 위해 먼저 DOM에 부착
  host.appendChild(card);

  const availW = CARD_W - PAD * 2;
  const availH = gridWrap.getBoundingClientRect().height;
  const naturalW = grid.offsetWidth;
  const naturalH = grid.offsetHeight;
  const scale = Math.min(availW / naturalW, availH / naturalH, 3);

  gridInner.style.width = naturalW + 'px';
  gridInner.style.height = naturalH + 'px';
  gridInner.style.transform = `scale(${scale})`;

  return card;
}

async function generateImage(format) {
  const profile = getCurrentProfile();
  const entries = getCurrentEntries();
  const semesterLabel = SEMESTERS.find((s) => s.key === state.currentSemester).label;
  const titleText = `${profile.name}의 시간표 - ${semesterLabel}`;
  const formatLabel = format === 'story' ? '세로형' : '기본형';

  const host = document.createElement('div');
  host.className = 'capture-host';
  document.body.appendChild(host);

  try {
    let card;
    if (format === 'story') {
      card = buildStoryImageCard(profile, entries, titleText, host);
    } else {
      card = buildBasicImageCard(profile, entries, titleText);
      host.appendChild(card);
    }

    const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: format === 'story' ? 1 : 2 });
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    document.getElementById('image-result-img').src = dataUrl;
    currentImageDataUrl = dataUrl;
    currentImageFilename = `${profile.name}_${semesterLabel}_시간표_${formatLabel}.jpg`;
  } catch (err) {
    console.error(err);
    alert('이미지 생성 중 오류가 발생했어요.');
  } finally {
    document.body.removeChild(host);
  }
}

let currentImageDataUrl = null;
let currentImageFilename = '시간표.jpg';

async function saveImage() {
  await generateImage(currentImageFormat);
  openModal('modal-image-result');
}

async function downloadCurrentImage() {
  if (!currentImageDataUrl) return;
  const res = await fetch(currentImageDataUrl);
  const blob = await res.blob();
  const file = new File([blob], currentImageFilename, { type: 'image/jpeg' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  const link = document.createElement('a');
  link.href = currentImageDataUrl;
  link.download = currentImageFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setImageFormat(format) {
  if (format === currentImageFormat) return;
  currentImageFormat = format;
  document.querySelectorAll('#image-format-toggle .format-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.format === format);
  });
  generateImage(format);
}

/* ===================== 인쇄 미리보기 ===================== */
function buildPtEntryEl(l) {
  const entryEl = document.createElement('div');
  entryEl.className = 'pt-entry' + (l.isExtra ? ' is-extra' : '');
  entryEl.style.top = l.topPct + '%';
  entryEl.style.height = l.heightPct + '%';
  entryEl.style.left = l.leftPct + '%';
  entryEl.style.width = l.widthPct + '%';
  entryEl.style.background = getEntryColor(l.entry);

  const t = document.createElement('div');
  t.className = 'pt-entry-title';
  t.textContent = l.entry.title;
  entryEl.appendChild(t);

  if (!l.isExtra && l.entry.note) {
    const nt = document.createElement('div');
    nt.className = 'pt-entry-note';
    nt.textContent = l.entry.note;
    entryEl.appendChild(nt);
  }
  return entryEl;
}

function buildPrintPage(profile, entries, semesterLabel, orientation) {
  const profStart = timeToMin(profile.startTime);
  const profEnd = timeToMin(profile.endTime);
  const totalMin = profEnd - profStart;
  const displayDays = getDisplayDays(profile);
  const N = displayDays.length;

  const page = document.createElement('div');
  page.className = 'pt-page' + (orientation === 'portrait' ? ' pt-page-portrait' : '');

  const title = document.createElement('div');
  title.className = 'pt-title';
  title.textContent = `${profile.name}의 시간표 - ${semesterLabel}`;
  page.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'pt-grid';

  const header = document.createElement('div');
  header.className = 'pt-header';
  const corner = document.createElement('div');
  corner.className = 'pt-corner';
  header.appendChild(corner);
  displayDays.forEach((d) => {
    const dh = document.createElement('div');
    dh.className = 'pt-day-header';
    dh.textContent = DAYS[d];
    header.appendChild(dh);
  });
  grid.appendChild(header);

  const bodyEl = document.createElement('div');
  bodyEl.className = 'pt-body';

  const timeCol = document.createElement('div');
  timeCol.className = 'pt-time-col';
  for (let m = profStart; m < profEnd; m += 60) {
    const label = document.createElement('div');
    label.className = 'pt-time-label';
    const span = document.createElement('span');
    span.textContent = minToTime(m);
    label.appendChild(span);
    timeCol.appendChild(label);
  }
  // 마지막 30분만 남는 경우 보정
  if ((profEnd - profStart) % 60 !== 0) {
    const label = document.createElement('div');
    label.className = 'pt-time-label';
    timeCol.appendChild(label);
  }
  bodyEl.appendChild(timeCol);

  const daysRow = document.createElement('div');
  daysRow.className = 'pt-days-row';

  const dayLayouts = displayDays.map((d) => {
    const dayEntries = entries.filter((e) => e.day === d);
    return layoutDayEntries(dayEntries, profStart, profEnd);
  });
  const { used, mergedGroups } = findMergedGroups(dayLayouts, N);

  displayDays.forEach((d, pos) => {
    const dayCol = document.createElement('div');
    dayCol.className = 'pt-day-col';

    // 시간 구분선
    const totalSlots = totalMin / 30;
    for (let i = 1; i < totalSlots; i++) {
      const line = document.createElement('div');
      const slotStart = profStart + i * 30;
      line.className = 'pt-row-line' + (slotStart % 60 === 0 ? ' hour' : '');
      line.style.top = ((i * 30) / totalMin) * 100 + '%';
      dayCol.appendChild(line);
    }

    dayLayouts[pos].forEach((l) => {
      if (used.has(l.entry.id)) return;
      dayCol.appendChild(buildPtEntryEl(l));
    });

    daysRow.appendChild(dayCol);
  });

  // 연속 요일에 동일한 일정이 있으면 하나로 병합해 표시
  mergedGroups.forEach((g) => {
    const entryEl = buildPtEntryEl({
      entry: g.entry,
      topPct: g.topPct,
      heightPct: g.heightPct,
      leftPct: (g.startPos / N) * 100,
      widthPct: (g.span / N) * 100,
      isExtra: false,
    });
    entryEl.classList.add('merged');
    daysRow.appendChild(entryEl);
  });

  bodyEl.appendChild(daysRow);
  grid.appendChild(bodyEl);
  page.appendChild(grid);

  return page;
}

let currentPrintOrientation = 'landscape';

function openPrintModal(orientation) {
  orientation = orientation || currentPrintOrientation;
  currentPrintOrientation = orientation;

  const profile = getCurrentProfile();
  const entries = getCurrentEntries();
  const semesterLabel = SEMESTERS.find((s) => s.key === state.currentSemester).label;

  const scaler = document.getElementById('print-preview-scaler');
  scaler.innerHTML = '';
  scaler.appendChild(buildPrintPage(profile, entries, semesterLabel, orientation));

  const printArea = document.getElementById('print-area');
  printArea.innerHTML = '';
  const printPage = buildPrintPage(profile, entries, semesterLabel, orientation);
  printArea.appendChild(printPage);

  const previewPage = document.getElementById('print-preview-page');
  previewPage.classList.toggle('portrait', orientation === 'portrait');
  document.querySelector('.print-preview-thumb').classList.toggle('portrait', orientation === 'portrait');

  setPrintPageStyle(orientation);

  document.querySelectorAll('#print-format-toggle .format-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.orientation === orientation);
  });

  const slider = document.getElementById('print-scale-slider');
  slider.value = 100;
  document.getElementById('print-scale-value').textContent = '100%';
  applyPrintScale(100);

  openModal('modal-print');
}

function setPrintPageStyle(orientation) {
  let styleEl = document.getElementById('print-page-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'print-page-style';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `@media print { @page { size: A4 ${orientation}; margin: 10mm; } }`;
}

function applyPrintScale(value) {
  const scale = value / 100;
  document.getElementById('print-preview-scaler').style.transform = `scale(${scale})`;
  const printPage = document.querySelector('#print-area .pt-page');
  if (printPage) printPage.style.transform = `scale(${scale})`;
}

/* ===================== 초기화 / 이벤트 바인딩 ===================== */
function init() {
  document.getElementById('btn-add-profile').addEventListener('click', () => openProfileModal(null));
  document.getElementById('btn-profile-cancel').addEventListener('click', closeAllModals);
  document.getElementById('btn-profile-save').addEventListener('click', saveProfile);

  document.getElementById('btn-back-profiles').addEventListener('click', () => {
    state.currentProfileId = null;
    saveState();
    renderProfileList();
    showScreen('screen-profiles');
  });

  document.getElementById('btn-open-settings').addEventListener('click', openSettingsModal);
  document.getElementById('btn-settings-close').addEventListener('click', closeAllModals);
  document.getElementById('btn-category-add').addEventListener('click', addCategory);

  document.getElementById('btn-preset-add').addEventListener('click', addPreset);
  document.getElementById('btn-preset-edit-close').addEventListener('click', closePresetEditModal);
  document.getElementById('preset-name-input').addEventListener('input', (e) => {
    const preset = state.schoolPresets.find((p) => p.id === editingPresetId);
    if (preset) {
      preset.name = e.target.value;
      saveState();
    }
  });

  document.getElementById('profile-school-preset-select').addEventListener('change', (e) => {
    document.getElementById('profile-preset-apply-row').style.display =
      editingProfileId && e.target.value ? 'block' : 'none';
  });
  document.getElementById('btn-apply-school-preset').addEventListener('click', () => {
    const presetId = document.getElementById('profile-school-preset-select').value;
    if (!presetId || !editingProfileId) return;
    if (!confirm('1학기·2학기의 기존 "학교" 일정을 덮어쓰고 선택한 기본값을 적용할까요?')) return;
    applySchoolPreset(editingProfileId, presetId);
    alert('적용했어요.');
    if (state.currentProfileId === editingProfileId) renderGrid();
  });

  document.getElementById('btn-entry-cancel').addEventListener('click', closeAllModals);
  document.getElementById('btn-entry-save').addEventListener('click', saveEntry);
  document.getElementById('btn-entry-delete').addEventListener('click', deleteEntry);

  document.getElementById('entry-color-override-check').addEventListener('change', (e) => {
    document.getElementById('entry-color-palette').classList.toggle('disabled', !e.target.checked);
  });

  document.getElementById('btn-save-image').addEventListener('click', saveImage);
  document.getElementById('btn-image-close').addEventListener('click', closeAllModals);
  document.getElementById('btn-image-download').addEventListener('click', downloadCurrentImage);
  document.querySelectorAll('#image-format-toggle .format-btn').forEach((btn) => {
    btn.addEventListener('click', () => setImageFormat(btn.dataset.format));
  });

  document.getElementById('btn-print').addEventListener('click', () => openPrintModal());
  document.getElementById('btn-print-close').addEventListener('click', closeAllModals);
  document.querySelectorAll('#print-format-toggle .format-btn').forEach((btn) => {
    btn.addEventListener('click', () => openPrintModal(btn.dataset.orientation));
  });
  document.getElementById('btn-print-go').addEventListener('click', () => window.print());
  document.getElementById('print-scale-slider').addEventListener('input', (e) => {
    const v = e.target.value;
    document.getElementById('print-scale-value').textContent = v + '%';
    applyPrintScale(v);
  });

  document.getElementById('btn-copy-semester').addEventListener('click', openCopySemesterModal);
  document.getElementById('btn-copy-semester-cancel').addEventListener('click', closeAllModals);
  document.getElementById('btn-copy-semester-confirm').addEventListener('click', copySemesterSchedule);

  // 오버레이 바깥 클릭 시 닫기
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeAllModals();
  });

  renderProfileList();
  showScreen('screen-profiles');
}

init();
