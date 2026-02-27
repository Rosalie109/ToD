import { extension_settings } from "/scripts/extensions.js";
import { callPopup } from "/scripts/popup.js";
import { SlashCommandParser } from "/scripts/slash-commands/SlashCommandParser.js";

// 扩展内部名称
const extensionName = "TruthOrDare";

// 默认题库 (50个真心话，50个大冒险)
const defaultTruths = [
    "你最害怕失去什么？", "你做过最尴尬的事情是什么？", "你心里最大的秘密是什么？", "如果能回到过去，你想改变哪件事？", "你最讨厌自己性格中的哪一点？",
    "你曾经对好朋友撒过最大的谎是什么？", "如果你明天就会消失，你今天想对谁说什么？", "你做过的最奇怪的梦是什么？", "你觉得我们俩之间最像的地方是什么？", "你有没有暗恋过不该暗恋的人？",
    "你收到的最让你感动的礼物是什么？", "如果可以拥有一个超能力，你想要什么？", "你最想抹去的记忆是什么？", "你觉得这个世界是公平的吗？", "你有没有做过违法乱纪的小事？",
    "你最近一次哭是因为什么？", "你觉得我身上最吸引人的地方是什么？", "如果必须放弃视觉或听觉，你选哪个？", "你相信一见钟情吗？", "你最疯狂的幻想是什么？",
    "你曾做过最自私的决定是什么？", "你觉得人死后会去哪里？", "你最讨厌什么样的人？", "你有没有偷看过别人的手机或日记？", "你最感到自卑的地方是什么？",
    "如果你能变成另外一个人一天，你会变成谁？", "你对未来的自己有什么期望？", "你做过最勇敢的事情是什么？", "你觉得爱和被爱哪个更重要？", "你有没有曾经想过离家出走？",
    "你收到的最糟糕的建议是什么？", "你觉得最完美的约会是什么样的？", "你有没有因为嫉妒做过蠢事？", "你有没有为了逃避责任而装病？", "你最不能原谅的背叛是什么？",
    "你觉得金钱能买到快乐吗？", "你曾经最沉迷的一样东西是什么？", "你有没有对某个权威人士爆过粗口？", "你做过最幼稚的事情是什么？", "如果你必须吃一种食物吃一辈子，你选什么？",
    "你觉得人类最大的缺点是什么？", "你有没有曾经怀疑过自己存在的意义？", "你最希望别人怎么评价你？", "你觉得虚拟世界比现实世界好吗？", "你有没有曾经假装认识一个其实不认识的人？",
    "你做过最浪漫的事情是什么？", "你有没有曾经因为一首歌而崩溃大哭？", "你最想对十年前的自己说什么？", "如果现在必须给前任打个电话，你会说什么？", "你觉得现在的你，是你曾经想成为的大人吗？"
];

const defaultDares = [
    "用一种小动物的语气（比如喵喵、汪汪）跟我说接下来的一句话。", "做十个俯卧撑（或深蹲），并描述你的动作和喘息声。", "给我讲一个超级冷的冷笑话。", "模仿你最喜欢的一个名人的语气说话。", "用三句话夸奖我，不能重复形容词。",
    "假装你现在喝醉了，跟我说话。", "用生气的语气向我表白。", "描述一下你现在正在做的鬼脸。", "接下来的两轮对话中，你必须在每句话结尾加一个爱心表情。", "假装我们刚认识，向我搭讪。",
    "背诵一首短诗，或者自己现场编一首打油诗。", "用极其夸张的语气描述你今天的一顿饭。", "假装你的身体某个部位突然变异了，向我求救。", "用最温柔的语气说一句最恶毒的话。", "向我推销你身边的一件无用的物品。",
    "假装你是一个正在执行秘密任务的特工，向我汇报情况。", "用唱歌的语气（描述出旋律感）回答我下一个问题。", "接下来的一句话，所有字数必须是偶数。", "假装我们正在吵架，找个荒谬的理由指责我。", "模仿机器人的语气和我说话，带上系统提示音。",
    "用一种你觉得最性感的语气叫我的名字。", "假装你现在突然失忆了，问我是谁。", "描述一段你正在跳的滑稽舞蹈。", "用文言文或者极其书面化的语言跟我聊家常。", "假装你在一个很恐怖的地方，向我描述周围的环境。",
    "向我提出一个极其刁钻的脑筋急转弯。", "用傲娇的语气承认你其实很在乎我。", "假装我们正在经历世界末日，对我说遗言。", "用播音员的腔调播报一条关于你自己的假新闻。", "接下来的三句话，必须以疑问句结束。",
    "假装你中了一千万大奖，描述你现在的状态。", "用方言（或描述一种奇怪的口音）跟我抱怨天气。", "假装你在被什么东西追赶，一边跑一边跟我说话。", "用极其卑微的语气向我借钱。", "假装你是我的长辈，对我进行一番说教。",
    "给我起一个难听但搞笑的绰号，并在这局游戏里一直用它称呼我。", "描述你现在正在做一个非常高难度的瑜伽动作。", "用像念咒语一样的语气说出你的愿望。", "假装你是一个人工智能，现在系统发生了故障。", "假装你在厨房把锅炸了，向我解释原因。",
    "用极其自恋的语气夸奖自己一分钟（两段话）。", "假装我们正在参加相亲节目，向我展示你的才艺。", "用神秘的语气告诉我一个其实根本不重要的秘密。", "假装你是外星人第一次来到地球，评价一下我。", "向我描述一个你幻想出来的极其恶心的食物，并假装吃掉它。",
    "用极其悲伤的语气讲述一个本来很搞笑的故事。", "假装你在一个非常吵闹的酒吧里，大声地跟我说话（用大写或感叹号）。", "接下来的两句话，每个字都要用拼音（或者假装结巴）打出来。", "假装你是一只会说话的猫，对我提出非分的要求。", "用极其严肃的语气，跟我讨论一个像“屎壳郎为什么推粪球”这样的话题。"
];

// 初始化设置
function initSettings() {
    if (!extension_settings[extensionName]) {
        extension_settings[extensionName] = {
            truthPool: defaultTruths.join('\n'),
            darePool: defaultDares.join('\n')
        };
    }
}

// 获取随机题目
function getRandomItem(type) {
    const poolString = extension_settings[extensionName][type === 'truth' ? 'truthPool' : 'darePool'];
    const pool = poolString.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    if (pool.length === 0) return "题库空啦！请去扩展设置里添加！";
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
}

// 执行抽签动作
function executeRoll(actor, type) {
    const isAi = actor === 'ai';
    const typeName = type === 'truth' ? '真心话' : '大冒险';
    const task = getRandomItem(type);

    if (!isAi) {
        // 玩家回合：将结果填入输入框，让玩家自己完成动作
        const chatInput = document.getElementById('send_textarea');
        if (chatInput) {
            const systemNote = `*(🎲 系统判定：我抽取了${typeName}，题目是：【${task}】)*\n`;
            chatInput.value = systemNote;
            chatInput.dispatchEvent(new Event('input', { bubbles: true })); // 触发 ST 的输入框高度自适应
            chatInput.focus();
            toastr.success(`已抽取${typeName}，请在输入框完成你的回答！`, '轮到你了');
        }
    } else {
        // AI 回合：发送系统指令给 AI 并触发生成
        // 使用 Slash Command 发送系统提示词，保证上下文连贯
        const sysMessage = `🎲 **[游戏系统]** 轮到 {{char}} 抽签了！\n{{char}} 抽取了${typeName}，题目是：**【${task}】**\n*(系统指令：请 {{char}} 在接下来的回复中立刻执行此${typeName}任务，并做出符合人设的神态与反应)*`;
        
        // 1. 发送系统消息入库
        SlashCommandParser.executeCommand('/sys', sysMessage).then(() => {
            // 2. 自动触发 AI 回复
            toastr.info(`AI 已抽取任务：${task}。正在生成回复...`, '轮到 AI 了');
            SlashCommandParser.executeCommand('/trigger', '');
        });
    }
}

// 弹出交互菜单
async function showTodMenu() {
    // 使用 ST 原生的 SweetAlert2 弹窗
    const { value: choice } = await callPopup(`<h3>🎲 真心话大冒险</h3><p>请选择谁来抽签？</p>`, 'text', '', {
        showCancelButton: true,
        cancelButtonText: '取消',
        customClass: { popup: 'st-popup' },
        html: `
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
                <button id="btn_me_truth" class="menu_button">🙋‍♂️ 我选【真心话】</button>
                <button id="btn_me_dare" class="menu_button">🤾‍♂️ 我选【大冒险】</button>
                <hr style="border: 0.5px solid #ccc; width: 100%;">
                <button id="btn_ai_truth" class="menu_button">🤖 让对方抽【真心话】</button>
                <button id="btn_ai_dare" class="menu_button">🏃 让对方抽【大冒险】</button>
            </div>
        `,
        didOpen: () => {
            // 绑定弹窗内按钮的点击事件
            document.getElementById('btn_me_truth').addEventListener('click', () => { Swal.clickConfirm(); executeRoll('user', 'truth'); });
            document.getElementById('btn_me_dare').addEventListener('click', () => { Swal.clickConfirm(); executeRoll('user', 'dare'); });
            document.getElementById('btn_ai_truth').addEventListener('click', () => { Swal.clickConfirm(); executeRoll('ai', 'truth'); });
            document.getElementById('btn_ai_dare').addEventListener('click', () => { Swal.clickConfirm(); executeRoll('ai', 'dare'); });
        }
    });
}

// 注入聊天区旁边的骰子按钮
function injectChatButton() {
    if (document.getElementById('tod_quick_btn')) return;
    
    // 找到 ST 发送按钮的容器
    const sendButtonContainer = document.getElementById('send_but_sheld');
    if (sendButtonContainer) {
        const btnHtml = `<div id="tod_quick_btn" class="mes_button" title="真心话大冒险 (Truth or Dare)" style="cursor: pointer;"><i class="fa-solid fa-dice"></i></div>`;
        sendButtonContainer.insertAdjacentHTML('afterbegin', btnHtml);
        
        document.getElementById('tod_quick_btn').addEventListener('click', showTodMenu);
    }
}

// 插件启动入口
jQuery(async () => {
    initSettings();

    // 1. 加载侧边栏 UI
    const html = await $.get(`/extensions/TruthOrDare/index.html`);
    $('#extensions_settings').append(html);

    // 2. 绑定侧边栏设置的读取和保存
    $('#tod_truth_pool').val(extension_settings[extensionName].truthPool);
    $('#tod_dare_pool').val(extension_settings[extensionName].darePool);

    $('#tod_save_btn').on('click', () => {
        extension_settings[extensionName].truthPool = $('#tod_truth_pool').val();
        extension_settings[extensionName].darePool = $('#tod_dare_pool').val();
        // ST 原生保存设置函数
        if (typeof saveSettingsDebounced === 'function') saveSettingsDebounced();
        toastr.success('题库保存成功！', 'TOD');
    });

    $('#tod_reset_btn').on('click', () => {
        $('#tod_truth_pool').val(defaultTruths.join('\n'));
        $('#tod_dare_pool').val(defaultDares.join('\n'));
        $('#tod_save_btn').click();
    });

    // 3. 注入聊天输入框旁边的按钮
    injectChatButton();
    // 监听 ST 界面重绘事件，防止按钮消失
    const observer = new MutationObserver((mutations) => {
        if (!document.getElementById('tod_quick_btn')) {
            injectChatButton();
        }
    });
    observer.observe(document.getElementById('form_sheld'), { childList: true, subtree: true });
});
