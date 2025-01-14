// Асинхронная загрузка/сворачивание дочерних папок/файлов
function loadChildren(element) {
  // Проверяем, загружены ли уже дочерние элементы
  const childContainer = element.querySelector(".children");

  if (childContainer) {
    // Если дочерние элементы уже загружены, скрываем их (сворачиваем)
    childContainer.style.display =
      childContainer.style.display === "none" ? "block" : "none";
    return;
  }

  // Если дочерние элементы не загружены, добавляем их
  let children = ["File1.cs", "File2.xaml", "Folder1"];
  let newChildContainer = document.createElement("div");
  newChildContainer.className = "children";

  children.forEach((child) => {
    let childElement = document.createElement("div");
    childElement.textContent = child;
    childElement.className = child.includes(".") ? "file" : "folder";

    // Добавляем обработчик для вложенных папок
    if (!child.includes(".")) {
      childElement.onclick = function (event) {
        event.stopPropagation(); // Останавливаем распространение события, чтобы не закрыть родительскую папку
        loadChildren(this); // Загружаем дочерние элементы при клике
      };
    }

    newChildContainer.appendChild(childElement);
  });

  element.appendChild(newChildContainer);

  // Привязываем события для всех файлов и папок после их добавления
  attachDescriptionEventListeners();
}

// Функция для привязки событий на элементы для показа описания
function attachDescriptionEventListeners() {
  const tooltip = document.getElementById("tooltip");

  // Описание для каждого файла и папки
  const descriptions = {
    Project_1: "Основная папка проекта",
    "File1.cs": "Основной исходный код",
    "File2.xaml": "XAML-разметка интерфейса",
    Folder1: "Подпапка с дополнительными файлами",
    "MainWindow.cs": "Главный исходный код",
    "MainWindow.xaml": "Разметка главного окна",
    "App.xaml": "Главный файл приложения",
    // Добавить описание для других элементов по аналогии
  };

  // Используем делегирование событий: назначаем обработчики на родительский элемент
  document.getElementById("sidebar").addEventListener("mouseover", (event) => {
    const target = event.target;

    if (
      target.classList.contains("file") ||
      target.classList.contains("folder")
    ) {
      const name = target.textContent.trim();
      if (descriptions[name]) {
        tooltip.textContent = descriptions[name];
        tooltip.style.display = "block";
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      }
    }
  });

  document.getElementById("sidebar").addEventListener("mouseout", (event) => {
    const target = event.target;

    if (
      target.classList.contains("file") ||
      target.classList.contains("folder")
    ) {
      tooltip.style.display = "none";
    }
  });

  // Привязываем событие для отображения описания папки Project_1 при ее первоначальном наведении
  const projectFolder = document.querySelector(".folder");
  if (projectFolder) {
    projectFolder.addEventListener("mouseover", (event) => {
      tooltip.textContent = descriptions["Project_1"];
      tooltip.style.display = "block";
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    });
    projectFolder.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });
  }
}

// Инициализация обработчиков описания после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  // Привязываем обработчики описаний ко всем файлам и папкам
  attachDescriptionEventListeners();
});
