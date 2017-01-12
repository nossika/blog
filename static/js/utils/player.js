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
            _player.className = 'collapse';
            _player.innerHTML = PlayerUtil.player_html();
            _data.list = config.list || [];
            _audio = _player.querySelector('[data-part="audio"]');
            document.body.appendChild(_player);
        },
        player_events: (config) => {
            PlayerUtil.init_bars();

            let collapse_delay;
            _player.addEventListener('mouseenter', () => {
                clearTimeout(collapse_delay);
                _player.classList.remove('collapse');
            });
            _player.addEventListener('mouseleave', () => {
                if(_player.fixed) return;
                collapse_delay = setTimeout(()=>{
                    _player.classList.add('collapse');
                    let _volume = _player.querySelector('.volume');
                    if(_volume){
                        _volume.parentNode.removeChild(_volume);
                    }
                    let _list = _player.querySelector('.list');
                    if(_list){
                        _list.parentNode.removeChild(_list);
                    }
                },3000);
            });
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
                setTimeout(() => {
                    PlayerUtil.create_volume();
                },0);
            });
            _player.querySelector('[data-control="toggle_list"]').addEventListener('click', (e) => {
                setTimeout(() => {
                    PlayerUtil.create_list();
                },0);
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
            Bars.buffered.elem.fill.className = 'buffered-fill';
            Bars.buffered.render();

            Bars.progress = new Util.Bar(_player.querySelector('[data-bar="progress_bar"]'), {
                hide_dot: true,
                disabled: true
            });
            Bars.progress.elem.fill.className = 'progress-fill';
            Bars.progress.render();




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
            Bars.buffered.value = 0;
            _audio.load();
        },
        audio_play: () => {
            let svg = _player.querySelector('[data-control="play"] use');
            svg.setAttribute('xlink:href','#svgpath-audio-pause');
            _audio.play();
        },
        audio_pause: () => {
            let use = _player.querySelector('[data-control="play"] use');
            use.setAttribute('xlink:href','#svgpath-audio-play');
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
            svg.setAttribute('xlink:href',`#svgpath-audio-${mode}`);
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
                        callback && callback(list);
                    }
                }
            });
        },

        player_html: () => {
            let html = `
            <div class="container">
                <div data-part="control">
                    <div class="control-btn pre" data-control="pre" title="上一首 (ctrl + ←)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath-audio-pre"/>
                        </svg>
                    </div>
                    <div id="player-play" class="control-btn" data-control="play" title="播放/暂停 (P)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath-audio-play"/>
                        </svg>
                    </div>
                    <div class="control-btn next" data-control="next" title="下一首 (ctrl + →)">
                        <svg viewbox="0 0 1024 1024">
                            <use xlink:href="#svgpath-audio-next"/>
                        </svg>
                    </div>
                </div>
                <div data-part="cover">
                    <div class="cover-blank"></div>
                    <div id="player-cover">
                        <img data-info="cover" src=""/>
                    </div>
                </div>
                <div data-part="main">
                    <div id="player-info">
                        <span data-info="title"></span>
                        <span data-info="author"></span>
                    </div>
                    <div>
                        <div class="info-bar">
                            <div class="bar" data-bar="buffered_bar"></div>
                            <div class="bar" data-bar="progress_bar"></div>
                        </div>
                        <div id="player-progress" data-info="progress_text"></div>
                    </div>
                </div>
                <div data-part="control2">
                    <div data-action="toggle_volume" title="音量">
                        <div class="audio-btn" data-control="toggle_volume">
                            <svg viewbox="0 0 1024 1024">
                                <use xlink:href="#svgpath-audio-volume"/>
                            </svg>
                        </div>
                    </div>
                    <div data-action="mode">
                        <div class="audio-btn" data-mode="" title="">
                            <svg viewbox="0 0 1024 1024">
                                <use xlink:href="#svgpath-audio-normal"/>
                            </svg>
                        </div>
                    </div>
                    <div data-action="toggle_list" title="播放列表">
                        <div class="audio-btn" data-control="toggle_list">
                            <svg viewbox="0 0 1024 1024">
                                <use xlink:href="#svgpath-audio-list"/>
                            </svg>
                        </div>
                    </div> 
                </div>
                
                  
                <audio data-part="audio"></audio>
            </div>
            <svg width="0" height="0">
                <defs>
                    <path id="svgpath-audio-next" d="M581.5 512l-273.1-273.1c-25-25-25-65.5 0-90.5s65.5-25 90.5 0l316.7 316.7c12.9 12.9 19.2 30 18.7 47 0.4 16.9-5.8 33.9-18.699 46.8l-316.8 316.8c-25 25-65.5 25-90.5 0s-25-65.5 0-90.5l273.2-273.2z"></path>
                    <path id="svgpath-audio-pre" d="M442.5 512l273.1 273.1c25 25 25 65.5 0 90.5s-65.5 25-90.5 0L308.4 558.9c-12.9-12.9-19.2-30-18.7-47-0.4-16.9 5.8-33.9 18.7-46.8l316.8-316.8c25-25 65.5-25 90.5 0s25 65.5 0 90.5L442.5 512z"></path>
                    <path id="svgpath-audio-play" d="M851.2 460.8 224 96c-6.4 0-19.2-6.4-25.6-6.4-12.8 0-19.2 0-32 6.4C147.2 108.8 134.4 128 134.4 153.6l0 729.6c0 19.2 12.8 44.8 32 51.2 6.4 6.4 19.2 6.4 32 6.4 12.8 0 19.2 0 32-6.4l627.2-358.4c19.2-12.8 32-32 32-51.2C883.2 492.8 870.4 467.2 851.2 460.8L851.2 460.8zM851.2 460.8"></path>
                    <path id="svgpath-audio-pause" d="M740.5967 162.5743c33.9282 0 61.698 34.1053 61.698 75.7924v547.971072c0 41.686-27.7699 75.7821-61.698 75.7821h-30.839808c-33.9292 0-61.6929-34.0961-61.6929-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.6929-75.7924H740.596736z M314.2922 162.5743c33.9313 0 61.696 34.1053 61.696 75.7924v547.971072c0 41.686-27.7658 75.7821-61.696 75.7821H283.45651200000003c-33.9343 0-61.698-34.0961-61.698-75.7821V238.36672000000002c0-41.687 27.7637-75.7924 61.698-75.7924H314.29222400000003z"></path>
                    <path id="svgpath-audio-normal" d="M902.836453 788.242532l0.002047-0.027629 0-0.001023c0-8.088212-3.349281-16.187681-9.06547-21.903869l-85.375459-85.375459c-28.250414-28.250414-72.058153 15.556301-43.806715 43.806715l32.484855 32.492018L153.287175 757.233284c-39.953967 0-39.953967 61.959144 0 61.959144l718.571752 0C888.637056 819.193451 902.821103 805.01759 902.836453 788.242532z M759.588935 271.402293l112.271016 0c26.963095 0 41.037648-33.758871 21.914102-52.883441l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576-37.474496 0C719.632921 209.44315 719.632921 271.402293 759.588935 271.402293z M636.084063 271.402293l22.448268 0c39.956014 0 39.956014-61.959144 0-61.959144l-22.448268 0C596.128049 209.44315 596.128049 271.402293 636.084063 271.402293z M153.287175 271.402293l392.973116 0c39.956014 0 39.956014-61.959144 0-61.959144L153.287175 209.44315C113.332185 209.44315 113.332185 271.402293 153.287175 271.402293z M902.839523 514.317789c0-8.092305-3.347235-16.184611-9.06547-21.903869l-85.375459-85.375459c-28.274974-28.227901-72.061222 15.572674-43.806715 43.827181l32.472576 32.472576L153.287175 483.338217c-39.956014 0-39.952944 61.959144 0 61.959144l718.571752 0c16.785292 0 30.979572-14.192234 30.979572-30.978549L902.838499 514.317789z"></path>
                    <path id="svgpath-audio-loop" d="M997.970784 537.255904C997.970784 716.297771 871.695112 895.339639 639.887048 895.339639 534.175614 895.339639 318.66036 895.339639 217.859789 895.339639 213.486052 895.339639 208.984428 895.339639 205.071084 895.339639L182.818737 895.339639 245.176462 957.671787C260.215979 972.736881 260.215979 997.112152 245.176462 1012.151669 230.111368 1027.191186 205.736097 1027.191186 190.69658 1012.151669L63.602431 885.05752C63.346657 884.827324 63.295502 884.494817 63.039728 884.239043 56.00594 877.281988 51.606626 867.639304 51.606626 856.973525 51.606626 846.282167 56.00594 836.665061 63.039728 829.708006 63.295502 829.452232 63.346657 829.119726 63.602431 828.863951L190.69658 701.769803C205.736097 686.730286 230.111368 686.730286 245.176462 701.769803 260.215979 716.80932 260.215979 741.210168 245.176462 756.249685L182.818737 818.60741 205.071084 818.60741C208.779808 818.60741 213.153545 818.60741 217.859789 818.60741 277.941124 818.60741 416.775304 818.60741 588.732229 818.60741 817.317539 818.60741 921.238555 687.523186 921.238555 460.523675L923.821873 460.523675C922.363961 456.482444 921.238555 452.262171 921.238555 447.73497L921.238555 396.580151C921.238555 375.376478 938.426574 358.214036 959.604669 358.214036 980.782765 358.214036 997.970784 375.376478 997.970784 396.580151L997.970784 447.73497C997.970784 452.262171 996.845378 456.482444 995.387465 460.523675L997.970784 460.523675 997.970784 537.255904ZM489.005909 358.214036C494.300433 343.379138 508.137811 332.636626 524.788705 332.636626 545.9668 332.636626 563.154819 349.799068 563.154819 371.002741L563.154819 677.931657C563.154819 699.109752 545.9668 716.297771 524.788705 716.297771 503.61061 716.297771 486.42259 699.109752 486.42259 677.931657L486.42259 434.946265 473.633885 434.946265C452.45579 434.946265 435.267771 417.758246 435.267771 396.580151 435.267771 375.376478 452.45579 358.214036 473.633885 358.214036L489.005909 358.214036ZM960.397569 194.467459 833.30342 321.561608C818.263903 336.601125 793.888632 336.601125 778.849115 321.561608 763.784021 306.522091 763.784021 282.14682 778.849115 267.107303L841.181263 204.749578 818.928916 204.749578C815.220192 204.749578 810.846455 204.749578 806.140211 204.749578 746.058876 204.749578 607.224696 204.749578 435.267771 204.749578 206.682461 204.749578 102.761445 335.833803 102.761445 562.833313L100.178127 562.833313C101.636039 566.874544 102.761445 571.069239 102.761445 575.622018L102.761445 626.776838C102.761445 647.954933 85.573426 665.142952 64.395331 665.142952 43.217235 665.142952 26.029216 647.954933 26.029216 626.776838L26.029216 575.622018C26.029216 571.069239 27.154622 566.874544 28.612535 562.833313L26.029216 562.833313 26.029216 486.101084C26.029216 307.059217 152.330465 128.017349 384.112952 128.017349 489.824386 128.017349 705.33964 128.017349 806.140211 128.017349 810.513948 128.017349 815.015572 128.017349 818.928916 128.017349L841.181263 128.017349 778.849115 65.659624C763.784021 50.620107 763.784021 26.219258 778.849115 11.179742 793.888632-3.859775 818.263903-3.859775 833.30342 11.179742L960.397569 138.299468C960.653343 138.529664 960.704498 138.862171 960.960272 139.117945 967.99406 146.075 972.393374 155.692106 972.393374 166.383463 972.393374 177.049243 967.99406 186.691927 960.960272 193.648982 960.730075 193.904756 960.653343 194.237263 960.397569 194.467459Z"></path>
                    <path id="svgpath-audio-random" d="M537.728 382.016c55.552-55.04 127.04-79.616 231.808-79.616l5.312 0 0 59.712c0 19.072 13.056 26.24 29.12 15.872l143.68-92.8c16-10.368 15.808-27.072-0.32-37.056l-143.04-88.64c-16.192-10.048-29.44-2.624-29.44 16.448l0 59.392-5.312 0c-122.176 0-210.816 31.424-278.976 99.072C422.208 402.112 420.416 464.896 419.008 515.328c-0.64 21.696-1.152 40.384-6.592 57.472-12.16 38.4-44.032 73.92-89.728 99.904-57.472 32.896-135.04 49.728-224.32 48.768-0.128 0-0.256 0-0.384 0-18.368 0-33.344 14.72-33.536 33.152-0.192 18.496 14.656 33.728 33.152 33.856 2.816 0 5.568 0.128 8.32 0.128 49.408 0 95.872-4.992 138.112-14.72 41.536-9.728 79.168-24.128 111.936-42.752 60.352-34.624 103.104-83.52 120.384-137.984 8.256-26.112 8.96-51.392 9.664-75.84C487.36 470.912 488.448 430.784 537.728 382.016zM98.432 302.464c112.192-1.216 206.016 26.048 264.128 76.8 6.336 5.568 14.208 8.256 22.016 8.256 9.344 0 18.624-3.904 25.28-11.456 12.16-13.952 10.752-35.072-3.2-47.296-33.728-29.504-76.032-52.48-125.504-68.352-54.016-17.344-115.776-25.728-183.488-24.96-18.496 0.192-33.344 15.36-33.152 33.92C64.704 287.808 79.872 302.72 98.432 302.464zM947.328 734.272l-143.04-88.512c-16.192-10.112-29.44-2.624-29.44 16.384l0 59.392-5.312 0c-93.696 0-165.632-28.032-226.368-88.256-13.12-12.992-34.368-12.864-47.36 0.256-13.056 13.12-12.992 34.368 0.128 47.488 73.152 72.384 162.688 107.648 273.6 107.648l5.312 0 0 59.776c0 19.008 13.056 26.24 29.12 15.744l143.68-92.736C963.648 761.024 963.456 744.384 947.328 734.272z"></path>
                    <path id="svgpath-audio-list" d="M672 625.109333 672 192.085333c0-17.749333 14.421333-32.085333 31.701333-32.085333l128.597333 0c17.493333 0 31.701333 14.208 31.701333 32 0 17.664-14.421333 32-31.701333 32L736 224l0 514.218667c0 0 0 0 0 0-1.194667 69.674667-58.026667 125.781333-128 125.781333-70.698667 0-128-57.301333-128-128s57.301333-128 128-128C631.296 608 653.184 614.229333 672 625.109333L672 625.109333zM160 640c0-17.664 14.506667-32 32.426667-32l191.146667 0c17.92 0 32.426667 14.208 32.426667 32 0 17.664-14.506667 32-32.426667 32L192.426667 672C174.506667 672 160 657.792 160 640zM160 480c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 512 160 497.792 160 480zM160 320c0-17.664 14.378667-32 32.213333-32l383.573333 0c17.792 0 32.213333 14.208 32.213333 32 0 17.664-14.378667 32-32.213333 32l-383.573333 0C174.421333 352 160 337.792 160 320z"></path>
                    <path id="svgpath-audio-volume" d="M838.733994 895.65489l-51.130518-50.346665c79.672574-90.010013 128.306224-207.370954 128.306224-336.173482 0-128.800481-48.632627-246.162446-128.306224-336.172459l51.130518-50.347688c92.624561 102.901625 148.982126 238.20624 148.982126 386.519124C987.71612 657.44865 931.357532 792.753265 838.733994 895.65489zM698.726264 757.852384l-51.103912-50.346665c44.223201-54.354955 70.817905-123.283838 70.817905-198.370976 0-75.085092-26.594705-144.016021-70.817905-198.428282l51.103912-50.28936c57.111742 67.420529 91.51939 154.062841 91.51939 248.717641C790.245653 603.790566 755.838006 690.432879 698.726264 757.852384zM485.05379 791.882432c-11.846816 0-22.675442-3.89061-31.590486-10.279111l-0.086981 0.116657L270.075577 650.479935 90.113879 650.479935c-29.733185 0-53.831023-23.692608-53.831023-53.019541L36.282856 420.809091c0-29.267581 24.040533-52.960189 53.715389-53.018517l0-0.173962 178.539302 0 182.429913-146.919141 0.145309 0.173962c9.29162-7.491625 20.993127-12.136412 33.942043-12.136412 29.761837 0 53.860698 23.691585 53.860698 52.960189l0 159.113881 0 123.692137 0 52.960189 0 53.019541 0 88.382956C538.915511 768.131495 514.81665 791.882432 485.05379 791.882432z"></path>
                </defs>
            </svg>
            `;
            return html;
        },
        list_html: (params) => {
            let html = '';
            params.list.forEach((info, index) => {
                html += `
                <li data-index="${index}"><span class="title">${info.title}</span> <span class="author">${info.author}</span></li>
                `
            });
            return html;
        },
        create_list: () => {
            let _list = document.createElement('div');
            _list.innerHTML = `
                <div data-part="list" class="list popup">
                    <div class="list-title">
                        <span>播放列表</span>
                    </div>
                    <div class="list-content">
                        <div class="list-view">
                            <ul class="list-ul"></ul>
                        </div>
                        <div data-bar="list_bar" class="list-bar"></div> 
                    </div>
                </div>
                `;
            let ul = _list.querySelector('.list-ul');
            ul.innerHTML = PlayerUtil.list_html({
                list: _data.list
            });
            let mark_list = (index)=> {
                [].slice.call(ul.querySelectorAll('[data-index]')).forEach((li) => {
                    li.classList.remove('at');
                    if(+li.getAttribute('data-index') === index) {
                        li.classList.add('at');
                    }
                });
            };
            mark_list(_data.current);
            ul.addEventListener('click', (e) => {
                let elem = e.target;
                while(elem.tagName!=='UL' && !elem.getAttribute('data-index')) elem = elem.parentNode;
                let index = elem.getAttribute('data-index');
                if(!index) return;
                index = +index;
                mark_list(index);
                PlayerUtil.play_index(index);
            });
            _player.querySelector('.container').appendChild(_list);
            Bars.list = new Util.Bar(_player.querySelector('[data-bar="list_bar"]'), {
                default: 1,
                hide_fill: true,
                inner_mode: true
            });
            Bars.list.elem.dot.className = 'list-dot';
            Bars.list.render();

            let view = _player.querySelector('.list-view');
            ul.addEventListener('mousewheel', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if(ul.offsetHeight <= view.offsetHeight) return;
                let move = e.deltaY > 0 ? 50 : -50;
                Bars.list.value -= move/(ul.offsetHeight - view.offsetHeight);
            });
            Bars.list.on_change = (value, type) => {
                let top = (1 - value) * (ul.offsetHeight - view.offsetHeight);
                ul.style.top = -top + 'px';
            };
            if(!Bars.list.elem.dot.style.height){
                let view_h = _player.querySelector('.list-view').offsetHeight,
                    ul_h = _player.querySelector('.list-ul').offsetHeight;
                Bars.list.elem.dot.style.height = view_h/ul_h * 100 + '%';
                if(ul_h <= view_h) Bars.list.hide_dot();
            }
            Bars.list.render();
        },
        create_volume: () => {
            let _volume = document.createElement('div');
            _volume.innerHTML =`
                <div data-part="volume" class="volume popup">
                    <div data-bar="volume_bar"></div>
                </div>
            `;
            _player.querySelector('.container').appendChild(_volume);

            Bars.volume = new Util.Bar(_player.querySelector('[data-bar="volume_bar"]'), {
                default: _audio.volume,
            });
            Bars.volume.elem.dot.className = 'volume-dot';
            Bars.volume.elem.fill.className = 'volume-fill';
            Bars.volume.render();
            Bars.volume.on_change = (value) => {
                _audio.volume = value;
            };
        },
        fix_player: (is_fixed) => {
            _player.fixed = is_fixed;
        }
    };
    return PlayerUtil;
})(window.Util);