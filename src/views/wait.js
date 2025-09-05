import waitHTML from './wait.html';

export const waitPage = (deletedCount, totalCount, nextStartId, endId, waitTime = 20) => {
    const progressPercent = totalCount > 0 ? Math.round((deletedCount / totalCount) * 100) : 0;
    
    // 添加日志来验证进度计算
    console.log(`[DEBUG] waitPage 参数:`);
    console.log(`[DEBUG] - deletedCount: ${deletedCount}`);
    console.log(`[DEBUG] - totalCount: ${totalCount}`);
    console.log(`[DEBUG] - nextStartId: ${nextStartId}`);
    console.log(`[DEBUG] - endId: ${endId}`);
    console.log(`[DEBUG] - waitTime: ${waitTime}`);
    console.log(`[DEBUG] - 计算出的 progressPercent: ${progressPercent}%`);

    // 先替换JavaScript中的变量，避免HTML模板替换影响
    let html = waitHTML
        .replaceAll('{waitTime}', waitTime)
        .replaceAll('{ waitTime }', waitTime)  // 添加带空格的版本
        .replaceAll('{deletedCount}', deletedCount)
        .replaceAll('{totalCount}', totalCount)
        .replaceAll('{nextStartId}', nextStartId)
        .replaceAll('{endId}', endId)
        .replaceAll('{progressPercent}', progressPercent)  // 将progressPercent替换放在最后
    
    // 添加日志来验证模板替换
    console.log(`[DEBUG] 模板替换验证:`);
    console.log(`[DEBUG] - {progressPercent} 是否被替换: ${!html.includes('{progressPercent}')}`);
    console.log(`[DEBUG] - {deletedCount} 是否被替换: ${!html.includes('{deletedCount}')}`);
    console.log(`[DEBUG] - {totalCount} 是否被替换: ${!html.includes('{totalCount}')}`);
    console.log(`[DEBUG] - {endId} 是否被替换: ${!html.includes('{endId}')}`);
    console.log(`[DEBUG] - 最终HTML中的进度条样式: ${html.match(/style="width: \d+%"/)}`);

    return html;
};