window.PlayerUtil = (() => {
    const server = 'http://localhost:7869';
    let play_list = null;
    let PlayerUtil = {
        init_player: (config) => {
            let player = document.createElement('section');
            player.id = 'player';
            player.innerHTML = PlayerUtil.player_html();
            let ul = player.querySelector('[data-part="list"]');
            play_list = config.list || [];
            ul.innerHTML = PlayerUtil.list_html({
                list: config.list
            });
            let audio = player.querySelector('[data-part="audio"]');
            audio.addEventListener('progress', (a,b,c) => {
                console.log(a,b,c)
            });
            audio.src = play_list[0].path;
            audio.play();
            document.body.appendChild(player);
        },
        get_list: (callback) => {
            PlayerUtil.ajax({
                url: server + '/tool/music_info',
                callback: (data, status) => {
                    if(status === 200) {
                        let list = JSON.parse(data);
                        (callback || function () {
                        })(list);
                    }
                }
            });
        },
        player_html: () => {
            let html = `
            <div>
                <h1>dgr2222222222</h1>
                <p>dsgfwegwg</p>
                <ul data-part="list"></ul>
                <audio data-part="audio"></audio>
            </div>
            `;
            return html;
        },
        list_html: (params) => {
            let html = '';
            params.list.forEach((info, index) => {
                html += `
                <li data-index="${index}">${info.name} - ${info.author}</li>
                `
            });
            return html;
        },
        ajax: (config) => {
            let method = (config.method || 'GET').toUpperCase();
            let url = config.url;
            let data = config.data || {};
            let header = config.header || {};
            let callback = config.callback || function(){};

            try{
                let XHR = new XMLHttpRequest();
                let data_arr = [];
                for(let key in data){
                    data_arr.push(key+'='+data[key]);
                }
                let data_str = data_arr.join('&');

                let body;
                if(method === 'GET'){
                    url += '?' + data_str;
                    body = null;
                }else if(method === 'POST'){
                    body = data_str;
                }else{
                    throw 'only get/post available';
                }

                XHR.onreadystatechange = function(){
                    if(XHR.readyState === 4){
                        callback(XHR.responseText,XHR.status);
                    }
                };
                XHR.open(method,url);
                for(let i in header){
                    XHR.setRequestHeader(i, header[i]);
                }
                XHR.send(body);
            }catch (e){
                console.log(e);
            }
        },
       
    };
    return PlayerUtil;
})();