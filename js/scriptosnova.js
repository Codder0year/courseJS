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
