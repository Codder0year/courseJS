// ui.js

// Обновление интерфейса структуры папок
function updateFolderStructure(projectStructure) {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "<h3>Project Structure</h3>";

    // Рекурсивная функция для отображения папок и файлов
    function renderFolder(structure, parentElement, path = "") {
        Object.keys(structure).forEach(folderName => {
            const fullPath = path ? `${path}/${folderName}` : folderName;

            const folderElement = document.createElement("div");
            folderElement.classList.add("folder");
            folderElement.textContent = folderName;
            folderElement.style.marginLeft = `${fullPath.split("/").length * 20}px`;
            folderElement.onclick = (event) => {
                event.stopPropagation();
                selectFolder(fullPath, folderElement);  // selectFolder должна быть доступна
            };
            parentElement.appendChild(folderElement);

            // Отображение файлов внутри папки
            if (structure[folderName]?.files && structure[folderName].files.length > 0) {
                structure[folderName].files.forEach(file => {
                    const fileElement = document.createElement("div");
                    fileElement.classList.add("file");
                    fileElement.textContent = file;
                    fileElement.style.marginLeft = `${(fullPath.split("/").length + 1) * 20}px`;
                    fileElement.onclick = (event) => {
                        event.stopPropagation();
                        openFile(file);  // Открытие файла
                    };
                    parentElement.appendChild(fileElement);
                });
            }
        });
    }

    renderFolder(projectStructure, sidebar);
}