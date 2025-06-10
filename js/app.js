function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
  children.forEach(c => el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
  return el;
}

async function init() {
  const archiveEl = document.getElementById("archive");
  if (archiveEl) {
    const items = await getArchive();
    archiveEl.innerHTML = "";
    items.forEach(it => {
      const row = document.createElement("div");
      row.textContent = `${it.lesson} - ${it.word}`;
      archiveEl.appendChild(row);
    });
    return;
  }
  const today = dayjs().format('YYYY-MM-DD');
  const app = document.getElementById('app');

  const input = createEl('textarea', { rows: 6, className: 'w-full p-2 border' });
  const addBtn = createEl('button', { className: 'mt-2 px-4 py-2 bg-blue-500 text-white' }, ['Añadir lección']);
  addBtn.onclick = async () => {
    try {
      const lesson = JSON.parse(input.value);
      await addLesson(lesson);
      input.value = '';
      loadDue();
    } catch (e) {
      alert('JSON inválido');
    }
  };

  const queueDiv = createEl('div', { className: 'mt-4' });
  app.appendChild(input);
  app.appendChild(addBtn);
  app.appendChild(queueDiv);

  async function loadDue() {
    queueDiv.innerHTML = '';
    const items = await getDueItems(today);
    if (!items.length) {
      queueDiv.appendChild(createEl('p', {}, ['Nada pendiente por hoy']));
      return;
    }
    items.forEach(item => {
      const card = buildCard(item);
      queueDiv.appendChild(card);
    });
  }

  loadDue();
}

document.addEventListener('DOMContentLoaded', init);

function buildCard(item) {
  const container = createEl('div', { className: 'border p-4 my-2' });
  const question = createEl('p', { className: 'mb-2 font-bold' });
  const answerInput = createEl('input', { className: 'border p-1 w-full' });
  const successBtn = createEl('button', { className: 'mt-2 mr-2 px-3 py-1 bg-green-500 text-white' }, ['Éxito']);
  const failBtn = createEl('button', { className: 'mt-2 px-3 py-1 bg-red-500 text-white' }, ['Fallo']);

  const type = item.step % 4;
  switch (type) {
    case 0:
      question.textContent = `Traduce: ${item.word}`;
      break;
    case 1:
      question.textContent = item.example.replace('___', '____');
      break;
    case 2:
      question.textContent = 'Dictado (escucha y escribe)';
      const utter = new SpeechSynthesisUtterance(item.word);
      speechSynthesis.speak(utter);
      break;
    case 3:
      question.textContent = `Di en inglés: ${item.spanish}`;
      break;
  }

  successBtn.onclick = async () => {
    item.step += 1;
    item.nextDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    if (item.step >= 4) {
      item.nextDate = null; // archived
    } else if (item.step === 1) {
      item.nextDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    } else if (item.step === 2) {
      item.nextDate = dayjs().add(2, 'day').format('YYYY-MM-DD');
    } else if (item.step === 3) {
      item.nextDate = dayjs().add(3, 'day').format('YYYY-MM-DD');
    }
    await updateItem(item);
    container.remove();
  };

  failBtn.onclick = async () => {
    item.step = 0;
    item.nextDate = dayjs().format('YYYY-MM-DD');
    await updateItem(item);
    container.remove();
  };

  container.appendChild(question);
  container.appendChild(answerInput);
  container.appendChild(successBtn);
  container.appendChild(failBtn);
  return container;
}
