// Управление структурой файлов.
class FileManager {
    constructor() {
        // Инициализация структуры проекта, выбранных папок и файлов, состояний папок и вкладок.
        this.projectStructure = this.loadProjectStructure(); // Загружаем структуру проекта из localStorage.
        this.selectedFolder = null; // Выбранная папка.
        this.selectedFile = null; // Выбранный файл.
        this.folderStates = {}; // Состояния папок (открыты или закрыты).
        this.activeTabs = {}; // Активные вкладки (открытые файлы).
    }

    // Метод для загрузки структуры проекта из localStorage.
    loadProjectStructure() {
        let savedStructure = localStorage.getItem("projectStructure");
        // Если структура сохранена, парсим её, иначе возвращаем пустой объект.
        return savedStructure ? JSON.parse(savedStructure) : {};
    }

    // Метод для сохранения структуры проекта в localStorage.
    saveProjectStructure() {
        // Преобразуем структуру проекта в строку JSON и сохраняем в localStorage.
        localStorage.setItem("projectStructure", JSON.stringify(this.projectStructure));
    }

    // Метод для получения родительской папки по пути.
    getParentFolder(path) {
        let pathParts = path.split("/"); // Разбиваем путь на части (папки).
        let name = pathParts.pop() || ""; // Имя последней папки или файла.
        let parent = this.projectStructure; // Начинаем с корня проекта.
        
        // Проходим по всем частям пути и идем по структуре проекта.
        pathParts.forEach(function (part) {
            parent = parent[part]; // Переход к следующей папке.
        });

        // Возвращаем родительскую папку и имя последней части пути.
        return { parent: parent, name: name };
    }

    // Метод для проверки, является ли элемент папкой.
    isFolder(item) {
        return typeof item === "object" && !item.content; // Если это объект и нет контента, то это папка.
    }

    // Метод для проверки, пуста ли папка.
    isFolderEmpty(item) {
        return Object.keys(item).length === 0; // Если в папке нет элементов, она пуста.
    }
}
