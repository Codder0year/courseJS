//  Обработчики событий, связывающие интерфейс с функциональностью.
class EventHandlers {
    // Конструктор класса, инициализирует события для UI-элементов
    constructor(fileManager, uiManager) {
        this.fileManager = fileManager;  // Менеджер файлов
        this.uiManager = uiManager;      // Менеджер UI
        this.initializeEventHandlers();  // Инициализация обработчиков событий
    }

    // Метод для регистрации обработчиков событий на UI-элементы
    initializeEventHandlers() {
        // Обработчик для кнопки "Сохранить файл"
        if (this.uiManager.uiElements.saveButton) {
            this.uiManager.uiElements.saveButton.addEventListener("click", () => this.handleSaveFile());
        }

        // Обработчик для кнопки "Создать папку"
        if (this.uiManager.uiElements.createFolderButton) {
            this.uiManager.uiElements.createFolderButton.addEventListener("click", () => this.handleCreateFolder());
        }

        // Обработчик для кнопки "Удалить папку"
        if (this.uiManager.uiElements.deleteFolderButton) {
            this.uiManager.uiElements.deleteFolderButton.addEventListener("click", () => this.handleDeleteFolder());
        }

        // Обработчик для кнопки "Загрузить файл"
        if (this.uiManager.uiElements.uploadFileButton) {
            this.uiManager.uiElements.uploadFileButton.addEventListener("click", (event) => this.handleUploadFile(event));
        }

        // Обработчик для кнопки "Удалить файл"
        if (this.uiManager.uiElements.deleteFileButton) {
            this.uiManager.uiElements.deleteFileButton.addEventListener("click", () => this.handleDeleteFile());
        }

        // Обработчик для кнопки "Скачать файл"
        if (this.uiManager.uiElements.downloadFileButton) {
            this.uiManager.uiElements.downloadFileButton.addEventListener("click", () => this.handleDownloadFile());
        }

        // Обработчик для кнопки "Переименовать"
        if (this.uiManager.uiElements.renameButton) {
            this.uiManager.uiElements.renameButton.addEventListener("click", () => this.handleRenameItem());
        }

        // Обработчик для загрузки файлов через input
        if (this.uiManager.uiElements.inputFile) {
            this.uiManager.uiElements.inputFile.addEventListener("change", (event) => this.handleFileUpload(event));
        }

        // Обработчик кликов вне элементов панели (снимает выделение с папки)
        document.addEventListener("click", (event) => {
            let target = event.target;
            if (target && !target.closest("#sidebar") && !target.closest(".folder") && !target.closest(".toolbar-button") && !target.closest("#input-file")) {
                this.uiManager.deselectFolder();
            }
        });
    }

    // Обработчик для сохранения файла
    handleSaveFile() {
        if (this.fileManager.selectedFile) {
            let newContent = this.uiManager.uiElements.editor?.value || '';  // Получаем новый контент из редактора
            let { parent, name } = this.fileManager.getParentFolder(this.fileManager.selectedFile.path);  // Получаем родительскую папку
            parent[name] = newContent;  // Сохраняем новый контент
            this.fileManager.saveProjectStructure();  // Сохраняем структуру проекта
            alert(`Файл "${this.fileManager.selectedFile.path.split("/").pop()}" сохранен.`);  // Уведомление
            this.uiManager.closeFile(this.fileManager.selectedFile?.path || "");  // Закрыть файл
            this.uiManager.updateFolderStructure();  // Обновить структуру папок
        }
    }

    // Обработчик для создания новой папки
    handleCreateFolder() {
        let folderName = prompt("Введите имя новой папки:");
        if (!folderName) return;  // Если имя пустое, выходим
        let currentFolder = this.fileManager.projectStructure;
        if (this.fileManager.selectedFolder) {
            let pathParts = this.fileManager.selectedFolder.name.split("/");  // Разбираем путь папки
            pathParts.forEach((part) => {
                currentFolder = currentFolder[part];
            });
        }
        if (!currentFolder[folderName]) {
            currentFolder[folderName] = {};  // Создаем новую папку
            this.fileManager.saveProjectStructure();  // Сохраняем изменения
            this.uiManager.updateFolderStructure();  // Обновляем структуру
        } else {
            alert("Папка с таким именем уже существует!");  // Если папка уже есть
        }
    }

    // Обработчик для удаления папки
    handleDeleteFolder() {
        if (this.fileManager.selectedFolder) {
            let confirmDelete = confirm(`Удалить папку "${this.fileManager.selectedFolder.name}" и все ее содержимое?`);
            if (confirmDelete) {
                let { parent, name } = this.fileManager.getParentFolder(this.fileManager.selectedFolder.name);  // Получаем родительскую папку
                delete parent[name];  // Удаляем папку
                this.fileManager.saveProjectStructure();  // Сохраняем изменения
                this.uiManager.updateFolderStructure();  // Обновляем структуру
                this.fileManager.selectedFolder = null;  // Снимаем выделение с папки
            }
        } else {
            alert("Пожалуйста, выберите папку для удаления.");
        }
    }

    // Обработчик для инициирования загрузки файла
    handleUploadFile(event) {
        event.stopPropagation();  // Останавливаем распространение события
        if (this.fileManager.selectedFolder) {
            this.uiManager.uiElements.inputFile?.click();  // Открываем окно выбора файла
        } else {
            alert("Выберите папку для загрузки файла.");
        }
    }

    // Обработчик для загрузки файла
    handleFileUpload(event) {
        event.stopPropagation();
        let files = event.target.files;
        if (files && files.length > 0 && this.fileManager.selectedFolder) {
            let file = files[0];
            let reader = new FileReader();  // Чтение файла
            let fileExtension = file.name.split('.').pop()?.toLowerCase();  // Получаем расширение файла
            let fileType = 'other';
            if (fileExtension === 'txt') {
                fileType = 'txt';
            } else if (fileExtension === 'pdf') {
                fileType = 'pdf';
            }
            reader.onload = () => {
                let content = reader.result;  // Содержимое файла
                let fileName = file.name;
                let currentFolder = this.fileManager.projectStructure;
                if (this.fileManager.selectedFolder) {
                    let pathParts = this.fileManager.selectedFolder.name.split("/");
                    pathParts.forEach((part) => {
                        currentFolder = currentFolder[part];
                    });
                }
                currentFolder[fileName] = content;  // Добавляем файл в структуру
                this.fileManager.saveProjectStructure();  // Сохраняем структуру
                this.uiManager.updateFolderStructure();  // Обновляем структуру
                alert(`Файл "${fileName}" загружен.`);
            };
            reader.readAsText(file);  // Чтение файла как текст
        } else {
            alert("Файл не выбран или папка не выбрана.");
        }
    }

    // Обработчик для удаления файла
    handleDeleteFile() {
        if (this.fileManager.selectedFile) {
            let confirmDelete = confirm(`Удалить файл "${this.fileManager.selectedFile.path.split("/").pop()}"?`);
            if (confirmDelete) {
                let { parent, name } = this.fileManager.getParentFolder(this.fileManager.selectedFile.path);  // Получаем родительскую папку
                delete parent[name];  // Удаляем файл
                this.fileManager.saveProjectStructure();  // Сохраняем изменения
                this.uiManager.updateFolderStructure();  // Обновляем структуру
                this.uiManager.closeFile(this.fileManager.selectedFile?.path || "");  // Закрыть файл
            }
        } else {
            alert("Выберите файл для удаления.");
        }
    }

    // Обработчик для скачивания файла
    handleDownloadFile() {
        if (this.fileManager.selectedFile) {
            let blob = new Blob([this.fileManager.selectedFile.content], { type: "text/plain" });  // Создаем Blob-объект
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);  // Создаем ссылку для скачивания
            link.download = this.fileManager.selectedFile.path.split("/").pop();  // Имя файла
            link.click();  // Имитируем клик для скачивания
        } else {
            alert("Выберите файл для скачивания.");
        }
    }

    // Обработчик для переименования элемента (папки или файла)
    handleRenameItem() {
        if (this.fileManager.selectedFile) {
            let newName = prompt("Введите новое имя файла:", this.fileManager.selectedFile.path.split("/").pop());
            if (newName) {
                let { parent, name } = this.fileManager.getParentFolder(this.fileManager.selectedFile.path);  // Получаем родительскую папку
                parent[newName] = parent[name];  // Переименовываем файл
                delete parent[name];  // Удаляем старое имя
                this.fileManager.saveProjectStructure();  // Сохраняем структуру
                this.fileManager.selectedFile.path = this.fileManager.selectedFile.path.replace(name, newName);  // Обновляем путь файла
                this.uiManager.updateFolderStructure();  // Обновляем структуру папок
                alert(`Файл переименован в "${newName}".`);
            }
        } else if (this.fileManager.selectedFolder) {
            let newName = prompt("Введите новое имя папки:", this.fileManager.selectedFolder.name.split("/").pop());
            if (newName) {
                let { parent, name } = this.fileManager.getParentFolder(this.fileManager.selectedFolder.name);  // Получаем родительскую папку
                parent[newName] = parent[name];  // Переименовываем папку
                delete parent[name];  // Удаляем старое имя
                this.fileManager.saveProjectStructure();  // Сохраняем структуру
                this.fileManager.selectedFolder.name = this.fileManager.selectedFolder.name.replace(name, newName);  // Обновляем путь папки
                this.uiManager.updateFolderStructure();  // Обновляем структуру папок
                alert(`Папка переименована в "${newName}".`);
            }
        } else {
            alert("Пожалуйста, выберите элемент для переименования.");
        }
    }
}
