import waitHTML from './wait.html';

export const waitPage = (deletedCount, totalCount, nextStartId, endId, waitTime = 20) => {
    const progressPercent = totalCount > 0 ? Math.round((deletedCount / totalCount) * 100) : 0;
    

    // 先替换JavaScript中的变量，避免HTML模板替换影响
    let html = waitHTML
        .replaceAll('{waitTime}', waitTime)
        .replaceAll('{ waitTime }', waitTime)  // 添加带空格的版本
        .replaceAll('{deletedCount}', deletedCount)
        .replaceAll('{totalCount}', totalCount)
        .replaceAll('{nextStartId}', nextStartId)
        .replaceAll('{endId}', endId)
        .replaceAll('{progressPercent}', progressPercent)  // 将progressPercent替换放在最后
    

    return html;
};