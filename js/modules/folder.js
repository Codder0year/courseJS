// Создание новой папки
function createFolder(projectStructure, folderName, selectedFolder) {
    if (selectedFolder) {
        const pathParts = selectedFolder.name.split("/");
        let current = projectStructure;

        pathParts.forEach(part => {
            current = current[part]?.folders;
        });

        if (!current[folderName]) {
            current[folderName] = { files: [], folders: {} };
            return true;
        }
    } else {
        if (!projectStructure[folderName]) {
            projectStructure[folderName] = { files: [], folders: {} };
            return true;
        }
    }
    return false;
}

// Удаление папки
function deleteFolder(projectStructure, path) {
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