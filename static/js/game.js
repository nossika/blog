(()=>{
    const server = 'http://localhost:7777';
    window.game_socket = null;
    let util = {
        avalon: {
            room: () => {
                board.innerHTML = avalon_html.room();
                board.querySelector('[data-action="room"]').addEventListener('click', () => {
                    let id = board.querySelector('.room-id').value;
                    if(!id) return;
                    window.game_socket = io.connect(server + '/avalon');
                    window.game_socket.on('connect', (d) => {
                        window.game_socket.emit('login_room', id, (data) => {
                            console.log(data)
                        });
                      
                    });
                    window.game_socket.on('user_count', (data) => {
                        console.log(data)
                    })
                });
            }
        },
        werewolf: {
            room: () => {

            }
        }
    };
    let avalon_html = {
        room: () => {
            return `
                <div>
                    请输入要创建或者进入的房间号：
                    <input type="text" class="room-id" maxlength="4"/>
                    <button class="btn" data-action="room">确定</button>
                </div>
            `
        }
    };
    let board = document.querySelector('#game-board');
    board.querySelector('.game-list').addEventListener('click', (e) => {
        let target = e.target;
        while(!target.classList.contains('game-list') && !target.getAttribute('data-game')){
            target = target.parentNode;
        }
        let game = target.getAttribute('data-game');
        if(!game) return;
        util[game].room();
    });
})();