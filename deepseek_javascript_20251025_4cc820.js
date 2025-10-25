// Улучшенная функция для поиска компонента
function findComponent(type, name) {
    const searchName = name.toLowerCase().trim();
    
    // Удаляем лишние пробелы и приводим к нижнему регистру
    const cleanSearch = searchName.replace(/\s+/g, ' ');
    
    // Пытаемся найти точное совпадение или частичное
    let exactMatch = null;
    let partialMatches = [];
    
    for (const manufacturer in componentsDB[type]) {
        for (const model in componentsDB[type][manufacturer]) {
            const cleanModel = model.toLowerCase().replace(/\s+/g, ' ');
            
            // Точное совпадение (игнорируя регистр и лишние пробелы)
            if (cleanModel === cleanSearch) {
                exactMatch = {
                    ...componentsDB[type][manufacturer][model],
                    manufacturer: manufacturer,
                    model: model
                };
                break;
            }
            
            // Частичное совпадение (ищем вхождение)
            if (cleanModel.includes(cleanSearch) || cleanSearch.includes(cleanModel)) {
                partialMatches.push({
                    ...componentsDB[type][manufacturer][model],
                    manufacturer: manufacturer,
                    model: model
                });
            }
        }
        if (exactMatch) break;
    }
    
    // Возвращаем точное совпадение, если есть
    if (exactMatch) {
        return exactMatch;
    }
    
    // Если есть только одно частичное совпадение - возвращаем его
    if (partialMatches.length === 1) {
        return partialMatches[0];
    }
    
    // Если несколько частичных совпадений, ищем наиболее подходящее
    if (partialMatches.length > 1) {
        // Сортируем по длине (предпочитаем более короткие названия)
        partialMatches.sort((a, b) => a.model.length - b.model.length);
        
        // Ищем совпадение, где поисковый запрос является основной частью модели
        for (const match of partialMatches) {
            const modelWords = match.model.toLowerCase().split(' ');
            const searchWords = cleanSearch.split(' ');
            
            // Если все слова поиска содержатся в модели
            const allWordsMatch = searchWords.every(word => 
                modelWords.some(modelWord => modelWord.includes(word))
            );
            
            if (allWordsMatch) {
                return match;
            }
        }
        
        // Возвращаем первое совпадение
        return partialMatches[0];
    }
    
    return null;
}