document.addEventListener("DOMContentLoaded", function () {
    // Элементы UI, с которыми будем работать
    var uiElements = {
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
    var selectedFolder = null;
    var selectedFile = null;
    var folderStates = {};
    var projectStructure = loadProjectStructure();
    var activeTabs = {};
    // Загрузка структуры проекта из localStorage
    function loadProjectStructure() {
        var savedStructure = localStorage.getItem("projectStructure");
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
    function renderFolder(structure, parentElement, path) {
        if (path === void 0) { path = ""; }
        Object.keys(structure).forEach(function (name) {
            var fullPath = path ? "".concat(path, "/").concat(name) : name;
            var item = structure[name];
            if (isFolder(item)) {
                renderFolderItem(fullPath, name, item, parentElement); // Передаем правильное количество аргументов
            }
            else {
                renderFileItem(fullPath, name, item, parentElement);
            }
        });
    }
    // Рендер файлов
    function renderFileItem(fullPath, name, content, parentElement) {
        var fileElement = createFileElement(name, fullPath, content);
        parentElement.appendChild(fileElement);
    }
    // Проверка, является ли элемент папкой
    function isFolder(item) {
        return typeof item === "object" && !item.content;
    }
    // Рендер папок
    function renderFolderItem(fullPath, name, item, parentElement) {
        var folderElement = createFolderElement(name, fullPath, item); // Передаем item сюда
        var childrenContainer = createChildrenContainer(fullPath);
        folderStates[fullPath] = folderStates[fullPath] || "closed";
        childrenContainer.style.display = folderStates[fullPath] === "open" ? "block" : "none";
        folderElement.onclick = function (event) {
            event.stopPropagation();
            toggleFolder(fullPath, folderElement, childrenContainer);
        };
        parentElement.appendChild(folderElement);
        parentElement.appendChild(childrenContainer);
        renderFolder(item, childrenContainer, fullPath); // Рекурсивный вызов для дочерних папок
    }
    function isFolderEmpty(item) {
        // Проверяем, есть ли у папки дочерние элементы
        return Object.keys(item).length === 0;
    }
    // Создание элемента папки
    function createFolderElement(name, fullPath, item) {
        var folderElement = document.createElement("div");
        folderElement.classList.add("folder");
        // Папка будет пустой или заполненной в зависимости от содержимого
        var folderImage = document.createElement("img");
        folderImage.src = isFolderEmpty(item) ? "assets/icons/пустаяпапка.png" : "assets/icons/полнаяпапка.png";
        folderImage.alt = isFolderEmpty(item) ? "Пустая папка" : "Заполненная папка";
        folderElement.appendChild(folderImage);
        var folderName = document.createElement("span");
        folderName.textContent = name;
        folderElement.appendChild(folderName);
        folderElement.style.marginLeft = "".concat(fullPath.split("/").length * 20, "px");
        return folderElement;
    }
    // Создание контейнера для дочерних элементов папки
    function createChildrenContainer(fullPath) {
        var container = document.createElement("div");
        container.classList.add("children-container");
        container.style.display = folderStates[fullPath] === "open" ? "block" : "none";
        return container;
    }
    // Создание элемента файла
    function createFileElement(name, fullPath, content) {
        var _a;
        var fileElement = document.createElement("div");
        fileElement.classList.add("file");
        // Определяем расширение файла
        var fileExtension = (_a = name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        var fileType = 'other'; // По умолчанию для неизвестных типов файлов
        if (fileExtension === 'txt') {
            fileType = 'txt';
        }
        else if (fileExtension === 'pdf') {
            fileType = 'pdf';
        }
        // Создаем изображение для файла в зависимости от типа
        var fileImage = document.createElement("img");
        if (fileType === 'txt') {
            fileImage.src = 'assets/icons/txt.png'; // Иконка для текстовых файлов
        }
        else if (fileType === 'pdf') {
            fileImage.src = 'assets/icons/pdf.png'; // Иконка для PDF файлов
        }
        else {
            fileImage.src = 'assets/icons/otherfile.png'; // Иконка для других типов файлов
        }
        fileImage.alt = name; // Устанавливаем название файла для alt атрибута
        // Добавляем иконку в элемент файла
        fileElement.appendChild(fileImage);
        // Добавляем название файла
        var fileNameElement = document.createElement("span");
        fileNameElement.textContent = name;
        fileElement.appendChild(fileNameElement);
        // Добавляем отступ в зависимости от вложенности
        fileElement.style.marginLeft = "".concat(fullPath.split("/").length * 20, "px");
        // Обработчик клика по файлу
        fileElement.onclick = function (event) {
            event.stopPropagation();
            toggleFile(fullPath, content);
        };
        return fileElement;
    }
    // Функция для переключения состояния папки (открыта/закрыта) и выделения её
    function toggleFolder(path, folderElement, childrenContainer) {
        // Переключаем состояние папки
        folderStates[path] = folderStates[path] === "open" ? "closed" : "open";
        // Скрываем или показываем содержимое папки
        childrenContainer.style.display = folderStates[path] === "open" ? "block" : "none";
        // Выделяем папку
        selectFolder(path, folderElement);
    }
    // Функция для выделения папки
    function selectFolder(path, element) {
        deselectFolder(); // Снимаем выделение с предыдущей папки
        selectedFolder = { name: path, element: element }; // Устанавливаем новую выбранную папку
        element.classList.add("selected"); // Добавляем класс выделения
        closeFile((selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || ""); // Закрываем текущий открытый файл
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
    function toggleFile(path, content) {
        if (selectedFile && selectedFile.path === path) {
            // Если файл уже открыт, закрываем его
            closeFile((selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "");
        }
        else {
            // Иначе открываем файл
            openFile(path, content);
        }
    }
    // Функция для открытия файла
    function openFile(path, content) {
        var _a;
        if (activeTabs[path]) {
            // Если вкладка уже открыта, переключаемся на неё
            selectTab(activeTabs[path].tabElement);
        }
        else {
            // Если вкладка не существует, создаём новую
            var newTab = createFileTab(path, content);
            // Добавляем вкладку в контейнер
            (_a = uiElements.fileTabContainer) === null || _a === void 0 ? void 0 : _a.appendChild(newTab);
            // Сохраняем вкладку и её содержимое
            activeTabs[path] = { tabElement: newTab, content: content };
            // Переключаемся на эту вкладку
            selectTab(newTab);
        }
        // Устанавливаем выбранный файл
        selectedFile = { path: path, content: content, tabElement: activeTabs[path].tabElement };
        if (uiElements.editor) {
            // Заполняем редактор содержимым файла
            uiElements.editor.value = content;
            // Обновляем плейсхолдер редактора
            uiElements.editor.placeholder = "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435: ".concat(path);
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
    function closeFile(path) {
        if (!path)
            return; // Если путь не передан, выходим из функции
        var tabData = activeTabs[path];
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
    function createFileTab(path, content) {
        var tab = document.createElement("div");
        tab.classList.add("file-tab");
        // Добавляем название файла
        var tabName = document.createElement("span");
        // Отображаем имя файла
        tabName.textContent = path.split("/").pop() || "Неизвестный файл";
        tab.appendChild(tabName);
        // Добавляем крестик для закрытия вкладки
        var closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.classList.add("close-tab");
        closeButton.onclick = function (event) {
            event.stopPropagation(); // Чтобы не сработал обработчик на самой вкладке
            closeFile(path); // Закрыть файл по пути
        };
        tab.appendChild(closeButton);
        // Обработчик клика на вкладку (не на крестик)
        tab.onclick = function (event) {
            // Проверяем, не был ли клик на крестике
            if (event.target.classList.contains("close-tab")) {
                return; // Если клик был на крестике, не выполняем дальнейшую логику
            }
            // Если клик был на вкладке, открываем файл с его содержимым
            openFile(path, content);
        };
        return tab;
    }
    // Функция для выделения вкладки
    function selectTab(tab) {
        var _a, _b;
        var tabs = (_a = uiElements.fileTabContainer) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".file-tab");
        if (tabs) {
            // Убираем выделение с всех вкладок
            tabs.forEach(function (tabElement) { return tabElement.classList.remove("active"); });
            // Добавляем выделение на текущую вкладку
            tab.classList.add("active");
            // Открываем файл в редакторе
            var filePath_1 = (_b = tab.textContent) === null || _b === void 0 ? void 0 : _b.trim();
            var file = Object.keys(activeTabs).find(function (path) { return path.split("/").pop() === filePath_1; });
            if (file && selectedFile) {
                // Открываем файл и отображаем его содержимое в редакторе
                openFile(file, activeTabs[file].content);
            }
        }
    }
    // Обработчик клика вне панели для снятия выделения с папки
    document.addEventListener("click", function (event) {
        var target = event.target;
        if (target && !target.closest("#sidebar") && !target.closest(".folder") && !target.closest(".toolbar-button") && !target.closest("#input-file")) {
            deselectFolder(); // Снимаем выделение с папки
        }
    });
    if (uiElements.saveButton) { // Слушаем клик на кнопке "сохранить"
        uiElements.saveButton.addEventListener("click", handleSaveFile);
    }
    if (uiElements.createFolderButton) { // Слушаем клик на кнопке "создать папку"
        uiElements.createFolderButton.addEventListener("click", handleCreateFolder);
    }
    if (uiElements.deleteFolderButton) { // Слушаем клик на кнопке "удалить папку"
        uiElements.deleteFolderButton.addEventListener("click", handleDeleteFolder);
    }
    if (uiElements.uploadFileButton) { // Слушаем клик на кнопке "загрузить файл"
        uiElements.uploadFileButton.addEventListener("click", handleUploadFile);
    }
    if (uiElements.deleteFileButton) { // Слушаем клик на кнопке "удалить файл"
        uiElements.deleteFileButton.addEventListener("click", handleDeleteFile);
    }
    if (uiElements.downloadFileButton) { // Слушаем клик на кнопке "скачать файл"
        uiElements.downloadFileButton.addEventListener("click", handleDownloadFile);
    }
    if (uiElements.renameButton) { // Слушаем клик на кнопке "переименовать"
        uiElements.renameButton.addEventListener("click", handleRenameItem);
    }
    // Сохраняет изменения в файле и обновляет структуру проекта.
    function handleSaveFile() {
        var _a;
        if (selectedFile) {
            var newContent = ((_a = uiElements.editor) === null || _a === void 0 ? void 0 : _a.value) || '';
            var _b = getParentFolder(selectedFile.path), parent_1 = _b.parent, name_1 = _b.name;
            parent_1[name_1] = newContent;
            saveProjectStructure();
            alert("\u0424\u0430\u0439\u043B \"".concat(selectedFile.path.split("/").pop(), "\" \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D."));
            closeFile((selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "");
            updateFolderStructure();
        }
    }
    // Обработчик для создания новой папки
    function handleCreateFolder() {
        var folderName = prompt("Введите имя новой папки:");
        if (!folderName)
            return;
        var currentFolder = projectStructure;
        if (selectedFolder) {
            var pathParts = selectedFolder.name.split("/");
            pathParts.forEach(function (part) {
                currentFolder = currentFolder[part];
            });
        }
        if (!currentFolder[folderName]) {
            currentFolder[folderName] = {};
            saveProjectStructure();
            updateFolderStructure();
        }
        else {
            alert("Папка с таким именем уже существует!");
        }
    }
    // Позволяет получать родительскую папку
    //  для любого файла по его пути в структуре.
    function getParentFolder(path) {
        var pathParts = path.split("/");
        var name = pathParts.pop() || "";
        var parent = projectStructure;
        pathParts.forEach(function (part) {
            parent = parent[part];
        });
        return { parent: parent, name: name };
    }
    // Обработчик для удаления папки
    function handleDeleteFolder() {
        if (selectedFolder) {
            var confirmDelete = confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443 \"".concat(selectedFolder.name, "\" \u0438 \u0432\u0441\u0435 \u0435\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435?"));
            if (confirmDelete) {
                var _a = getParentFolder(selectedFolder.name), parent_2 = _a.parent, name_2 = _a.name;
                delete parent_2[name_2];
                saveProjectStructure();
                updateFolderStructure();
                selectedFolder = null;
            }
        }
        else {
            alert("Пожалуйста, выберите папку для удаления.");
        }
    }
    // Обработчик для загрузки файла
    function handleUploadFile(event) {
        var _a;
        event.stopPropagation();
        if (selectedFolder) {
            (_a = uiElements.inputFile) === null || _a === void 0 ? void 0 : _a.click();
        }
        else {
            alert("Выберите папку для загрузки файла.");
        }
    }
    // Обработчик для загрузки файла после выбора
    if (uiElements.inputFile) {
        uiElements.inputFile.addEventListener("change", handleFileUpload);
    }
    function handleFileUpload(event) {
        var _a;
        event.stopPropagation();
        var files = event.target.files;
        if (files && files.length > 0 && selectedFolder) {
            var file_1 = files[0];
            var reader_1 = new FileReader();
            // Определяем расширение файла
            var fileExtension = (_a = file_1.name.split('.').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            var fileType = 'other'; // По умолчанию для неизвестных типов файлов
            if (fileExtension === 'txt') {
                fileType = 'txt';
            }
            else if (fileExtension === 'pdf') {
                fileType = 'pdf';
            }
            reader_1.onload = function () {
                var content = reader_1.result;
                var fileName = file_1.name;
                var currentFolder = projectStructure;
                if (selectedFolder) {
                    var pathParts = selectedFolder.name.split("/");
                    pathParts.forEach(function (part) {
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
                alert("\u0424\u0430\u0439\u043B \"".concat(fileName, "\" \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D."));
            };
            reader_1.readAsText(file_1); // Для загрузки текстового содержимого файла
        }
        else {
            alert("Файл не выбран или папка не выбрана.");
        }
    }
    // Обработчик для удаления файла
    function handleDeleteFile() {
        if (selectedFile) {
            var confirmDelete = confirm("\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0444\u0430\u0439\u043B \"".concat(selectedFile.path.split("/").pop(), "\"?"));
            if (confirmDelete) {
                var _a = getParentFolder(selectedFile.path), parent_3 = _a.parent, name_3 = _a.name;
                delete parent_3[name_3];
                saveProjectStructure();
                updateFolderStructure();
                closeFile((selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.path) || "");
            }
        }
        else {
            alert("Выберите файл для удаления.");
        }
    }
    // Обработчик для скачивания файла
    function handleDownloadFile() {
        if (selectedFile) {
            var blob = new Blob([selectedFile.content], { type: "text/plain" });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = selectedFile.path.split("/").pop();
            link.click();
        }
        else {
            alert("Выберите файл для скачивания.");
        }
    }
    // Обработчик для переименования элемента (папки или файла)
    function handleRenameItem() {
        if (selectedFile) {
            var newName = prompt("Введите новое имя файла:", selectedFile.path.split("/").pop());
            if (newName) {
                var _a = getParentFolder(selectedFile.path), parent_4 = _a.parent, name_4 = _a.name;
                parent_4[newName] = parent_4[name_4];
                delete parent_4[name_4];
                saveProjectStructure();
                selectedFile.path = selectedFile.path.replace(name_4, newName);
                updateFolderStructure();
                alert("\u0424\u0430\u0439\u043B \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D \u0432 \"".concat(newName, "\"."));
            }
        }
        else if (selectedFolder) {
            var newName = prompt("Введите новое имя папки:", selectedFolder.name.split("/").pop());
            if (newName) {
                var _b = getParentFolder(selectedFolder.name), parent_5 = _b.parent, name_5 = _b.name;
                parent_5[newName] = parent_5[name_5];
                delete parent_5[name_5];
                saveProjectStructure();
                selectedFolder.name = selectedFolder.name.replace(name_5, newName);
                updateFolderStructure();
                alert("\u041F\u0430\u043F\u043A\u0430 \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0430 \u0432 \"".concat(newName, "\"."));
            }
        }
        else {
            alert("Пожалуйста, выберите элемент для переименования.");
        }
    }
    updateFolderStructure(); // Инициализация структуры при загрузке
});
