window.PlayerUtil = ((Util) => {
    const server = 'http://localhost:7869';
    let _data = {
        mode: '', // normal / loop / random
        current: 0,
        list: null,
    };
    let _player = null, _audio = null, _list = null;
    let Bars = {};
    let PlayerUtil = {
        init_player: (config) => {
            PlayerUtil.player_render(config);
            PlayerUtil.player_events(config);
            PlayerUtil.switch_mode('normal');
            PlayerUtil.set_volume(0.8);
            if(_data.list.length){
                PlayerUtil.play('random');
            }
        },
        player_render: (config) => {
            _player = document.createElement('section');
            _player.id = config.id || 'player';
            _player.innerHTML = PlayerUtil.player_html();
            _list = _player.querySelector('[data-part="list"] ul');
            _data.list = config.list || [];
            _list.innerHTML = PlayerUtil.list_html({
                list: _data.list
            });
            _list.addEventListener('dblclick', (e) => {
                let elem = e.target;
                while(elem.tagName!=='UL' && !elem.getAttribute('data-index')) elem = elem.parentNode;
                let index = elem.getAttribute('data-index');
                if(!index) return;
                PlayerUtil.play_index(+index);
            });
            _audio = _player.querySelector('[data-part="audio"]');
            document.body.appendChild(_player);

        },
        player_events: (config) => {
            PlayerUtil.init_bars();

            _player.querySelector('[data-control="next"]').addEventListener('click', (e) => {
                PlayerUtil.play(_data.mode !== 'random' ? 'next' : 'random');
            });
            _player.querySelector('[data-control="play"]').addEventListener('click', (e) => {
                PlayerUtil[_audio.paused ? 'audio_play' : 'audio_pause']();
            });
            _player.querySelector('[data-control="pre"]').addEventListener('click', (e) => {
                PlayerUtil.play(_data.mode !== 'random' ? 'pre' : 'random');
            });
            _player.querySelector('[data-mode]').addEventListener('click', (e) => {
                PlayerUtil.switch_mode();
            });

            _player.querySelector('[data-control="toggle_volume"]').addEventListener('click', (e) => {
                let elem = _player.querySelector('[data-part="volume"]');
                elem.classList[elem.classList.contains('hide')?'remove':'add']('hide');
                Bars.volume.update();
            });
            _player.querySelector('[data-control="toggle_list"]').addEventListener('click', (e) => {
                let elem = _player.querySelector('[data-part="list"]');
                elem.classList[elem.classList.contains('hide')?'remove':'add']('hide');
                if(!Bars.list.elem.dot.style.height){
                    let view_h = _player.querySelector('.list-view').offsetHeight,
                        ul_h = _player.querySelector('.list-ul').offsetHeight;

                    Bars.list.elem.dot.style.height = view_h/ul_h * 100 + '%';
                    if(ul_h <= view_h) Bars.list.hide_dot();
                }
                Bars.list.update();
            });
            _player.querySelector('[data-control="hide_list"]').addEventListener('click', (e) => {
                let elem = _player.querySelector('[data-part="list"]');
                elem.classList.add('hide');
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
        init_bars: () => {
            Bars.buffered = new Util.Bar(_player.querySelector('[data-bar="buffered_bar"]'), {
                hide_dot: true,
                disabled: true
            });
            Bars.buffered.elem.bar.style.cssText = 'background:green';
            Bars.buffered.update();

            Bars.progress = new Util.Bar(_player.querySelector('[data-bar="progress_bar"]'), {
                hide_dot: true,
                disabled: true
            });
            Bars.progress.elem.bar.style.cssText = 'background:blue';
            Bars.progress.update();

            Bars.volume = new Util.Bar(_player.querySelector('[data-bar="volume_bar"]'), {
                default: 0.8,
                hide_bar: true
            });
            Bars.volume.elem.dot.style.cssText = 'cursor:pointer;background:red;height:14px;width:12px;';
            Bars.volume.update();
            Bars.volume.event.change = (value) => {
                _audio.volume = value;
            };
            Bars.list = new Util.Bar(_player.querySelector('[data-bar="list_bar"]'), {
                default: 1,
                hide_bar: true,
                non_overflow: true
            });
            Bars.list.elem.dot.style.cssText = 'background:red;width:100%;';
            Bars.list.update();

            let view = _player.querySelector('.list-view'),
                ul = _player.querySelector('.list-ul');
            ul.addEventListener('mousewheel', (e) => {
                if(ul.offsetHeight <= view.offsetHeight) return;
                let move = e.deltaY > 0 ? 50 : -50;
                Bars.list.value -= move/(ul.offsetHeight - view.offsetHeight);
            });
            Bars.list.event.change = (value, type) => {
                let top = (1 - value) * (ul.offsetHeight - view.offsetHeight)
                ul.style.top = -top + 'px';
            };

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
            _data.current = index;
            ['innerText','title'].forEach((prop) => {
                _player.querySelector('[data-info="title"]')[prop] = _data.list[_data.current].title;
                _player.querySelector('[data-info="author"]')[prop] = _data.list[_data.current].author;
            });
            let cover = _player.querySelector('[data-info="cover"]');
            cover.src = _data.list[_data.current].cover;
            cover.onerror = (e) => {
                cover.src = '/img/default.png';
                cover.onerror = null;
            };
            _audio.src = _data.list[index].path;
            [].slice.call(_list.querySelectorAll('[data-index]')).forEach((li) => {
                li.classList.remove('at');
                if(+li.getAttribute('data-index') === index) {
                    li.classList.add('at');
                }
            });
            Bars.buffered.value = 0;
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
            let _progress_text = _player.querySelector('[data-info="progress_text"]');
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
            <div class="container">
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
                <div data-part="cover">
                    <img data-info="cover" src=""/>
                </div>
                <div data-part="main">
                    <span data-info="title"></span>
                    <span data-info="author"></span>
                    <div data-info="progress_text"></div>
                    <div class="info-bar">
                        <div class="bar" data-bar="buffered_bar"></div>
                        <div class="bar" data-bar="progress_bar"></div>
                    </div>
                </div>
                <div data-part="toggle_volume">
                    <div class="audio-btn" data-control="toggle_volume">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_volume"/>
                        </svg>
                    </div>
                </div>
                <div data-part="mode">
                    <div class="audio-btn" data-mode="" title="">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_normal"/>
                        </svg>
                    </div>
                </div>
                <div data-part="toggle_list" title="播放列表">
                    <div class="audio-btn" data-control="toggle_list">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath_audio_list"/>
                        </svg>
                    </div>
                </div>  
                <div data-part="volume" class="hide">
                    <div data-bar="volume_bar"></div>
                </div>
                <div data-part="list" class="list hide">
                    <div class="list-title">
                        <span>title</span>
                        <span>author</span>
                        <span data-control="hide_list">X</span>
                    </div>
                    <div class="list-content">
                        <div class="list-view">
                            <ul class="list-ul"></ul>
                        </div>
                        <div data-bar="list_bar" class="list-bar"></div> 
                    </div>
                </div>  
                <audio data-part="audio"></audio>
            </div>
            </div>
            `;
            return html;
        },
        list_html: (params) => {
            let html = '';
            params.list.forEach((info, index) => {
                html += `
                <li data-index="${index}"><span class="title">${info.title}</span> - <span class="author">${info.author}</span></li>
                `
            });
            return html;
        }
    };
    return PlayerUtil;
})(window.Util);