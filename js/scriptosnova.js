document.addEventListener('DOMContentLoaded', () => {
    const createFolderButton = document.getElementById("create-folder-button");
    const deleteFolderButton = document.getElementById("delete-folder-button");
    const uploadFileButton = document.getElementById("upload-file-button");
    const deleteFileButton = document.getElementById("delete-file-button");
    const saveButton = document.getElementById("save-button");
    const editor = document.getElementById("editor");
    const inputFile = document.getElementById("input-file");
    const renameButton = document.querySelector(".toolbar-button:last-child"); // Переименовать
    let selectedFolder = null;
    let selectedFile = null;

    function loadProjectStructure() {
        const savedStructure = localStorage.getItem("projectStructure");
        return savedStructure ? JSON.parse(savedStructure) : {};
    }

    function saveProjectStructure() {
        localStorage.setItem("projectStructure", JSON.stringify(projectStructure));
    }

    let projectStructure = loadProjectStructure();

    function updateFolderStructure() {
        const sidebar = document.getElementById("sidebar");
        sidebar.innerHTML = "<h3>Project Structure</h3>";

        function renderFolder(structure, parentElement, path = "") {
            Object.keys(structure).forEach(name => {
                const fullPath = path ? `${path}/${name}` : name;
                const item = structure[name];

                if (typeof item === "object" && !item.content) {
                    // Render folder
                    const folderElement = document.createElement("div");
                    folderElement.classList.add("folder");
                    folderElement.textContent = name;
                    folderElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
                    folderElement.onclick = (event) => {
                        event.stopPropagation();
                        selectFolder(fullPath, folderElement);
                    };

                    parentElement.appendChild(folderElement);
                    renderFolder(item, parentElement, fullPath);
                } else {
                    // Render file
                    const fileElement = document.createElement("div");
                    fileElement.classList.add("file");
                    fileElement.textContent = name;
                    fileElement.style.marginLeft = `${(fullPath.split("/").length + 1) * 20}px`;
                    fileElement.onclick = (event) => {
                        event.stopPropagation();
                        openFile(fullPath, item);
                    };

                    parentElement.appendChild(fileElement);
                }
            });
        }

        renderFolder(projectStructure, sidebar);
    }

    function selectFolder(path, element) {
        if (selectedFolder) {
            selectedFolder.element.classList.remove("selected");
        }
        selectedFolder = { name: path, element };
        selectedFile = null;
        element.classList.add("selected");
        editor.value = "";
        saveButton.disabled = true;
    }

    function openFile(path, content) {
        selectedFile = { path, content };
        selectedFolder = null;
        editor.value = content;
        saveButton.disabled = false;
    }

    function getParentFolder(path) {
        const parts = path.split("/");
        const name = parts.pop();
        let current = projectStructure;

        for (const part of parts) {
            current = current[part];
        }

        return { parent: current, name };
    }

    createFolderButton.addEventListener("click", () => {
        const folderName = prompt("Введите название новой папки:");
        if (!folderName) return;

        let current = projectStructure;
        if (selectedFolder) {
            const pathParts = selectedFolder.name.split("/");
            for (const part of pathParts) {
                current = current[part];
            }
        }

        if (!current[folderName]) {
            current[folderName] = {};
            saveProjectStructure();
            updateFolderStructure();
        } else {
            alert("Папка с таким именем уже существует!");
        }
    });

    deleteFolderButton.addEventListener("click", () => {
        if (selectedFolder) {
            const confirmDelete = confirm(`Удалить папку "${selectedFolder.name}" и её содержимое?`);
            if (confirmDelete) {
                const { parent, name } = getParentFolder(selectedFolder.name);
                delete parent[name];
                saveProjectStructure();
                updateFolderStructure();
                selectedFolder = null;
            }
        } else {
            alert("Выберите папку для удаления.");
        }
    });

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

        const reader = new FileReader();
        reader.onload = () => {
            let current = projectStructure;
            const pathParts = selectedFolder.name.split("/");
            for (const part of pathParts) {
                current = current[part];
            }

            current[file.name] = reader.result;
            saveProjectStructure();
            updateFolderStructure();
            alert(`Файл "${file.name}" успешно загружен в папку "${selectedFolder.name}".`);
        };
        reader.readAsText(file);
    });

    deleteFileButton.addEventListener("click", () => {
        if (selectedFile) {
            const { parent, name } = getParentFolder(selectedFile.path);
            delete parent[name];
            saveProjectStructure();
            updateFolderStructure();
            selectedFile = null;
            editor.value = "";
            saveButton.disabled = true;
            alert("Файл удалён.");
        } else {
            alert("Выберите файл для удаления.");
        }
    });

    saveButton.addEventListener("click", () => {
        if (selectedFile) {
            const { parent, name } = getParentFolder(selectedFile.path);
            parent[name] = editor.value;
            saveProjectStructure();
            alert("Файл сохранён.");
        }
    });

    renameButton.addEventListener("click", () => {
        if (selectedFolder) {
            const newFolderName = prompt("Введите новое имя папки:", selectedFolder.name.split("/").pop());
            if (newFolderName) {
                const { parent, name } = getParentFolder(selectedFolder.name);
                parent[newFolderName] = parent[name];
                delete parent[name];
                saveProjectStructure();
                updateFolderStructure();
            }
        } else if (selectedFile) {
            const newFileName = prompt("Введите новое имя файла:", selectedFile.path.split("/").pop());
            if (newFileName) {
                const { parent, name } = getParentFolder(selectedFile.path);
                parent[newFileName] = parent[name];
                delete parent[name];
                saveProjectStructure();
                updateFolderStructure();
            }
        } else {
            alert("Выберите файл или папку для переименования.");
        }
    });

    updateFolderStructure();
});
