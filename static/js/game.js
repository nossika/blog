(()=>{

    let undercover = {

    };
    let avalon = () => {
        let _ctn, _board, _data;
        let _info = {
            map: {
                ML: {name: '梅林', camp: 'blue'},
                PX: {name: '派希维尔', camp: 'blue'},
                ZC: {name: '忠臣', camp: 'blue'},
                MG: {name: '莫安娜', camp: 'red'},
                CK: {name: '刺客', camp: 'red'},
                MD: {name: '莫德雷德', camp: 'red'},
                AB: {name: '奥伯伦', camp: 'red'},
                ZY: {name: '爪牙', camp: 'red'}
            },
            '5': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK'],
                mission: [2, 3, 2, 3, 3]
            },
            '6': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC'],
                mission: [2, 3, 4, 3, 4]
            },
            '7': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'AB'],
                mission: [2, 3, 3, 4, 4]
            },
            '8': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZY'],
                mission: [3, 4, 4, 5, 5]
            },
            '9': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZC', 'MD'],
                mission: [3, 4, 4, 5, 5]
            },
            '10': {
                role: ['ML', 'PX', 'ZC', 'MG', 'CK', 'ZC', 'ZC', 'ZC', 'MD', 'AB'],
                mission: [3, 4, 4, 5, 5]
            },
        };
        let html = {
            init: `
                    <div class="avalon-board"></div>
                    <div class="avalon-btn">
                        <button data-action="rule" class="btn">查看规则</button>
                        <button data-action="reset" class="btn">重新开始</button>
                    </div>
                    <div class="rule hide">
                        <h2>角 色 能 力</h2>
                        <h3>好人（蓝方）角色及能力：</h3>
                        <p>梅林---看到所有坏人（不含莫德雷德）</p>
                        <p>派西维尔---看到两个梅林（梅林和莫甘娜）</p>
                        <p>亚瑟的忠臣---无特殊能力好人</p>
                
                        <h3>坏人（红方）角色及能力：</h3>
                        <p>莫德雷德---梅林看不到他</p>
                        <p>莫甘娜---假扮梅林，迷惑派西维尔</p>
                        <p>奥伯伦---看不到其他坏人，其他坏人也看不到他</p>
                        <p>刺客---在三次任务成功后，可以刺杀梅林</p>
                        <p>莫德雷德的爪牙---无特殊能力坏人</p>
                
                        <h2>游 戏 流 程</h2>
                
                        <p>1、随机选择一个玩家担任队长</p>
                
                        <p>2、队长根据本轮任务需要的人数，选定任务人选。</p>
                        <p>3、从队长的右手边开始逆时针发言，队长可以选择第一个发言，或者最后一个发言，发言仅一轮。</p>
                        <p>4、所有人发言完毕后进入投票环节，所有玩家同时亮出答案（同意或反对本次任务人选），若同意人数超过玩家总数的一半，则任务执行；等于或者小于一半时任务延迟。</p>
                        <h3>任务执行：</h3>
                        <p>任务队员从任务成功和失败中选择一个秘密给出，只要出现一张（有*号的轮需要两张）失败票任务即失败，反之任务成功。队长换左手边的人担任，进入下一轮任务，继续流程2-4。</p>
                        <h3>任务延迟：</h3>
                        <p>任务不视为执行，队长换左手边的人担任，依然是本轮任务，继续流程2-4。但同一轮任务最多只能延迟4次，出现第5次延迟则本轮任务直接失败，进入下一轮任务，继续流程2-4。</p>
                
                        <h2>胜 负 判 定</h2>
                        <p>游戏过程中，出现三次任务失败时坏人直接胜利。</p>
                        <p>出现三次任务成功时所有玩家禁言，刺客独自选择一个在场玩家刺杀，如被刺杀的是梅林，则坏人胜利，否则好人胜利。</p>
                
                    </div>

                `,

            begin: `
                    <div class="game-begin">
                        <h1>阿瓦隆</h1>
                        <p>这是一个5-10人的桌面游戏，分为红、蓝两方阵营，进行共计5轮的任务。红方需要辨认敌友、促进任务的成功以及帮助隐藏梅林。蓝方需要伪装成好人，从中作梗使任务失败，或者找出红方中的梅林刺杀。详细规则可随时在游戏过程中点击“查看规则”来打开/关闭。</p>
                        <label>游戏人数：<span class="player"></span>人</label><input class="input" type="range" min="5" max="10" value="${player}"/>
                        <button data-action="next" class="btn">分配角色</button>
                        <p>角色： <span class="role"></span></p>
                        <p>任务配置： <span class="mission"></span></p>
                    </div>
                `,
            begin_role: {
                '5':'<span class="blue-camp">梅林、派希维尔、忠臣</span> VS <span class="red-camp">莫甘娜 刺客</span>',
                '6':'<span class="blue-camp">梅林、派希维尔、忠臣X2</span> VS <span class="red-camp">莫甘娜 刺客</span>',
                '7':'<span class="blue-camp">梅林、派希维尔、忠臣x2</span> VS <span class="red-camp">莫甘娜 奥伯伦 刺客</span>',
                '8':'<span class="blue-camp">梅林、派希维尔、忠臣x3</span> VS <span class="red-camp">莫甘娜 爪牙 刺客</span>',
                '9':'<span class="blue-camp">梅林、派希维尔、忠臣x4</span> VS <span class="red-camp">莫甘娜 莫德雷德 刺客</span>',
                '10':'<span class="blue-camp">梅林、派希维尔、忠臣x4</span> VS <span class="red-camp">莫甘娜 莫德雷德 奥伯伦 刺客</span>'
            },
            assign: `
                    <div class="game-assign">
                        <h1>分配身份</h1>
                        <p>请点击你的号码来查看对应身份</p>
                        <ul class="list"></ul>
                        <p>所有人都确认身份完毕后，点击“开始任务”进行下一步。</p>
                        <button data-action="next" class="btn">开始任务</button>
                    </div>
                `,
            assign_li_back: (index) => {
                return `
                    <p>${index + 1}</p>
                `
            },
            assign_li_font: (index) => {
                let role = _data.role[index];
                return `
                    <img src="${role}.jpg"/>
                    <p class="name ${_info.map[role].camp}-camp">${_info.map[role].name}</p>
                    <p class="info"></p>
                `
            }

        };
        let fn = {
            init: (container, config = {}) => {
                _ctn = container;
                _data = {
                    mission: null,
                    role: null,
                    round: []
                };
                _ctn.innerHTML = html.init;
                _board = _ctn.querySelector('.avalon-board');
                let rule = _ctn.querySelector('.rule');
                _ctn.querySelector('[data-action="rule"]').addEventListener('click', () => {
                    rule.classList[rule.classList.contains('hide') ? 'remove' : 'add']('hide');
                });
                _ctn.querySelector('[data-action="reset"]').addEventListener('click', () => {
                    fn.init(_ctn,{player: _data.role.length});
                });
                fn.to_begin(config.player);
            },
            to_begin: (player = 5) => {
                _board.innerHTML = html.begin;
                _board.querySelector('.input').value = player;
                _board.querySelector('.input').addEventListener('change', (e) => {
                    set_player(e.target.value);
                });
                let set_player = (player) => {
                    _data.mission = _info[player].mission.slice();
                    _data.role = Util.shuffle_arr(_info[player].role);
                    _board.querySelector('.role').innerHTML = html.begin_role[player];
                    _board.querySelector('.player').innerText = player;
                    let arr = [];
                    _data.mission.forEach((num, index) => {
                        arr.push(' ' + num + ((player >= 7 && index === 3)?'*':' '));
                    });
                    _board.querySelector('.mission').innerHTML = arr.join('-');
                };
                set_player(player);
                _board.querySelector('[data-action="next"]').addEventListener('click', () => {
                    fn.to_assign();
                });
            },
            to_assign: () => {
                _board.innerHTML = html.assign;
                let list = _board.querySelector('.list');
                _data.role.forEach((role, index) => {
                    list.innerHTML += `<li data-index="${index}">${html.assign_li_back(index)}</li>`;
                });
                let role_info = (role) => {
                    let info = '';
                    let check_index = (check_list) => {
                        let arr = [];
                        _data.role.forEach((role, index) => {
                            if(check_list.includes(role)){
                                arr.push(index + 1);
                            }
                        });
                        return arr.join('、');
                    };
                    switch (role) {
                        case 'ML':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'AB', 'ZY'])}</span>号是敌人`;
                            break;
                        case 'PX':
                            info = `你知道<span class="blue-camp">${check_index(['ML', 'MG'])}</span>号是梅林`;
                            break;
                        case 'ZC':
                            info = `你对其他人的身份一无所知`;
                            break;
                        case 'MG':
                            info = `你知道<span class="red-camp">${check_index(['CK', 'ZY', 'MD'])}</span>号是你的同伙`;
                            break;
                        case 'CK':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'ZY', 'MD'])}</span>号是你的同伙`;
                            break;
                        case 'AB':
                            info = `你对其他人的身份一无所知`;
                            break;
                        case 'ZY':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'MD'])}</span>号是你的同伙`;
                            break;
                        case 'MD':
                            info = `你知道<span class="red-camp">${check_index(['MG', 'CK', 'ZY'])}</span>号是你的同伙`;
                            break;
                    }
                    return info;
                };
                list.addEventListener('click', (e) => {
                    let li = e.target;
                    while (li !== list && !li.getAttribute('data-index')){
                        li = li.parentNode;
                    }
                    let index = li.getAttribute('data-index');
                    if(index === null) return;
                    index = +index;
                    if(li.querySelector('.info')){
                        li.innerHTML = html.assign_li_back(index);
                    }else {
                        li.innerHTML = html.assign_li_font(index);
                        li.querySelector('.info').innerHTML = role_info(_data.role[index]);
                    }
                });
                _board.querySelector('[data-action="next"]').addEventListener('click', () => {
                    fn.to_mission();
                });
            },
            to_mission: () => {
                console.log(2)
            }

        };
        return fn;
    };

    let games = {
        avalon: avalon,
        undercover: undercover
    };
    let board = document.querySelector('#game-board');
    board.querySelector('.game-list').addEventListener('click', (e) => {
        let target = e.target;
        while(!target.classList.contains('game-list') && !target.getAttribute('data-game')){
            target = target.parentNode;
        }
        let game = target.getAttribute('data-game');
        if(!game) return;
        let util = games[game]();
        util.init(board);
    });
})();