import { SlashCommandParser } from "/scripts/slash-commands/SlashCommandParser.js";

// 注入聊天区旁边的骰子按钮
function injectDiceButton() {
    // 如果已经有了，就不重复添加
    if (document.getElementById('tod_dice_btn')) return;

    // 寻找 ST 原生的“发送按钮” (ID通常为 send_but)
    const sendBtn = document.getElementById('send_but');
    
    if (sendBtn) {
        // 创建一个包含骰子的按钮元素
        const btnHtml = `<div id="tod_dice_btn" class="mes_button" title="真心话大冒险 (TOD)" style="cursor: pointer; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 1.5em;">🎲</div>`;
        
        // 将骰子按钮插在发送按钮的前面
        sendBtn.insertAdjacentHTML('beforebegin', btnHtml);

        // 给按钮绑定点击测试事件
        document.getElementById('tod_dice_btn').addEventListener('click', () => {
            alert("太棒了！骰子按钮成功显示，UI 注入工作正常！");
        });
    } else {
        console.error("TOD插件：未找到 ST 发送按钮，界面可能已更改。");
    }
}

// 插件启动入口
jQuery(() => {
    // 1. 延迟 2 秒执行，确保 ST 的原生聊天界面已经完全加载
    setTimeout(injectDiceButton, 2000);

    // 2. 注册 /tod 指令
    SlashCommandParser.addCommandObject(SlashCommandParser.getCommandObject(
        'tod',
        () => { 
            alert("指令 /tod 触发成功！"); 
            return ''; 
        },
        [],
        '启动或停止真心话大冒险游戏'
    ));
});
