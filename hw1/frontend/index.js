const overlay = document.querySelector("#overlay");
const viewer = document.querySelector("#viewer");
const editor = document.querySelector("#editor");
const tagFilter = document.querySelector("#tag-filter");
const moodFilter = document.querySelector("#mood-filter");
const previewRegion = document.querySelector("#preview-region");
const tagButton = document.querySelector("#editor-tag");
const moodButton = document.querySelector("#editor-mood");
const cancelButton = document.querySelector("#editor-cancel");
const saveButton = document.querySelector("#editor-save");
const inputYear = document.querySelector("#input-year");
const inputMonth = document.querySelector("#input-month");
const inputDate = document.querySelector("#input-date");
const editorYoubi = document.querySelector("#editor-youbi");
const inputText = document.querySelector("#editor-text");
const addDiaryButton = document.querySelector("#add-diary");
const editButton = document.querySelector("#viewer-edit");
const deleteButton = document.querySelector("#viewer-delete");

/* global axios */
const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

const diary_default = {
  date: [0, 0, 0],
  tag: 0,
  mood: 0,
  text: ""
};

const tagList = ["學業", "人際", "社團"];
const moodList = ["快樂", "生氣", "難過"];
const youbiList = ["(Sun.)", "(Mon.)", "(Tue.)", "(Wed.)", "(Thu.)", "(Fri.)", "(Sat.)"];

let diaries, temp;

async function main() {
  setupEventListeners();
  setupFilters();
  try {
    diaries = await getDiaries();
    console.log(diaries);
  } catch(error) {
    alert("Failed to load diaries!");
  }
  refresh();
}

function setupEventListeners() {
  overlay.addEventListener("click", () => refresh());

  addDiaryButton.addEventListener("click", () => {
    temp = Object.assign({}, diary_default);
    const currentDate = new Date();
    temp.date = [currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate()];
    loadEditor(temp);

    editor.dataset.new = "true";
  });

  editButton.addEventListener("click", async () => {
    temp = await getDiaryById(viewer.dataset.id);
    loadEditor(temp);

    editor.dataset.new = "";
  });

  deleteButton.addEventListener("click", async () => {
    if(confirm("Are you sure you want to delete this diary?")) {
      await deleteDiary(viewer.dataset.id);
      diaries = await getDiaries();
      refresh();
    }
  });

  tagButton.addEventListener("click", () => {
    tagButton.innerText = tagList[(++temp.tag) % tagList.length];
    if(temp.tag === tagList.length) temp.tag = 0;
  });

  moodButton.addEventListener("click", () => {
    moodButton.innerText = moodList[(++temp.mood) % moodList.length];
    if(temp.mood === moodList.length) temp.mood = 0;
  });

  cancelButton.addEventListener("click", () => refresh());

  saveButton.addEventListener("click", async () => {
    temp.text = inputText.value;

    temp.date = [parseInt(inputYear.value), parseInt(inputMonth.value), parseInt(inputDate.value)];
    if(is_legalDate(temp.date))
      try {
        if(editor.dataset.new) {
          const diary = await createDiary(temp);
          diaries.push(diary);
        }
        else {
          await updateDiaryStatus(viewer.dataset.id, temp);
          diaries = await getDiaries();
        }
        refresh();
      } catch (error) {
        console.log(error);
        alert("Failed to create diary!");
      }
    else {
      alert("This date doesn't exist!");
      return;
    }
  });

  inputYear.addEventListener("change", () => refreshYoubi());
  inputMonth.addEventListener("change", () => refreshYoubi());
  inputDate.addEventListener("change", () => refreshYoubi());
}

function loadEditor(temp) {
  overlay.style.display = "block";
  editor.style.display = "block";

  inputYear.value = temp.date[0];
  inputMonth.value = temp.date[1];
  inputDate.value = temp.date[2];
  editorYoubi.innerText = " " + youbiList[generateYouBi(temp.date)];

  tagButton.innerText = tagList[temp.tag];
  moodButton.innerText = moodList[temp.mood];

  inputText.value = temp.text;
}

function setupFilters() {
  for(let i=0; i<tagList.length; i++) {
    const opt = tagFilter.firstElementChild.cloneNode(true);
    opt.value = i;
    opt.innerText = tagList[i];
    tagFilter.appendChild(opt);
  }
  tagFilter.addEventListener("change", () => refresh());
  for(let i=0; i<moodList.length; i++) {
    const opt = moodFilter.firstElementChild.cloneNode(true);
    opt.value = i;
    opt.innerText = moodList[i];
    moodFilter.appendChild(opt);
  }
  moodFilter.addEventListener("change", () => refresh());
}

function is_legalDate(date) {
  if(date[0] < 0 || date[1] < 1 || date[1] > 12 || date[2] < 1 || date[2] > 31) return false;
  if(date[2] === 31 && !is_bigMonth(date[1])) return false;
  if(is_leapYear(date[0]) && date[1] === 2 && date[2] > 29) return false;
  if(!is_leapYear(date[0]) && date[1] === 2 && date[2] > 28) return false;
  return true;
}

function is_leapYear(year) {
  if(year % 4 === 0)
    if(year % 100 === 0)
      if(year % 400 === 0) return true;
      else return false;
    else return true;
  else return false;
}

function is_bigMonth(month) {
  if(month < 8 && month % 2 === 1) return true;
  if(month > 7 && month % 2 === 0) return true;
  return false;
}

function generateYouBi(date) {
  let youbi = 0;
  for(let y=1; y<date[0]; y++)
    if(is_leapYear(y)) youbi = (youbi + 366) % 7;
    else youbi = (youbi + 365) % 7;
  for(let m=1; m<date[1]; m++)
    if(is_leapYear(date[0]) && m === 2) youbi = (youbi + 29) % 7;
    else if(m === 2) youbi = (youbi + 28) % 7;
    else if(is_bigMonth(m)) youbi = (youbi + 31) % 7;
    else youbi = (youbi + 30) % 7;
  youbi = (youbi + date[2]) % 7;
  return youbi;
}

function refreshYoubi() {
  const date = [parseInt(inputYear.value), parseInt(inputMonth.value), parseInt(inputDate.value)];
  if(is_legalDate(date)) {
    editorYoubi.style.color = "black";
    editorYoubi.innerText = " " + youbiList[generateYouBi(date)];
  }
  else {
    editorYoubi.style.color = "red";
    editorYoubi.innerText = "(DNE.)";
  }
}

function renderDiary(diary) {
  const item = createDiaryElement(diary);
  previewRegion.appendChild(item);
}

function createDiaryElement(diary) {
  const diaryTemplate = document.querySelector("#diary-card-template");
  const temp = diaryTemplate.content.cloneNode(true);

  temp.querySelector(".diary-card-date").innerText = generateDate(diary.date);
  temp.querySelector(".diary-card-date").innerText += " " + youbiList[generateYouBi(diary.date)];
  temp.querySelector(".diary-card-tag").innerText = tagList[diary.tag];
  temp.querySelector(".diary-card-mood").innerText = moodList[diary.mood];
  temp.querySelector(".diary-card-preview").innerText = generatePreview(diary.text);

  temp.querySelector(".diary-card").addEventListener("click", () => viewDiary(diary.id));

  return temp;
}

function generateDate(date) {
  let text = date[0].toString() + ".";
  if(date[1] < 10) text += "0";
  text += date[1].toString() + ".";
  if(date[2] < 10) text += "0";
  text += date[2].toString();

  return text;
}

function generatePreview(text) {
  const max_length = 20;
  if(text.length > max_length)
    return text.slice(0, max_length-3) + "...";
  else return text;
}

async function viewDiary(id) {
  const diary = await getDiaryById(id);

  overlay.style.display = "block";
  viewer.style.display = "block";

  viewer.querySelector("#viewer-date").innerText = generateDate(diary.date);
  viewer.querySelector("#viewer-date").innerText += " " + youbiList[generateYouBi(diary.date)];
  viewer.querySelector("#viewer-tag").innerText = tagList[diary.tag];
  viewer.querySelector("#viewer-mood").innerText = moodList[diary.mood];
  viewer.querySelector("#viewer-text").innerText = diary.text;

  viewer.dataset.id = id;
}

async function getDiaries() {
  const response = await instance.get("/diaries");
  return response.data;
}

async function getDiaryById(id) {
  const response = await instance.get(`/diaries/${id}`);
  return response.data;
}

async function createDiary(diary) {
  const response = await instance.post("/diaries", diary);
  return response.data;
}

async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

async function deleteDiary(id) {
  const response = await instance.delete(`/diaries/${id}`);
  return response.data;
}

function refresh() {
  overlay.style.display = "none";
  viewer.style.display = "none";
  editor.style.display = "none";

  while(previewRegion.firstChild) previewRegion.removeChild(previewRegion.firstChild);

  try {
    diaries.forEach(diary => {
      if(!tagFilter.value || tagFilter.value === diary.tag.toString())
        if(!moodFilter.value || moodFilter.value === diary.mood.toString())
          renderDiary(diary);
    });
  } catch(error) { console.log(error.message)};
}

refresh();
main();