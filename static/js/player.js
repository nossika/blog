window.PlayerUtil = (() => {
    const server = 'http://localhost:7869';
    let _data = {
        mode: 'normal', // normal / loop / random
        current: 0,
        list: null,
    };
    let _player = null, _audio = null;
    let PlayerUtil = {
        init_player: (config) => {
            PlayerUtil.player_render(config);
            PlayerUtil.player_events(config);
            PlayerUtil.set_mode('normal');
            PlayerUtil.set_volume(0.8);
        },
        player_render: (config) => {
            _player = document.createElement('section');
            _player.id = 'player';
            _player.innerHTML = PlayerUtil.player_html();
            let ul = _player.querySelector('[data-part="list"]');
            _data.list = config.list || [];
            ul.innerHTML = PlayerUtil.list_html({
                list: _data.list
            });
            _audio = _player.querySelector('[data-part="audio"]');
            if(_data.list.length){
                PlayerUtil.play('random');
            }
            document.body.appendChild(_player);
        },
        player_events: (config) => {
            let next_btn = _player.querySelector('[data-control="next"]');
            next_btn.addEventListener('click', (e) => {
                PlayerUtil.play(_data.mode !== 'random' ? 'next' : 'random');
            });
            let play_btn = _player.querySelector('[data-control="play"]');
            play_btn.addEventListener('click', (e) => {
                PlayerUtil[_audio.paused ? 'audio_play' : 'audio_pause']();
            });
            let pre_btn = _player.querySelector('[data-control="pre"]');
            pre_btn.addEventListener('click', (e) => {
                PlayerUtil.play(_data.mode !== 'random' ? 'pre' : 'random');
            });

            [].slice.call(_player.querySelectorAll('[data-mode]')).forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    PlayerUtil.set_mode(btn.getAttribute('data-mode'));
                });
            });

            _audio.addEventListener('loadstart', (e) => {
                PlayerUtil.onbegin(e);
            });
            _audio.addEventListener('loadedmetadata', (e) => {
                PlayerUtil.onloaded(e);
            });
            _audio.addEventListener('timeupdate', (e) => {
                PlayerUtil.onplay(e);
            });
            _audio.addEventListener('ended', (e) => {
                PlayerUtil.onend(e);
            });
        },
        play: (type) => {
            let index;
            switch (type){
                case 'next':
                    index = _data.current + 1;
                    index = index >= _data.list.length ? 0 : index;
                    break;
                case 'pre':
                    index = _data.current - 1;
                    index = index < 0 ? _data.list.length - 1 : index;
                    break;
                case 'again':
                    index = _data.current;
                    break;
                case 'random':
                    let random_index = (de_duplication) => {
                        index = Math.floor(Math.random() * _data.list.length);
                        if(de_duplication && index === _data.current){
                            random_index(de_duplication);
                        }
                    };
                    random_index(_data.list.length > 1);
                    break;
            }
            PlayerUtil.play_index(index);
        },
        play_index: (index) => {
            _audio.src = _data.list[index].path;
            _data.current = index;
            _audio.load();
        },
        audio_play: () => {
            _audio.play();
        },
        audio_pause: () => {
            _audio.pause();
        },
        onbegin: (e) => {
            let info = _player.querySelector('[data-part="info"]');
            info.querySelector('[data-info="title"]').innerText = _data.list[_data.current].title;
            info.querySelector('[data-info="author"]').innerText = _data.list[_data.current].author;
            PlayerUtil.update_progress();
        },
        onloaded: (e) => {
            PlayerUtil.audio_play();
            PlayerUtil.update_progress();
        },
        onplay: (e) => {
            PlayerUtil.update_progress();
        },
        onend: (e) => {
            switch (_data.mode){
                case 'normal':
                    PlayerUtil.play('next');
                    break;
                case 'loop':
                    PlayerUtil.play('again');
                    break;
                case 'random':
                    PlayerUtil.play('random');
                    break;
            }
        },
        set_mode: (mode) => {
            _data.mode = mode;
        },
        set_volume: (value) => {
            _audio.volume = value;
        },
        update_progress: () => {
            let _progress_text = _player.querySelector('[data-part="progress_text"]');
            _progress_text.innerText = PlayerUtil.convert_sec(_audio.currentTime) + ' / ' + PlayerUtil.convert_sec(_audio.duration);
            let _progress_bar = _player.querySelector('[data-part="progress_bar"]');
            _progress_bar.innerText = _audio.duration ? _audio.currentTime / _audio.duration : 0;
        },
        convert_sec: (sec) => {
            if(!sec) sec = 0;
            sec = parseInt(sec);
            let s = sec % 60;
            s = s < 10 ? '0' + s : s;
            let m = (sec - s) / 60;
            m = m < 10 ? '0' + m : m;
            return m + ':' + s;
        },
        get_list: (callback) => {
            PlayerUtil.ajax({
                url: server + '/tool/music_info',
                callback: (data, status) => {
                    if(status === 200) {
                        let list = JSON.parse(data);
                        (callback || function () {})(list);
                    }
                }
            });
        },
        player_html: () => {
            let html = `
            <div>
                <ul data-part="list"></ul>
                <div data-part="info">
                    <div data-info="cover"></div>
                    <p data-info="title"></p>
                    <p data-info="author"></p>
                </div>
                <div data-part="control">
                    <button data-control="pre">pre</button>
                    <button data-control="play">play</button>
                    <button data-control="next">next</button>
                </div>
                <div data-part="mode">
                    <button data-mode="normal">normal</button>
                    <button data-mode="loop">loop</button>
                    <button data-mode="random">random</button>
                </div>
                <div data-part="progress_text">
                </div>
                <div data-part="progress_bar">
                </div>
                <div data-part="volume">
                </div>
                <audio data-part="audio"></audio>
            </div>
            `;
            return html;
        },
        list_html: (params) => {
            let html = '';
            params.list.forEach((info, index) => {
                html += `
                <li data-index="${index}">${info.title} - ${info.author}</li>
                `
            });
            return html;
        },
        init_drag: (bar, config) => {

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