// Инициализация и связывание всех компонентов.
document.addEventListener("DOMContentLoaded", function () {
    // Создаем экземпляр менеджера файлов (управляет структурой файлов)
    const fileManager = new FileManager();

    // Создаем экземпляр UI-менеджера, который будет управлять интерфейсом и взаимодействием с пользователем
    const uiManager = new UIManager(fileManager);

    // Создаем экземпляр обработчиков событий, которые связывают UI с функциональностью
    const eventHandlers = new EventHandlers(fileManager, uiManager);

    // Обновляем структуру папок на интерфейсе при загрузке страницы
    uiManager.updateFolderStructure();
});