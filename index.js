console.log("TOD插件：代码开始运行...");

function injectDraggableButton() {
    // 如果已经有了，就不重复添加
    if (document.getElementById('tod_floating_btn')) return;
    console.log("TOD插件：正在往页面注入按钮...");

    // 1. 创建原生的 div 元素
    const floatBtn = document.createElement('div');
    floatBtn.id = 'tod_floating_btn';
    floatBtn.title = '真心话大冒险 (TOD)';
    floatBtn.innerText = '🎲';
    
    // 2. 暴力样式：固定在右下角，醒目的红色，最高层级
    floatBtn.style.cssText = `
        position: fixed; 
        right: 50px; 
        bottom: 50px; 
        width: 50px; 
        height: 50px; 
        background-color: #ff4757; 
        color: white; 
        border-radius: 50%; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.5); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-size: 28px; 
        cursor: grab; 
        z-index: 2147483647; 
        user-select: none;
    `;
    
    // 把按钮塞进整个页面的最外层
    document.body.appendChild(floatBtn);

    // 3. 拖拽逻辑实现
    let isDragging = false;
    let startX, startY, initialX, initialY;

    floatBtn.addEventListener('mousedown', (e) => {
        isDragging = true;
        floatBtn.style.cursor = 'grabbing';
        startX = e.clientX;
        startY = e.clientY;
        initialX = floatBtn.offsetLeft;
        initialY = floatBtn.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        
        floatBtn.style.left = `${initialX + dx}px`;
        floatBtn.style.top = `${initialY + dy}px`;
        floatBtn.style.right = 'auto';
        floatBtn.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            floatBtn.style.cursor = 'grab';
        }
    });

    // 4. 点击逻辑
    floatBtn.addEventListener('click', (e) => {
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) return;
        alert("完美的点按！悬浮球测试成功！");
    });
}

// 轮询检查页面是否加载完毕，确保 100% 注入成功
const initTimer = setInterval(() => {
    if (document.body) {
        injectDraggableButton();
        clearInterval(initTimer);
    }
}, 1000);
