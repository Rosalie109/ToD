// index.js

// 创建并注入可拖动的悬浮按钮
function injectDraggableButton() {
    // 防止重复注入
    if (document.getElementById('tod_floating_btn')) return;

    // 1. 创建一个脱离常规布局的悬浮按钮 (position: fixed)
    const btnHtml = `
        <div id="tod_floating_btn" title="真心话大冒险 (TOD)" 
             style="position: fixed; right: 30px; bottom: 100px; width: 45px; height: 45px; 
                    border-radius: 50%; background-color: var(--SmartThemeBlurTintColor, rgba(0,0,0,0.5)); 
                    color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; 
                    align-items: center; justify-content: center; font-size: 1.8em; 
                    cursor: grab; z-index: 9999; user-select: none; transition: background-color 0.2s;">
            🎲
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', btnHtml);

    const floatBtn = document.getElementById('tod_floating_btn');

    // 2. 拖拽逻辑实现
    let isDragging = false;
    let startX, startY, initialX, initialY;

    // 鼠标按下：准备拖动
    floatBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        floatBtn.style.cursor = 'grabbing';
        startX = e.clientX;
        startY = e.clientY;
        initialX = floatBtn.offsetLeft;
        initialY = floatBtn.offsetTop;
    });

    // 鼠标移动：更新位置
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        // 覆盖原本的 right 和 bottom 属性，改用 left 和 top 控制位置
        floatBtn.style.left = `${initialX + dx}px`;
        floatBtn.style.top = `${initialY + dy}px`;
        floatBtn.style.right = 'auto';
        floatBtn.style.bottom = 'auto';
    });

    // 鼠标松开：结束拖动
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            floatBtn.style.cursor = 'grab';
        }
    });

    // 3. 点击逻辑 (做了判断：如果是拖拽松开，就不触发点击)
    floatBtn.addEventListener('click', (e) => {
        // 计算鼠标落点和起点的距离，大于 5 像素说明是拖拽，不弹出提示
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) return;
        
        alert("完美的点按！接下来我们会把这句弹窗替换成游戏的菜单页面。");
    });
}

// 插件启动入口
jQuery(() => {
    // 延迟 1 秒注入，确保页面加载完毕
    setTimeout(injectDraggableButton, 1000);
});
