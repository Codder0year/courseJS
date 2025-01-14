// Функция для открытия файла в редакторе
function openFile(fileName) {
  const editor = document.getElementById("editor");

  // Контент файлов
  const fileContent = {
    "File1.cs": "// C# file content",
    "File2.xaml": "<!-- XAML content -->",
    "MainWindow.cs": "// MainWindow.cs content",
    "MainWindow.xaml": "<!-- MainWindow.xaml content -->",
  };

  if (fileContent[fileName]) {
    editor.textContent = fileContent[fileName];
  } else {
    editor.textContent = "// Content not found";
  }

  addTab(fileName);
}

// Функция для добавления вкладки
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

// Функция для закрытия вкладки
function closeTab(tab) {
  const tabs = document.getElementById("tabs");
  tabs.removeChild(tab);

  // Если удаляется активная вкладка, делаем активной первую из оставшихся
  if (tab.classList.contains("active")) {
    const remainingTabs = Array.from(tabs.children);
    if (remainingTabs.length > 0) {
      remainingTabs[0].classList.add("active");
      openFile(remainingTabs[0].textContent.trim());
    } else {
      document.getElementById("editor").textContent = "// No file selected";
    }
  }
}

// Убедитесь, что `editor` и `tabs` существуют в HTML
document.addEventListener("DOMContentLoaded", () => {
  const rootFolder = document.querySelector(".folder");
  if (rootFolder) {
    attachDescriptionEvents(rootFolder, "Project_1");
  }
});
