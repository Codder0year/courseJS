document.addEventListener("DOMContentLoaded", () => {
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

  // Пример взаимодействия: показать описание файлов при наведении
  document.querySelectorAll(".file").forEach((file) => {
    file.addEventListener("mouseover", (event) => {
      const name = file.textContent.trim();
      if (descriptions[name]) {
        tooltip.textContent = descriptions[name];
        tooltip.style.display = "block";
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      }
    });

    file.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });
  });

  // Пример взаимодействия: показать описание папок при наведении
  document.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("mouseover", (event) => {
      const name = folder.textContent.trim();
      if (descriptions[name]) {
        tooltip.textContent = descriptions[name];
        tooltip.style.display = "block";
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      }
    });

    folder.addEventListener("mouseout", () => {
      tooltip.style.display = "none";
    });
  });
});
