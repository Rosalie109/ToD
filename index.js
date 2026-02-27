/*
 * 真心话大冒险 (TOD) - 严格交互与内置题库版
 * 包含了独立状态机、系统指令自动化发送、以及弹窗内的题库编辑功能。
 * [UI更新：全蓝色系主题 + 纯白字体高亮版]
 */
(function() {
    'use strict';

    // 默认题库
    const defaultTruths = [
        "你最害怕失去什么？", "你做过最尴尬的事情是什么？", "你心里最大的秘密是什么？", "如果能回到过去，你想改变哪件事？",
        "你最讨厌自己性格中的哪一点？", "你曾经对好朋友撒过最大的谎是什么？", "如果你明天就会消失，你今天想对谁说什么？",
        "你觉得我们俩之间最像的地方是什么？", "你有没有暗恋过不该暗恋的人？", "你收到的最让你感动的礼物是什么？"
    ];

    const defaultDares = [
        "用一种小动物的语气（比如喵喵、汪汪）跟我说接下来的一句话。", "做十个俯卧撑（或深蹲），并描述你的动作和喘息声。",
        "给我讲一个超级冷的冷笑话。", "用三句话夸奖我，不能重复形容词。", "假装你现在喝醉了，跟我说话。",
        "用生气的语气向我表白。", "描述一下你现在正在做的鬼脸。", "假装我们刚认识，向我搭讪。",
        "用最温柔的语气说一句最恶毒的话。", "接下来的两轮对话中，你必须在每句话结尾加一个爱心表情。"
    ];

    const TODApp = {
        drag: { active: false, offX: 0, offY: 0 },
        settings: {
            truthPool: [],
            darePool: []
        },
        
        init() {
            this.loadSettings();
            this.createUI();
            this.bindEvents();
            console.log('🎲 TOD插件：严格交互版已加载！');
        },

        // --- 数据存储逻辑 ---
        loadSettings() {
            const saved = localStorage.getItem('tod_plugin_data');
            if (saved) {
                this.settings = JSON.parse(saved);
            } else {
                this.settings.truthPool = [...defaultTruths];
                this.settings.darePool = [...defaultDares];
                this.saveSettings();
            }
        },

        saveSettings() {
            localStorage.setItem('tod_plugin_data', JSON.stringify(this.settings));
        },

        // --- 核心：自动化系统指令发送 ---
        sendSystemCommand(text, forceTriggerAi = false) {
            const textarea = document.getElementById('send_textarea');
            const sendBtn = document.getElementById('send_but');
            
            if (!textarea || !sendBtn) {
                alert("未找到聊天输入框，请确保在聊天页面！");
                return;
            }

            // 1. 模拟发送 /sys 系统消息
            textarea.value = `/sys ${text}`;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            sendBtn.click(); // 点击发送按钮

            // 2. 如果是 AI 回合，延迟 0.8 秒后发送 /trigger 强制 AI 回复
            if (forceTriggerAi) {
                setTimeout(() => {
                    textarea.value = `/trigger`;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    sendBtn.click();
                }, 800);
            }
        },

        // 从题库随机抽取
        getRandomItem(type) {
            const pool = type === 'truth' ? this.settings.truthPool : this.settings.darePool;
            if (pool.length === 0) return "题库空了！请点击【编辑题库】添加。";
            const randomIndex = Math.floor(Math.random() * pool.length);
            return pool[randomIndex];
        },

        // 执行游戏指令
        executeGame(actor, type) {
            const typeName = type === 'truth' ? '真心话' : '大冒险';
            const task = this.getRandomItem(type);
            
            if (actor === 'user') {
                // 玩家回合：只发系统旁白，等玩家自己打字
                const msg = `🎮 **【TOD系统】** 玩家抽取了**${typeName}**！\n📜 **任务内容**：【${task}】\n*(请玩家在下方输入框完成任务)*`;
                this.sendSystemCommand(msg, false);
            } else {
                // AI 回合：发系统旁白 + 强制触发 AI
                const msg = `🎮 **【TOD系统】** 轮到 {{char}} 抽签了！抽取了**${typeName}**！\n📜 **任务内容**：【${task}】\n*(系统强制指令：请 {{char}} 在接下来的回复中立刻执行此任务！)*`;
                this.sendSystemCommand(msg, true);
            }
        },

        // --- UI 渲染：动态菜单 ---
        renderMenuView(viewName) {
            const container = document.getElementById('tod_menu_content');
            if (!container) return;

            if (viewName === 'main') {
                // 修改点：灰色说明文字变白；所有按钮替换为不同深浅的蓝色
                container.innerHTML = `
                    <h3 style="margin-top: 0; margin-bottom: 20px;">🎲 真心话大冒险</h3>
                    <div style="font-size: 14px; color: white; margin-bottom: 15px;">当前由系统严格主持，请选择抽签方：</div>
                    
                    <button class="tod-btn" data-action="user_truth" style="width: 100%; padding: 12px; margin-bottom: 10px; background: #2980b9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">🙋‍♂️ 玩家抽【真心话】</button>
                    <button class="tod-btn" data-action="user_dare" style="width: 100%; padding: 12px; margin-bottom: 15px; background: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">🤾‍♂️ 玩家抽【大冒险】</button>
                    
                    <hr style="border-color: #555; margin-bottom: 15px;">
                    
                    <button class="tod-btn" data-action="ai_truth" style="width: 100%; padding: 12px; margin-bottom: 10px; background: #5dade2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">🤖 AI 抽【真心话】</button>
                    <button class="tod-btn" data-action="ai_dare" style="width: 100%; padding: 12px; margin-bottom: 20px; background: #85c1e9; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">🏃 AI 抽【大冒险】</button>
                    
                    <button class="tod-btn" data-action="goto_settings" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #21618c; color: white; border: none; border-radius: 6px; cursor: pointer;">⚙️ 编辑题库</button>
                    <button id="tod_cancel_btn" style="width: 100%; padding: 10px; background: transparent; color: white; border: 1px solid white; border-radius: 6px; cursor: pointer;">关闭</button>
                `;
            } else if (viewName === 'settings') {
                // 修改点：提示文字变白；保存/取消按钮适配蓝白风格
                container.innerHTML = `
                    <h3 style="margin-top: 0; margin-bottom: 15px;">⚙️ 题库编辑</h3>
                    <div style="text-align: left; font-size: 12px; color: white; margin-bottom: 5px;">真心话题库 (一行一题)：</div>
                    <textarea id="tod_edit_truth" style="width: 100%; height: 80px; margin-bottom: 10px; background: #222; color: #fff; border: 1px solid #3498db; padding: 5px; box-sizing: border-box; resize: none;"></textarea>
                    
                    <div style="text-align: left; font-size: 12px; color: white; margin-bottom: 5px;">大冒险题库 (一行一题)：</div>
                    <textarea id="tod_edit_dare" style="width: 100%; height: 80px; margin-bottom: 15px; background: #222; color: #fff; border: 1px solid #3498db; padding: 5px; box-sizing: border-box; resize: none;"></textarea>
                    
                    <button class="tod-btn" data-action="save_settings" style="width: 100%; padding: 10px; margin-bottom: 10px; background: #2980b9; color: white; border: none; border-radius: 6px; cursor: pointer;">💾 保存并返回</button>
                    <button class="tod-btn" data-action="goto_main" style="width: 100%; padding: 10px; background: transparent; color: white; border: 1px solid white; border-radius: 6px; cursor: pointer;">取消</button>
                `;
                
                // 填充当前题库
                document.getElementById('tod_edit_truth').value = this.settings.truthPool.join('\n');
                document.getElementById('tod_edit_dare').value = this.settings.darePool.join('\n');
            }

            // 重新绑定事件
            this.bindMenuEvents();
        },

        bindMenuEvents() {
            const overlay = document.getElementById('tod_menu_overlay');
            if (!overlay) return;

            const btns = overlay.querySelectorAll('.tod-btn');
            btns.forEach(btn => {
                btn.onclick = () => {
                    const action = btn.getAttribute('data-action');
                    
                    // 游戏执行动作
                    if (['user_truth', 'user_dare', 'ai_truth', 'ai_dare'].includes(action)) {
                        const parts = action.split('_');
                        this.executeGame(parts[0], parts[1]);
                        overlay.remove();
                    }
                    
                    // 视图切换动作
                    if (action === 'goto_settings') this.renderMenuView('settings');
                    if (action === 'goto_main') this.renderMenuView('main');
                    
                    // 保存题库
                    if (action === 'save_settings') {
                        const tText = document.getElementById('tod_edit_truth').value;
                        const dText = document.getElementById('tod_edit_dare').value;
                        this.settings.truthPool = tText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                        this.settings.darePool = dText.split('\n').map(s => s.trim()).filter(s => s.length > 0);
                        this.saveSettings();
                        this.renderMenuView('main');
                    }
                };
            });

            const cancelBtn = overlay.querySelector('#tod_cancel_btn');
            if (cancelBtn) cancelBtn.onclick = () => overlay.remove();
        },

        showMenu() {
            if (document.getElementById('tod_menu_overlay')) return;

            const overlay = document.createElement('div');
            overlay.id = 'tod_menu_overlay';
            overlay.style.cssText = `
                position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
                width: 100vw !important; height: 100vh !important; z-index: 2147483647 !important; 
                display: flex !important; justify-content: center !important; align-items: center !important;
                background: rgba(206, 235, 252, 0.3) !important; margin: 0 !important; padding: 20px !important; box-sizing: border-box !important;
                backdrop-filter: blur(3px) !important;
            `;

            const contentBox = document.createElement('div');
            contentBox.id = 'tod_menu_content';
            
            // 修改点：去除了原先受制于主题的变量背景，强制替换为饱和度较高的深蓝色 (#155592)
            contentBox.style.cssText = `
                background: rgba(21, 85, 146, 0.35) !important; border: 2px solid #26AAFC; border-radius: 12px; 
                padding: 25px; width: 320px; color: white; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
            `;
            
            overlay.appendChild(contentBox);
            document.body.appendChild(overlay);

            // 点击背景关闭
            overlay.onclick = (e) => {
                if (e.target === overlay) overlay.remove();
            };

            // 初始渲染主菜单
            this.renderMenuView('main');
        },

        // --- 悬浮按钮创建与拖拽 ---
        createUI() {
            if (document.getElementById('tod_floating_btn')) return;

            const btn = document.createElement('div');
            btn.id = 'tod_floating_btn';
            btn.title = '真心话大冒险 (TOD)';
            btn.innerText = '🧸';
            
            btn.style.cssText = `
                position: fixed !important; left: 20px !important; top: 200px !important; width: 50px !important; height: 50px !important;
                background-color: rgba(243, 213, 180, 0.6) !important; color: white !important; border-radius: 50% !important;
                border: 2px solid #EDA56A !important; box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important; display: flex !important;
                align-items: center !important; justify-content: center !important; font-size: 28px !important; cursor: grab !important;
                z-index: 2147483646 !important; user-select: none !important; backdrop-filter: blur(4px) !important; transition: transform 0.1s;
                backdrop-filter: blur(8px) saturate(150%) !important;
            `;
            
            document.body.appendChild(btn);
            this.btnEl = btn;
        },

        bindEvents() {
            const btn = this.btnEl;
            if (!btn) return;

            let startClientX = 0, startClientY = 0;

            const handleDragStart = (e) => {
                e.preventDefault();
                this.drag.active = true;
                btn.style.cursor = 'grabbing';
                btn.style.transform = 'scale(0.95)';
                
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                startClientX = clientX; startClientY = clientY;
                
                this.drag.offX = clientX - btn.offsetLeft;
                this.drag.offY = clientY - btn.offsetTop;

                const move = (ev) => {
                    if (!this.drag.active) return;
                    ev.preventDefault();
                    const cx = ev.clientX || (ev.touches && ev.touches[0].clientX);
                    const cy = ev.clientY || (ev.touches && ev.touches[0].clientY);
                    
                    btn.style.left = (cx - this.drag.offX) + 'px';
                    btn.style.top = (cy - this.drag.offY) + 'px';
                    btn.style.right = 'auto'; btn.style.bottom = 'auto';
                };

                const up = (ev) => {
                    this.drag.active = false;
                    btn.style.cursor = 'grab';
                    btn.style.transform = 'scale(1)';
                    
                    const endClientX = ev.clientX || (ev.changedTouches && ev.changedTouches[0].clientX);
                    const endClientY = ev.clientY || (ev.changedTouches && ev.changedTouches[0].clientY);
                    
                    if (Math.abs(endClientX - startClientX) < 5 && Math.abs(endClientY - startClientY) < 5) {
                        this.showMenu(); // 距离极小判定为点击
                    }

                    document.removeEventListener('mousemove', move);
                    document.removeEventListener('touchmove', move);
                    document.removeEventListener('mouseup', up);
                    document.removeEventListener('touchend', up);
                };

                document.addEventListener('mousemove', move);
                document.addEventListener('touchmove', move, { passive: false });
                document.addEventListener('mouseup', up);
                document.addEventListener('touchend', up);
            };

            btn.addEventListener('mousedown', handleDragStart);
            btn.addEventListener('touchstart', handleDragStart);
        }
    };

    const checkTimer = setInterval(() => {
        if (document.body) {
            clearInterval(checkTimer);
            TODApp.init();
        }
    }, 500);

})();
