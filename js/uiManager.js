// Управление пользовательским интерфейсом.
class UIManager {
    constructor(fileManager) {
        // Инициализируем экземпляр UIManager с объектом fileManager,
        // который будет использоваться для работы с файлами и папками.
        this.fileManager = fileManager;

        // Инициализация элементов UI, таких как кнопки, области для ввода и т. д.
        this.uiElements = {
            createFolderButton: document.getElementById("create-folder-button"),
            deleteFolderButton: document.getElementById("delete-folder-button"),
            uploadFileButton: document.getElementById("upload-file-button"),
            deleteFileButton: document.getElementById("delete-file-button"),
            downloadFileButton: document.getElementById("download-file-button"),
            renameButton: document.getElementById("rename-button"),
            saveButton: document.getElementById("save-button"),
            editor: document.getElementById("editor"),
            inputFile: document.getElementById("input-file"),
            fileTabContainer: document.getElementById("file-tabs"),
            fileNameSpan: document.getElementById("file-name"),
            sidebar: document.getElementById("sidebar"),
        };
    }

    // Обновляем отображение структуры папок в боковой панели.
    updateFolderStructure() {
        if (this.uiElements.sidebar) {
            // Очистка старого содержимого боковой панели и добавление заголовка.
            this.uiElements.sidebar.innerHTML = "<h3>Структура проекта</h3>";
            // Рендерим структуру папок, начиная с корня проекта.
            this.renderFolder(this.fileManager.projectStructure, this.uiElements.sidebar);
        }
    }

    // Рендерим все элементы в указанной папке (или файлы, или подпапки).
    renderFolder(structure, parentElement, path = "") {
        Object.keys(structure).forEach((name) => {
            let fullPath = path ? `${path}/${name}` : name;
            let item = structure[name];
            // Если это папка, рендерим её как папку, иначе — как файл.
            if (this.fileManager.isFolder(item)) {
                this.renderFolderItem(fullPath, name, item, parentElement);
            } else {
                this.renderFileItem(fullPath, name, item, parentElement);
            }
        });
    }

    // Рендерим папку в UI.
    renderFolderItem(fullPath, name, item, parentElement) {
        let folderElement = this.createFolderElement(name, fullPath, item);
        let childrenContainer = this.createChildrenContainer(fullPath);
        
        // Сохраняем состояние папки (открыта или закрыта).
        this.fileManager.folderStates[fullPath] = this.fileManager.folderStates[fullPath] || "closed";
        // Определяем видимость дочерних элементов папки.
        childrenContainer.style.display = this.fileManager.folderStates[fullPath] === "open" ? "block" : "none";

        // Обработчик клика по папке для переключения состояния (открыта/закрыта).
        folderElement.onclick = (event) => {
            event.stopPropagation(); // Останавливаем всплытие события.
            this.toggleFolder(fullPath, folderElement, childrenContainer);
        };
        
        // Добавляем папку и контейнер с дочерними элементами в родительский элемент.
        parentElement.appendChild(folderElement);
        parentElement.appendChild(childrenContainer);
        
        // Рендерим дочерние элементы (если они есть).
        this.renderFolder(item, childrenContainer, fullPath);
    }

    // Создаём HTML-элемент для папки.
    createFolderElement(name, fullPath, item) {
        let folderElement = document.createElement("div");
        folderElement.classList.add("folder");

        // Добавляем изображение для папки: пустая или заполненная.
        let folderImage = document.createElement("img");
        folderImage.src = this.fileManager.isFolderEmpty(item) ? "assets/icons/пустаяпапка.png" : "assets/icons/полнаяпапка.png";
        folderImage.alt = this.fileManager.isFolderEmpty(item) ? "Пустая папка" : "Заполненная папка";
        folderElement.appendChild(folderImage);

        // Добавляем имя папки.
        let folderName = document.createElement("span");
        folderName.textContent = name;
        folderElement.appendChild(folderName);

        // Индентируем папку в зависимости от глубины в структуре.
        folderElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
        
        return folderElement;
    }

    // Создаём контейнер для дочерних элементов папки.
    createChildrenContainer(fullPath) {
        let container = document.createElement("div");
        container.classList.add("children-container");
        container.style.display = this.fileManager.folderStates[fullPath] === "open" ? "block" : "none";
        return container;
    }

    // Рендерим файл в UI.
    renderFileItem(fullPath, name, content, parentElement) {
        let fileElement = this.createFileElement(name, fullPath, content);
        parentElement.appendChild(fileElement);
    }

    // Создаём HTML-элемент для файла.
    createFileElement(name, fullPath, content) {
        let fileElement = document.createElement("div");
        fileElement.classList.add("file");

        // Определяем тип файла по расширению.
        let fileExtension = name.split('.').pop()?.toLowerCase();
        let fileType = 'other';
        if (fileExtension === 'txt') {
            fileType = 'txt';
        } else if (fileExtension === 'pdf') {
            fileType = 'pdf';
        }

        // Добавляем иконку для файла в зависимости от типа.
        let fileImage = document.createElement("img");
        if (fileType === 'txt') {
            fileImage.src = 'assets/icons/txt.png';
        } else if (fileType === 'pdf') {
            fileImage.src = 'assets/icons/pdf.png';
        } else {
            fileImage.src = 'assets/icons/otherfile.png';
        }
        fileImage.alt = name;
        fileElement.appendChild(fileImage);

        // Добавляем имя файла.
        let fileNameElement = document.createElement("span");
        fileNameElement.textContent = name;
        fileElement.appendChild(fileNameElement);

        // Индентируем файл в зависимости от глубины в структуре.
        fileElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;

        // Обработчик клика по файлу для его открытия/закрытия.
        fileElement.onclick = (event) => {
            event.stopPropagation(); // Останавливаем всплытие события.
            this.toggleFile(fullPath, content);
        };

        return fileElement;
    }

    // Переключаем состояние папки (открыта/закрыта).
    toggleFolder(path, folderElement, childrenContainer) {
        this.fileManager.folderStates[path] = this.fileManager.folderStates[path] === "open" ? "closed" : "open";
        childrenContainer.style.display = this.fileManager.folderStates[path] === "open" ? "block" : "none";
        this.selectFolder(path, folderElement);
    }

    // Выбираем папку и отменяем выбор текущей папки.
    selectFolder(path, element) {
        this.deselectFolder();
        this.fileManager.selectedFolder = { name: path, element: element };
        element.classList.add("selected");
        this.closeFile(this.fileManager.selectedFile?.path || "");
    }

    // Отменяем выбор папки.
    deselectFolder() {
        if (this.fileManager.selectedFolder) {
            this.fileManager.selectedFolder.element.classList.remove("selected");
        }
        this.fileManager.selectedFolder = null;
    }

    // Переключаем состояние файла (открыт/закрыт).
    toggleFile(path, content) {
        if (this.fileManager.selectedFile && this.fileManager.selectedFile.path === path) {
            this.closeFile(this.fileManager.selectedFile?.path || "");
        } else {
            this.openFile(path, content);
        }
    }

    // Открываем файл и отображаем его содержимое.
    openFile(path, content) {
        if (this.fileManager.activeTabs[path]) {
            this.selectTab(this.fileManager.activeTabs[path].tabElement);
        } else {
            let newTab = this.createFileTab(path, content);
            this.uiElements.fileTabContainer?.appendChild(newTab);
            this.fileManager.activeTabs[path] = { tabElement: newTab, content: content };
            this.selectTab(newTab);
        }

        this.fileManager.selectedFile = { path: path, content: content, tabElement: this.fileManager.activeTabs[path].tabElement };

        // Отображаем содержимое файла в редакторе.
        if (this.uiElements.editor) {
            this.uiElements.editor.value = content;
            this.uiElements.editor.placeholder = `Редактирование: ${path}`;
            this.uiElements.editor.style.display = "block";
        }

        // Отображаем кнопку сохранения.
        if (this.uiElements.saveButton) {
            this.uiElements.saveButton.style.display = "block";
            this.uiElements.saveButton.disabled = false;
        }
    }

    // Закрываем файл и удаляем его вкладку.
    closeFile(path) {
        if (!path) return;
        let tabData = this.fileManager.activeTabs[path];
        if (tabData) {
            tabData.tabElement.remove();
            delete this.fileManager.activeTabs[path];
            if (this.fileManager.selectedFile && this.fileManager.selectedFile.path === path) {
                this.fileManager.selectedFile = null;
            }
            if (this.uiElements.editor) {
                this.uiElements.editor.style.display = "none";
            }
            if (this.uiElements.saveButton) {
                this.uiElements.saveButton.style.display = "none";
            }
        }
    }

    // Создаём вкладку для открытого файла.
    createFileTab(path, content) {
        let tab = document.createElement("div");
        tab.classList.add("file-tab");

        // Имя файла на вкладке.
        let tabName = document.createElement("span");
        tabName.textContent = path.split("/").pop() || "Неизвестный файл";
        tab.appendChild(tabName);

        // Кнопка закрытия вкладки.
        let closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.classList.add("close-tab");
        closeButton.onclick = (event) => {
            event.stopPropagation();
            this.closeFile(path);
        };
        tab.appendChild(closeButton);

        // Обработчик клика по вкладке для открытия файла.
        tab.onclick = (event) => {
            if (event.target.classList.contains("close-tab")) {
                return;
            }
            this.openFile(path, content);
        };

        return tab;
    }

    // Выбираем вкладку и открываем соответствующий файл.
    selectTab(tab) {
        let tabs = this.uiElements.fileTabContainer?.querySelectorAll(".file-tab");
        if (tabs) {
            tabs.forEach((tabElement) => tabElement.classList.remove("active"));
            tab.classList.add("active");

            // Ищем файл, соответствующий выбранной вкладке.
            let filePath = tab.textContent?.trim();
            let file = Object.keys(this.fileManager.activeTabs).find((path) => path.split("/").pop() === filePath);
            if (file && this.fileManager.selectedFile) {
                this.openFile(file, this.fileManager.activeTabs[file].content);
            }
        }
    }
}
