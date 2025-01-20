document.addEventListener("DOMContentLoaded", () => {
    // Элементы UI, с которыми будем работать
    const uiElements = {
        createFolderButton: document.getElementById("create-folder-button") as HTMLButtonElement | null,
        deleteFolderButton: document.getElementById("delete-folder-button") as HTMLButtonElement | null,
        uploadFileButton: document.getElementById("upload-file-button") as HTMLButtonElement | null,
        deleteFileButton: document.getElementById("delete-file-button") as HTMLButtonElement | null,
        downloadFileButton: document.getElementById("download-file-button") as HTMLButtonElement | null,
        renameButton: document.getElementById("rename-button") as HTMLButtonElement | null,
        saveButton: document.getElementById("save-button") as HTMLButtonElement | null,
        editor: document.getElementById("editor") as HTMLTextAreaElement | null,
        inputFile: document.getElementById("input-file") as HTMLInputElement | null,
        fileTabContainer: document.getElementById("file-tabs") as HTMLElement | null,
        fileNameSpan: document.getElementById("file-name") as HTMLSpanElement | null,
        sidebar: document.getElementById("sidebar") as HTMLElement | null,
    };

    let selectedFolder: { name: string, element: HTMLElement } | null = null;
    let selectedFile: { path: string, content: string, tabElement: HTMLElement } | null = null;
    let folderStates: { [key: string]: "open" | "closed" } = {};
    let projectStructure: any = loadProjectStructure();
    let activeTabs: { [path: string]: { tabElement: HTMLElement, content: string } } = {};

    // Загрузка структуры проекта из localStorage
    function loadProjectStructure(): any {
        const savedStructure = localStorage.getItem("projectStructure");
        return savedStructure ? JSON.parse(savedStructure) : {};
    }

    // Сохранение структуры проекта в localStorage
    function saveProjectStructure() {
        localStorage.setItem("projectStructure", JSON.stringify(projectStructure));
    }

    // Обновление отображения структуры проекта в сайдбаре
    function updateFolderStructure() {
        if (uiElements.sidebar) {
            uiElements.sidebar.innerHTML = "<h3>Структура проекта</h3>";
            renderFolder(projectStructure, uiElements.sidebar);
        }
    }

    // Рендер папок и файлов в интерфейсе
    function renderFolder(structure: any, parentElement: HTMLElement, path: string = "") {
        Object.keys(structure).forEach(name => {
            const fullPath = path ? `${path}/${name}` : name;
            const item = structure[name];
    
            if (isFolder(item)) {
                renderFolderItem(fullPath, name, item, parentElement);  // Передаем правильное количество аргументов
            } else {
                renderFileItem(fullPath, name, item, parentElement);
            }
        });
    }

    // Рендер файлов
    function renderFileItem(fullPath: string, name: string, content: string, parentElement: HTMLElement) {
        const fileElement = createFileElement(name, fullPath, content);
        parentElement.appendChild(fileElement);
    }

    // Проверка, является ли элемент папкой
    function isFolder(item: any): boolean {
        return typeof item === "object" && !item.content;
    }

    // Рендер папок
    function renderFolderItem(fullPath: string, name: string, item: any, parentElement: HTMLElement) {
        const folderElement = createFolderElement(name, fullPath, item); // Передаем item сюда
        const childrenContainer = createChildrenContainer(fullPath);
    
        folderStates[fullPath] = folderStates[fullPath] || "closed";
        childrenContainer.style.display = folderStates[fullPath] === "open" ? "block" : "none";
    
        folderElement.onclick = (event) => {
            event.stopPropagation();
            toggleFolder(fullPath, folderElement, childrenContainer);
        };
    
        parentElement.appendChild(folderElement);
        parentElement.appendChild(childrenContainer);
        renderFolder(item, childrenContainer, fullPath);  // Рекурсивный вызов для дочерних папок
    }


    function isFolderEmpty(item: any): boolean {
        // Проверяем, есть ли у папки дочерние элементы
        return Object.keys(item).length === 0;
    }

    // Создание элемента папки
    function createFolderElement(name: string, fullPath: string, item: any): HTMLElement {
        const folderElement = document.createElement("div");
        folderElement.classList.add("folder");
    
        // Папка будет пустой или заполненной в зависимости от содержимого
        const folderImage = document.createElement("img");
        folderImage.src = isFolderEmpty(item) ? "assets/icons/пустаяпапка.png" : "assets/icons/полнаяпапка.png";
        folderImage.alt = isFolderEmpty(item) ? "Пустая папка" : "Заполненная папка";
        folderElement.appendChild(folderImage);
    
        const folderName = document.createElement("span");
        folderName.textContent = name;
        folderElement.appendChild(folderName);
    
        folderElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
        return folderElement;
    }

    // Создание контейнера для дочерних элементов папки
    function createChildrenContainer(fullPath: string): HTMLElement {
        const container = document.createElement("div");
        container.classList.add("children-container");
        container.style.display = folderStates[fullPath] === "open" ? "block" : "none";
        return container;
    }

    // Создание элемента файла
    function createFileElement(name: string, fullPath: string, content: string): HTMLElement {
        const fileElement = document.createElement("div");
        fileElement.classList.add("file");
        
        // Определяем расширение файла
        const fileExtension = name.split('.').pop()?.toLowerCase();
        let fileType = 'other'; // По умолчанию для неизвестных типов файлов
    
        if (fileExtension === 'txt') {
            fileType = 'txt';
        } else if (fileExtension === 'pdf') {
            fileType = 'pdf';
        }
    
        // Создаем изображение для файла в зависимости от типа
        const fileImage = document.createElement("img");
        if (fileType === 'txt') {
            fileImage.src = 'assets/icons/txt.png';  // Иконка для текстовых файлов
        } else if (fileType === 'pdf') {
            fileImage.src = 'assets/icons/pdf.png';  // Иконка для PDF файлов
        } else {
            fileImage.src = 'assets/icons/otherfile.png';  // Иконка для других типов файлов
        }
        fileImage.alt = name;  // Устанавливаем название файла для alt атрибута
    
        // Добавляем иконку в элемент файла
        fileElement.appendChild(fileImage);
    
        // Добавляем название файла
        const fileNameElement = document.createElement("span");
        fileNameElement.textContent = name;
        fileElement.appendChild(fileNameElement);
    
        // Добавляем отступ в зависимости от вложенности
        fileElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
    
        // Обработчик клика по файлу
        fileElement.onclick = (event) => {
            event.stopPropagation();
            toggleFile(fullPath, content);
        };
    
        return fileElement;
    }
    
    // Функция для переключения состояния папки (открыта/закрыта) и выделения её
    function toggleFolder(path: string, folderElement: HTMLElement, childrenContainer: HTMLElement) {
        // Переключаем состояние папки
        folderStates[path] = folderStates[path] === "open" ? "closed" : "open";
        // Скрываем или показываем содержимое папки
        childrenContainer.style.display = folderStates[path] === "open" ? "block" : "none";
        // Выделяем папку
        selectFolder(path, folderElement); 
    }

    // Функция для выделения папки
    function selectFolder(path: string, element: HTMLElement) {
        deselectFolder(); // Снимаем выделение с предыдущей папки
        selectedFolder = { name: path, element }; // Устанавливаем новую выбранную папку
        element.classList.add("selected"); // Добавляем класс выделения
        closeFile(selectedFile?.path || ""); // Закрываем текущий открытый файл
    }

    // Функция для снятия выделения с папки
    function deselectFolder() {
        if (selectedFolder) {
            // Убираем класс выделения
            selectedFolder.element.classList.remove("selected"); 
        }
        // Обнуляем выбранную папку
        selectedFolder = null; 
    }

    // Функция для переключения между открытым и закрытым файлом
    function toggleFile(path: string, content: string) {
        if (selectedFile && selectedFile.path === path) {
            // Если файл уже открыт, закрываем его
            closeFile(selectedFile?.path || "");
        } else {
            // Иначе открываем файл
            openFile(path, content);
        }
    }

    // Функция для открытия файла
    function openFile(path: string, content: string) {
        if (activeTabs[path]) {
            // Если вкладка уже открыта, переключаемся на неё
            selectTab(activeTabs[path].tabElement);
        } else {
            // Если вкладка не существует, создаём новую
            const newTab = createFileTab(path, content);
            // Добавляем вкладку в контейнер
            uiElements.fileTabContainer?.appendChild(newTab);
            // Сохраняем вкладку и её содержимое
            activeTabs[path] = { tabElement: newTab, content };
            // Переключаемся на эту вкладку
            selectTab(newTab);
        }
        // Устанавливаем выбранный файл
        selectedFile = { path, content, tabElement: activeTabs[path].tabElement };

        if (uiElements.editor) {
            // Заполняем редактор содержимым файла
            uiElements.editor.value = content; 
            // Обновляем плейсхолдер редактора
            uiElements.editor.placeholder = `Редактирование: ${path}`;
            // Показываем редактор
            uiElements.editor.style.display = "block";
        }

        if (uiElements.saveButton) {
            // Показываем кнопку сохранения
            uiElements.saveButton.style.display = "block";
            // Разблокируем кнопку
            uiElements.saveButton.disabled = false;
        }
    }

    // Функция для закрытия файла
    function closeFile(path: string) {
        if (!path) return; // Если путь не передан, выходим из функции

        const tabData = activeTabs[path];
        if (tabData) {
            // Удаляем вкладку
            tabData.tabElement.remove();
            // Удаляем вкладку из активных
            delete activeTabs[path];

            if (selectedFile && selectedFile.path === path) {
                // Если это был выбранный файл, обнуляем его
                selectedFile = null;
            }

            if (uiElements.editor) {
                // Скрываем редактор
                uiElements.editor.style.display = "none";
            }
            if (uiElements.saveButton) {
                // Скрываем кнопку сохранения
                uiElements.saveButton.style.display = "none";
            }
        }
    }

    // Функция для создания вкладки для файла
    function createFileTab(path: string, content: string): HTMLElement {
        const tab = document.createElement("div");
        tab.classList.add("file-tab");

        // Добавляем название файла
        const tabName = document.createElement("span");
        // Отображаем имя файла
        tabName.textContent = path.split("/").pop() || "Неизвестный файл";
        tab.appendChild(tabName);

        // Добавляем крестик для закрытия вкладки
        const closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.classList.add("close-tab");
        closeButton.onclick = (event) => {
            event.stopPropagation();  // Чтобы не сработал обработчик на самой вкладке
            closeFile(path);  // Закрыть файл по пути
        };
        tab.appendChild(closeButton);

        // Обработчик клика на вкладку (не на крестик)
        tab.onclick = (event) => {
            // Проверяем, не был ли клик на крестике
            if ((event.target as HTMLElement).classList.contains("close-tab")) {
                return;  // Если клик был на крестике, не выполняем дальнейшую логику
            }

            // Если клик был на вкладке, открываем файл с его содержимым
            openFile(path, content);
        };

        return tab;
    }

    // Функция для выделения вкладки
    function selectTab(tab: HTMLElement) {
        const tabs = uiElements.fileTabContainer?.querySelectorAll(".file-tab");
        if (tabs) {
            // Убираем выделение с всех вкладок
            tabs.forEach((tabElement) => tabElement.classList.remove("active"));
            // Добавляем выделение на текущую вкладку
            tab.classList.add("active");

            // Открываем файл в редакторе
            const filePath = tab.textContent?.trim();
            const file = Object.keys(activeTabs).find((path) => path.split("/").pop() === filePath);
            if (file && selectedFile) {
                // Открываем файл и отображаем его содержимое в редакторе
                openFile(file, activeTabs[file].content);
            }
        }
    }

    // Обработчик клика вне панели для снятия выделения с папки
    document.addEventListener("click", (event) => {
        const target = event.target as HTMLElement;
        if (target && !target.closest("#sidebar") && !target.closest(".folder") && !target.closest(".toolbar-button") && !target.closest("#input-file")) {
            deselectFolder();// Снимаем выделение с папки
        }
    });

    if (uiElements.saveButton) {// Слушаем клик на кнопке "сохранить"
        uiElements.saveButton.addEventListener("click", handleSaveFile);
    }
    if (uiElements.createFolderButton) {// Слушаем клик на кнопке "создать папку"
        uiElements.createFolderButton.addEventListener("click", handleCreateFolder);
    }
    if (uiElements.deleteFolderButton) {// Слушаем клик на кнопке "удалить папку"
        uiElements.deleteFolderButton.addEventListener("click", handleDeleteFolder);
    }
    if (uiElements.uploadFileButton) { // Слушаем клик на кнопке "загрузить файл"
        uiElements.uploadFileButton.addEventListener("click", handleUploadFile);
    }
    if (uiElements.deleteFileButton) {// Слушаем клик на кнопке "удалить файл"
        uiElements.deleteFileButton.addEventListener("click", handleDeleteFile);
    }
    if (uiElements.downloadFileButton) {// Слушаем клик на кнопке "скачать файл"
        uiElements.downloadFileButton.addEventListener("click", handleDownloadFile);
    }
    if (uiElements.renameButton) {// Слушаем клик на кнопке "переименовать"
        uiElements.renameButton.addEventListener("click", handleRenameItem);
    }

    // Сохраняет изменения в файле и обновляет структуру проекта.
    function handleSaveFile() {
        if (selectedFile) {
            const newContent = uiElements.editor?.value || '';
            const { parent, name } = getParentFolder(selectedFile.path);
            parent[name] = newContent;
            saveProjectStructure();
            alert(`Файл "${selectedFile.path.split("/").pop()}" сохранен.`);
            closeFile(selectedFile?.path || "");
            updateFolderStructure();
        }
    }

    // Обработчик для создания новой папки
    function handleCreateFolder() {
        const folderName = prompt("Введите имя новой папки:");
        if (!folderName) return;

        let currentFolder = projectStructure;

        if (selectedFolder) {
            const pathParts = selectedFolder.name.split("/");
            pathParts.forEach(part => {
                currentFolder = currentFolder[part];
            });
        }

        if (!currentFolder[folderName]) {
            currentFolder[folderName] = {};
            saveProjectStructure();
            updateFolderStructure();
        } else {
            alert("Папка с таким именем уже существует!");
        }
    }

    // Позволяет получать родительскую папку
    //  для любого файла по его пути в структуре.
    function getParentFolder(path: string) {
    const pathParts = path.split("/");
    const name = pathParts.pop() || "";
    let parent = projectStructure;

    pathParts.forEach(part => {
        parent = parent[part];
    });

    return { parent, name };
}

    // Обработчик для удаления папки
    function handleDeleteFolder() {
        if (selectedFolder) {
            const confirmDelete = confirm(`Удалить папку "${selectedFolder.name}" и все ее содержимое?`);
            if (confirmDelete) {
                const { parent, name } = getParentFolder(selectedFolder.name);
                delete parent[name];
                saveProjectStructure();
                updateFolderStructure();
                selectedFolder = null;
            }
        } else {
            alert("Пожалуйста, выберите папку для удаления.");
        }
    }

    // Обработчик для загрузки файла
    function handleUploadFile(event: Event) {
        event.stopPropagation();
        if (selectedFolder) {
            uiElements.inputFile?.click();
        } else {
            alert("Выберите папку для загрузки файла.");
        }
    }

    // Обработчик для загрузки файла после выбора
    if (uiElements.inputFile) {
        uiElements.inputFile.addEventListener("change", handleFileUpload);
    }

    function handleFileUpload(event: Event) {
        event.stopPropagation();
        const files = (event.target as HTMLInputElement).files;
        
        if (files && files.length > 0 && selectedFolder) {
            const file = files[0];
            const reader = new FileReader();
            
            // Определяем расширение файла
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            let fileType = 'other'; // По умолчанию для неизвестных типов файлов
    
            if (fileExtension === 'txt') {
                fileType = 'txt';
            } else if (fileExtension === 'pdf') {
                fileType = 'pdf';
            }
    
            reader.onload = () => {
                const content = reader.result as string;
                const fileName = file.name;
                let currentFolder = projectStructure;
    
                if (selectedFolder) {
                    const pathParts = selectedFolder.name.split("/");
                    pathParts.forEach(part => {
                        currentFolder = currentFolder[part];
                    });
                }
    
                // Сохраняем файл в структуру проекта
                currentFolder[fileName] = content;
    
                // Если файл типа .txt или .pdf, можно дополнительно обработать его
                // Добавьте соответствующие иконки для этих типов в структуру (если нужно)
                
                // Сохраняем структуру проекта
                saveProjectStructure();
                updateFolderStructure();
                
                // Показать уведомление
                alert(`Файл "${fileName}" загружен.`);
            };
    
            reader.readAsText(file);  // Для загрузки текстового содержимого файла
        } else {
            alert("Файл не выбран или папка не выбрана.");
        }
    }
    
    // Обработчик для удаления файла
    function handleDeleteFile() {
        if (selectedFile) {
            const confirmDelete = confirm(`Удалить файл "${selectedFile.path.split("/").pop()}"?`);
            if (confirmDelete) {
                const { parent, name } = getParentFolder(selectedFile.path);
                delete parent[name];
                saveProjectStructure();
                updateFolderStructure();
                closeFile(selectedFile?.path || "");
            }
        } else {
            alert("Выберите файл для удаления.");
        }
    }

    // Обработчик для скачивания файла
    function handleDownloadFile() {
        if (selectedFile) {
            const blob = new Blob([selectedFile.content], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = selectedFile.path.split("/").pop()!;
            link.click();
        } else {
            alert("Выберите файл для скачивания.");
        }
    }

    // Обработчик для переименования элемента (папки или файла)
    function handleRenameItem() {
        if (selectedFile) {
            const newName = prompt("Введите новое имя файла:", selectedFile.path.split("/").pop());
            if (newName) {
                const { parent, name } = getParentFolder(selectedFile.path);
                parent[newName] = parent[name];
                delete parent[name];
                saveProjectStructure();
                selectedFile.path = selectedFile.path.replace(name, newName);
                updateFolderStructure();
                alert(`Файл переименован в "${newName}".`);
            }
        } else if (selectedFolder) {
            const newName = prompt("Введите новое имя папки:", selectedFolder.name.split("/").pop());
            if (newName) {
                const { parent, name } = getParentFolder(selectedFolder.name);
                parent[newName] = parent[name];
                delete parent[name];
                saveProjectStructure();
                selectedFolder.name = selectedFolder.name.replace(name, newName);
                updateFolderStructure();
                alert(`Папка переименована в "${newName}".`);
            }
        } else {
            alert("Пожалуйста, выберите элемент для переименования.");
        }
    }

    updateFolderStructure();  // Инициализация структуры при загрузке
});
