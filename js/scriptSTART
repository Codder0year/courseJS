document.addEventListener('DOMContentLoaded', () => { 
    const createFolderButton = document.getElementById("create-folder-button");
    const deleteFolderButton = document.getElementById("delete-folder-button");
    const uploadFileButton = document.getElementById("upload-file-button");
    const deleteFileButton = document.getElementById("delete-file-button");
    const saveButton = document.getElementById("save-button");
    const editor = document.getElementById("editor");
    const inputFile = document.getElementById("input-file");
    let selectedFolder = null;
    let selectedFile = null;

    // Загружаем структуру проекта из localStorage
    function loadProjectStructure() {
        const savedStructure = localStorage.getItem("projectStructure");
        return savedStructure ? JSON.parse(savedStructure) : {};
    }

    // Сохраняем структуру проекта в localStorage
    function saveProjectStructure() {
        localStorage.setItem("projectStructure", JSON.stringify(projectStructure));
    }

    let projectStructure = loadProjectStructure();

    // Обновляем интерфейс структуры папок
    function updateFolderStructure() {
        const sidebar = document.getElementById("sidebar");
        sidebar.innerHTML = "<h3>Project Structure</h3>";

        // Рекурсивное отображение структуры
        function renderFolder(structure, parentElement, path = "") {
            Object.keys(structure).forEach(folderName => {
                const fullPath = path ? `${path}/${folderName}` : folderName;

                const folderElement = document.createElement("div");
                folderElement.classList.add("folder");
                folderElement.textContent = folderName;
                folderElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
                folderElement.onclick = (event) => {
                    event.stopPropagation();
                    selectFolder(fullPath, folderElement);
                };

                parentElement.appendChild(folderElement);

                // Отображение файлов
                if (structure[folderName]?.files && structure[folderName].files.length > 0) {
                    structure[folderName].files.forEach(file => {
                        const fileElement = document.createElement("div");
                        fileElement.classList.add("file");
                        fileElement.textContent = file;
                        fileElement.style.marginLeft = `${(fullPath.split("/").length + 1) * 20}px`;
                        fileElement.onclick = (event) => {
                            event.stopPropagation();
                            openFile(file);
                        };
                        parentElement.appendChild(fileElement);
                    });
                }

                // Рекурсивное отображение вложенных папок
                renderFolder(structure[folderName]?.folders || {}, parentElement, fullPath);
            });
        }

        renderFolder(projectStructure, sidebar);
    }

    // Выбор папки
    function selectFolder(path, element) {
        if (selectedFolder) {
            selectedFolder.element.classList.remove("selected");
        }
        selectedFolder = { name: path, element };
        element.classList.add("selected");
    }

    // Открытие файла
    function openFile(file) {
        selectedFile = file;
        editor.value = `Редактирование файла: ${file}`;
        saveButton.disabled = false;
    }

    // Рекурсивное удаление папки
    function deleteFolder(structure, path) {
        const parts = path.split("/");
        const folderName = parts.pop();
        const parentPath = parts.join("/");
        let parent = projectStructure;

        if (parentPath) {
            const pathParts = parentPath.split("/");
            for (const part of pathParts) {
                parent = parent[part]?.folders;
            }
        }

        if (parent && parent[folderName]) {
            delete parent[folderName];
        }
    }

    // Создание папки
    createFolderButton.addEventListener("click", () => {
        const folderName = prompt("Введите название новой папки:");
        if (!folderName) return;

        if (selectedFolder) {
            const pathParts = selectedFolder.name.split("/");
            let current = projectStructure;

            pathParts.forEach(part => {
                current = current[part]?.folders;
            });

            if (!current[folderName]) {
                current[folderName] = { files: [], folders: {} };
                saveProjectStructure();
                updateFolderStructure();
            } else {
                alert("Папка с таким именем уже существует!");
            }
        } else {
            if (!projectStructure[folderName]) {
                projectStructure[folderName] = { files: [], folders: {} };
                saveProjectStructure();
                updateFolderStructure();
            } else {
                alert("Папка с таким именем уже существует!");
            }
        }
    });

    // Удаление папки
    deleteFolderButton.addEventListener("click", () => {
        if (selectedFolder) {
            const confirmDelete = confirm(`Удалить папку "${selectedFolder.name}" и её содержимое?`);
            if (confirmDelete) {
                deleteFolder(projectStructure, selectedFolder.name);
                saveProjectStructure();
                updateFolderStructure();
                selectedFolder = null;
            }
        } else {
            alert("Выберите папку для удаления.");
        }
    });

    // Добавление файла
    uploadFileButton.addEventListener("click", () => {
        if (selectedFolder) {
            inputFile.click();
        } else {
            alert("Выберите папку для загрузки файла.");
        }
    });

    inputFile.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file || !selectedFolder) {
            alert("Выберите файл для загрузки и папку.");
            return;
        }
    
        const pathParts = selectedFolder.name.split("/");
        let current = projectStructure;
    
        // Проходим по каждому уровню пути и проверяем существование выбранной папки
        for (const part of pathParts) {
            if (!current[part]) {
                alert(`Путь "${selectedFolder.name}" некорректен. Папка "${part}" отсутствует.`);
                return;
            }
            current = current[part]?.folders || current[part]; // Переходим в текущую папку
        }
    
        // Просто добавляем файл в текущую папку
        // Прямо добавляем имя файла в папку без создания массива или каких-либо дополнительных структур
        // Например, можно просто добавить файл в текущую папку, если это необходимо
    
        current[file.name] = file; // Просто закидываем файл в папку
    
        // Сохраняем обновленную структуру
        saveProjectStructure();
    
        // Обновляем отображение структуры
        updateFolderStructure();
    
        alert(`Файл "${file.name}" успешно загружен в папку "${selectedFolder.name}".`);
    });

    // Обновление интерфейса при загрузке
    updateFolderStructure();
});
