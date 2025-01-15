// storage.js

// Загрузка структуры проекта из localStorage
function loadProjectStructure() {
    const savedStructure = localStorage.getItem("projectStructure");
    return savedStructure ? JSON.parse(savedStructure) : {};
}

// Сохранение структуры проекта в localStorage
function saveProjectStructure(projectStructure) {
    localStorage.setItem("projectStructure", JSON.stringify(projectStructure));
}