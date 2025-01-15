  // Функция для создания новой папки
  function createFolder() {
    let folderName = prompt("Введите имя новой папки:", "Новая папка");
  
    if (folderName) {
      // Проверяем, уникально ли имя
      if (!isFolderNameUnique(folderName)) {
        alert(`Папка с именем "${folderName}" уже существует!`);
        return;
      }
  
      // Создаем DOM-элемент папки
      const newFolder = document.createElement("div");
      newFolder.className = "folder";
      newFolder.textContent = folderName;
  
      // Добавляем обработчик загрузки дочерних элементов
      newFolder.addEventListener("click", (event) => {
        event.stopPropagation();
        loadChildren(newFolder);
      });
  
      // Находим родительский элемент, куда нужно добавить папку (свойство .folder или .children)
      const root = document.getElementById("sidebar"); // или любой другой контейнер, куда добавлять
  
      // Если у родителя есть дочерние элементы, вставляем папку внутрь них
        const childrenContainer = root.querySelector(".children") || document.createElement("div");
        childrenContainer.className = "children";
        childrenContainer.appendChild(newFolder);
        root.appendChild(childrenContainer);

      alert(`Папка "${folderName}" успешно создана!`);
    }
  }
  
  // Функция для добавления обработчика на кнопку "Создать Папку"
  function setupFolderCreation() {
    const createFolderButton = document.querySelector(".toolbar-button:nth-child(1)");
    createFolderButton.addEventListener("click", () => {
      createFolder();  // Создавать папку в любом месте
    });
  }
  