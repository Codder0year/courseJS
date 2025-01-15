// Содержимое файлов
const fileContent = {
  "File1.cs": "// C# file content",
  "File2.xaml": "<!-- XAML content -->",
  "MainWindow.cs": "// MainWindow.cs content",
  "MainWindow.xaml": "<!-- MainWindow.xaml content -->",
};

// Текущий открытый файл
let currentFile = null;

// Открытие файла для редактирования
function openFile(fileName) {
  const editor = document.getElementById("editor");
  const saveButton = document.getElementById("save-button");

  if (fileContent[fileName]) {
    currentFile = fileName;
    editor.value = fileContent[fileName]; // Загружаем содержимое файла
    editor.style.display = "block"; // Показываем редактор
    saveButton.removeAttribute("disabled");
    saveButton.style.display = "block"; // Показываем кнопку "Сохранить"
  } else {
    currentFile = null;
    editor.value = "";
    editor.style.display = "none"; // Скрываем редактор
    saveButton.setAttribute("disabled", "true");
    saveButton.style.display = "none"; // Скрываем кнопку "Сохранить"
  }

  addTab(fileName);
}

// Сохранение изменений в файл
function saveFileContent() {
  if (currentFile) {
    const editor = document.getElementById("editor");
    fileContent[currentFile] = editor.value; // Сохраняем изменения
    alert(`Изменения в файле "${currentFile}" сохранены!`);
  }
}

// Добавление вкладки
function addTab(fileName) {
  const tabs = document.getElementById("tabs");

  // Проверяем, есть ли уже вкладка с таким именем
  const existingTab = Array.from(tabs.children).find((tab) =>
    tab.textContent.includes(fileName)
  );
  if (!existingTab) {
    const newTab = document.createElement("div");
    newTab.className = "tab";
    newTab.textContent = fileName;

    // Кнопка закрытия вкладки
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.textContent = "×";
    closeButton.onclick = function (event) {
      event.stopPropagation();
      closeTab(newTab);
    };

    newTab.appendChild(closeButton);

    tabs.appendChild(newTab);

    // Убираем класс active с других вкладок
    Array.from(tabs.children).forEach((tab) => tab.classList.remove("active"));
    newTab.classList.add("active");
  }
}

// Закрытие вкладки
function closeTab(tab) {
  const tabs = document.getElementById("tabs");
  tabs.removeChild(tab);

  // Если удаляется активная вкладка, делаем активной первую из оставшихся
  if (tab.classList.contains("active")) {
    const remainingTabs = Array.from(tabs.children);
    if (remainingTabs.length > 0) {
      const nextTab = remainingTabs[0];
      nextTab.classList.add("active");
      openFile(nextTab.textContent.trim());
    } else {
      const editor = document.getElementById("editor");
      const saveButton = document.getElementById("save-button");
      editor.value = "";
      editor.style.display = "none"; // Скрываем редактор
      saveButton.setAttribute("disabled", "true");
      saveButton.style.display = "none"; // Скрываем кнопку "Сохранить"
    }
  }
}

// Привязываем события
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("save-button")
    .addEventListener("click", saveFileContent);
});
