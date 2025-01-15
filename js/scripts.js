document.addEventListener('DOMContentLoaded', () => { 
    const createFolderButton = document.getElementById("create-folder-button");
    const deleteFolderButton = document.getElementById("delete-folder-button");
    const deleteFileButton = document.getElementById("delete-file-button");
    const saveButton = document.getElementById("save-button");
    const editor = document.getElementById("editor");
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

    // Удаление файла из структуры
    function deleteFile(structure, folderPath, fileName) {
        const parts = folderPath.split("/");
        let parent = structure;

        // Идем по пути папки, чтобы добраться до нужной папки
        for (const part of parts) {
            if (parent[part]) {
                parent = parent[part].folders || parent[part];  // Переходим в папки
            }
        }

        if (parent && parent[folderPath] && parent[folderPath].files) {
            const fileIndex = parent[folderPath].files.indexOf(fileName);
            if (fileIndex !== -1) {
                parent[folderPath].files.splice(fileIndex, 1);  // Удаляем файл из массива
                saveProjectStructure();  // Сохраняем изменения
                updateFolderStructure();  // Обновляем структуру
                selectedFile = null;  // Сбрасываем выбранный файл
            }
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

    // Удаление файла
    deleteFileButton.addEventListener("click", () => {
        if (selectedFolder && selectedFile) {
            const confirmDelete = confirm(`Удалить файл "${selectedFile}"?`);
            if (confirmDelete) {
                deleteFile(projectStructure, selectedFolder.name, selectedFile);
            }
        } else {
            alert("Выберите файл для удаления.");
        }
    });

    // Обновление интерфейса при загрузке
    updateFolderStructure();
});
