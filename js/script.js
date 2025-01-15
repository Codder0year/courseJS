// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    const createFolderButton = document.getElementById("create-folder-button");
    const deleteFolderButton = document.getElementById("delete-folder-button");
    const uploadFileButton = document.getElementById("upload-file-button");
    const inputFile = document.getElementById("input-file");
    const saveButton = document.getElementById("save-button");
    const editor = document.getElementById("editor");

    let selectedFolder = null;
    let selectedFile = null;
    let projectStructure = loadProjectStructure();

    // Функция для выбора папки
    window.selectFolder = function(path, element) {
        if (selectedFolder) {
            selectedFolder.element.classList.remove("selected");
        }
        selectedFolder = { name: path, element };
        element.classList.add("selected");
    };

    // Открытие файла
    function openFile(file) {
        selectedFile = file;
        editor.value = `Редактирование файла: ${file}`;
        saveButton.disabled = false;
    }

    // Создание папки
    createFolderButton.addEventListener("click", () => {
        const folderName = prompt("Введите название новой папки:");
        if (!folderName) return;

        if (createFolder(projectStructure, folderName, selectedFolder)) {
            saveProjectStructure(projectStructure);
            updateFolderStructure(projectStructure);
        } else {
            alert("Папка с таким именем уже существует!");
        }
    });

    // Удаление папки
    deleteFolderButton.addEventListener("click", () => {
        if (selectedFolder) {
            const confirmDelete = confirm(`Удалить папку "${selectedFolder.name}" и её содержимое?`);
            if (confirmDelete) {
                deleteFolder(projectStructure, selectedFolder.name);
                saveProjectStructure(projectStructure);
                updateFolderStructure(projectStructure);
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

        addFile(projectStructure, selectedFolder, file);
        saveProjectStructure(projectStructure);
        updateFolderStructure(projectStructure);

        alert(`Файл "${file.name}" успешно загружен в папку "${selectedFolder.name}".`);
    });

    // Изначально обновляем структуру папок
    updateFolderStructure(projectStructure);
});