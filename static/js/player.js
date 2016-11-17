window.PlayerUtil = ((Util) => {
    const server = 'http://localhost:7869';
    let _data = {
        mode: '', // normal / loop / random
        current: 0,
        list: null,
    };
    let _player = null, _audio = null;
    let Bars = {};
    let PlayerUtil = {
        init_player: (config) => {
            PlayerUtil.player_render(config);
            PlayerUtil.player_events(config);
            PlayerUtil.switch_mode('normal');
            PlayerUtil.set_volume(0.8);
        },
        player_render: (config) => {
            _player = document.createElement('section');
            _player.id = config.id || 'player';
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

            (()=>{
                Bars.buffered = new Util.Bar(_player.querySelector('[data-part="progress_bar"]'), {
                    hide_dot: true,
                    disabled: true
                });
                Bars.buffered.elem.bar.style.cssText = 'background:green';
                Bars.buffered.update();

                Bars.progress = new Util.Bar(_player.querySelector('[data-part="progress_bar"]'), {
                    hide_dot: true,
                    disabled: true
                });
                Bars.progress.elem.bar.style.cssText = 'background:blue';
                Bars.progress.update();

                Bars.volume = new Util.Bar(_player.querySelector('[data-part="volume_bar"]'), {
                    default: 0.8,
                    hide_bar: true
                });
                Bars.volume.elem.dot.style.cssText = 'background:red;height:14px;width:12px;';
                Bars.volume.update();
                ['drag', 'click'].forEach((type)=>{
                    Bars.volume.event[type] = () => {
                        _audio.volume = Bars.volume.value;
                    }
                })
            })();
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

            let mode_btn = _player.querySelector('[data-mode]');
            mode_btn.addEventListener('click', (e) => {
                PlayerUtil.switch_mode();
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
            _audio.addEventListener('progress', (e) => {
                PlayerUtil.onbuffer(e);
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
            let svg = _player.querySelector('[data-control="play"] use');
            svg.setAttribute('xlink:href','#svgpath_audio_pause');
            _audio.play();
        },
        audio_pause: () => {
            let use = _player.querySelector('[data-control="play"] use');
            use.setAttribute('xlink:href','#svgpath_audio_play');
            _audio.pause();
        },
        onbegin: (e) => {
            let info = _player.querySelector('[data-part="info"]');
            info.querySelector('[data-info="title"]').innerText = _data.list[_data.current].title;
            info.querySelector('[data-info="author"]').innerText = _data.list[_data.current].author;
            Bars.buffered.value = 0;
            PlayerUtil.update_progress();
        },
        onloaded: (e) => {
            PlayerUtil.audio_play();
            PlayerUtil.update_progress();
        },
        onplay: (e) => {
            PlayerUtil.update_progress();
        },
        onbuffer: (e) => {
            let buffer = _audio.buffered;
            let loaded = [];
            for(let i = 0; i < buffer.length; i++){
                loaded.push([buffer.start(i), buffer.end(i)])
            }
            if(loaded.length){
                Bars.buffered.value = loaded[0][1]/_audio.duration;
            }
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
        switch_mode: (mode) => {
            let mode_list = ['normal', 'loop', 'random'],
                title_list = ['顺序播放', '单曲循环', '随机播放'];

            let mode_div = _player.querySelector('[data-mode]'),
                svg = mode_div.querySelector('use');
            if(!mode){
                mode = mode_list[mode_list.indexOf(_data.mode) + 1];
                if(!mode) mode = mode_list[0];
            }
            _data.mode = mode;
            svg.setAttribute('xlink:href',`#svgpath_audio_${mode}`);
            mode_div.setAttribute('title', title_list[mode_list.indexOf(_data.mode)]);
        },
        set_volume: (value) => {
            _audio.volume = value;
        },
        update_progress: () => {
            let _progress_text = _player.querySelector('[data-part="progress_text"]');
            _progress_text.innerText = PlayerUtil.convert_sec(_audio.currentTime) + ' / ' + PlayerUtil.convert_sec(_audio.duration);
            Bars.progress.value = _audio.duration ? _audio.currentTime / _audio.duration : 0;
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
            Util.ajax({
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
                    <div class="control-btn" data-control="pre" title="上一首 (ctrl + ←)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_pre"/>
                        </svg>
                    </div>
                    <div class="control-btn" data-control="play" title="播放/暂停 (P)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_play"/>
                        </svg>
                    </div>
                    <div class="control-btn" data-control="next" title="下一首 (ctrl + →)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_next"/>
                        </svg>
                    </div>
                </div>
                <div data-part="mode">
                    <div class="mode-btn" data-mode="" title="">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_normal"/>
                        </svg>
                    </div>
                </div>
                <div data-part="progress_text">
                </div>
                <div data-part="progress_bar">
                </div>
                <div data-part="volume_bar">
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
        }
    };
    return PlayerUtil;
})(window.Util);