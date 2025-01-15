// file.js

// Добавление файла в структуру
function addFile(projectStructure, selectedFolder, file) {
    const pathParts = selectedFolder.name.split("/");
    let current = projectStructure;

    pathParts.forEach(part => {
        current = current[part]?.folders || current[part];
    });

    if (!current.files) {
        current.files = [];
    }

    current.files.push(file.name);
}