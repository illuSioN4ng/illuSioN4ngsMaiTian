﻿(function($){
  // Settings
  var repeat = localStorage.repeat || 0,
    shuffle = localStorage.shuffle || 'false',
    continous = true,
    autoplay = true,
    playlist = [
      {
        "title": "麦田",
        "artist": "纯音乐"
      },
      {
        "title": "Childhood Memory",
        "artist": "班得瑞"
      },
      {
        "title": "1945完整演奏版",
        "artist": "海角七号"
      },
      {
        "title": "菊次郎的夏天",
        "artist": "久石让"
      },
      {
        "title": "时代を越える想い",
        "artist": "犬夜叉原声带"
      },
      {
        "title": "梦中的婚礼",
        "artist": "里查德·克莱德曼"
      },
      {
        "title": "水边的阿狄丽娜",
        "artist": "里查德·克莱德曼"
      },
      {
        "title": "那年的愿望",
        "artist": "好妹妹乐队"
      },
      {
        "title": "你曾是少年",
        "artist": "S.H.E"
      },
      {
        "title": "安妮的仙境",
        "artist": "班得瑞"
      },
      {
        "title": "房间",
        "artist": "刘瑞琦"
      },
      {
        "title": "抉择",
        "artist": "好妹妹乐队"
      },
      {
        "title": "是非题",
        "artist": "范玮琪"
      },
      {
        "title": "直觉",
        "artist": "孙伯纶"
      },
      {
        "title": "莫失莫忘",
        "artist": "纯音乐"
      },
      {
        "title": "一个人的北京",
        "artist": "好妹妹乐队"
      },
      {
        "title": "不要说话",
        "artist": "陈奕迅"
      },
      {
        "title": "君をのせて",
        "artist": "宫崎骏"
      },
      {
        "title": "心动",
        "artist": "陈洁仪"
      },
      {
        "title": "恋无可恋",
        "artist": "古巨基"
      },
      {
        "title": "梨花又开放",
        "artist": "韩红"
      },
      {
        "title": "独立",
        "artist": "蜜雪薇琪"
      },
      {
        "title": "离别的车站",
        "artist": "好妹妹乐队"
      },
      {
        "title": "米店",
        "artist": "李志"
      },
      {
        "title": "虎口脱险",
        "artist": "老狼"
      },
      {
        "title": "阴天快乐",
        "artist": "陈奕迅"
      },
      {
        "title": "As Long As You Love Me",
        "artist": "Backstreet Boys"
      },
      {
        "title": "Beautiful Love",
        "artist": "蔡健雅"
      },
      {
        "title": "后会无期",
        "artist": "G.E.M.邓紫棋"
      },
      {
        "title": "眉间雪",
        "artist": "HITA"
      },
      {
        "title": "My Love",
        "artist": "Westlife"
      },
      {
        "title": "言叶之庭",
        "artist": "rain"
      },
      {
        "title": "风的季节",
        "artist": "Soler"
      },
      {
        "title": "不再联系",
        "artist": "夏天Alex"
      },
      {
        "title": "比翼の羽根",
        "artist": "缘之空"
      },
      {
        "title": "爱情转移",
        "artist": "陈奕迅"
      },
      {
        "title": "你看不到的天空",
        "artist": "蔡旻佑"
      },
      {
        "title": "彼幕苍年",
        "artist": "纯音乐"
      },
      {
        "title": "Tomorrow With You",
        "artist": "Senpai,Kondor"
      },
      {
        "title": "Town of Windmill",
        "artist": "a_hisa"
      },
      {
        "title": "My song for you",
        "artist": "班得瑞"
      },
      {
        "title": "又想起你",
        "artist": "回音哥"
      },
      {
        "title": "想想我",
        "artist": "李祥祥"
      },
      {
        "title": "现在才明白",
        "artist": "萧贺硕"
      }
]

  // Load playlist
  for (var i=0; i<playlist.length; i++){
    var item = playlist[i];
    $('#playlist').append('<li>'+item.title+' - '+item.artist+'</li>');
  }

  var time = new Date(),
    currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
    trigger = false,
    audio, timeout, isPlaying, playCounts;

  var play = function(){
    audio.play();
    $('.playback').addClass('playing');
    timeout = setInterval(updateProgress, 500);
    isPlaying = true;
  }

  var pause = function(){
    audio.pause();
    $('.playback').removeClass('playing');
    clearInterval(updateProgress);
    isPlaying = false;
  }

  // Update progress
  var setProgress = function(value){
    var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
      ratio = value / audio.duration * 100;

    $('.timer').html(parseInt(value/60)+':'+currentSec);
    $('.progress .pace').css('width', ratio + '%');
    $('.progress .slider a').css('left', ratio + '%');
  }

  var updateProgress = function(){
    setProgress(audio.currentTime);
  }

  // Progress slider
  $('.progress .slider').slider({step: 0.1, slide: function(event, ui){
    $(this).addClass('enable');
    setProgress(audio.duration * ui.value / 100);
    clearInterval(timeout);
  }, stop: function(event, ui){
    audio.currentTime = audio.duration * ui.value / 100;
    $(this).removeClass('enable');
    timeout = setInterval(updateProgress, 500);
  }});

  // Volume slider
  var setVolume = function(value){
    audio.volume = localStorage.volume = value;
    //console.log(localStorage.volume);
    $('.volume .pace').css('width', value * 100 + '%');
    $('.volume .slider a').css('left', value * 100 + '%');
  }

  var volume = localStorage.volume || 0.3;
  //console.log(localStorage.volume);
  //console.log(volume);
  $('.volume .slider').slider({max: 1, min: 0, step: 0.01, value: volume, slide: function(event, ui){
    setVolume(ui.value);
    $(this).addClass('enable');
    $('.mute').removeClass('enable');
  }, stop: function(){
    $(this).removeClass('enable');
  }}).children('.pace').css('width', volume * 100 + '%');

  $('.mute').click(function(){
    if ($(this).hasClass('enable')){
      setVolume($(this).data('volume'));
      $(this).removeClass('enable');
    } else {
      $(this).data('volume', audio.volume).addClass('enable');
      setVolume(0);
    }
  });

  // Switch track
  var switchTrack = function(i){
    if (i < 0){
      track = currentTrack = playlist.length - 1;
    } else if (i >= playlist.length){
      track = currentTrack = 0;
    } else {
      track = i;
    }

    $('audio').remove();
    loadMusic(track);
    if (isPlaying == true) play();
  }

  // Shuffle
  var shufflePlay = function(){
    var time = new Date(),
      lastTrack = currentTrack;
    currentTrack = time.getTime() % playlist.length;
    if (lastTrack == currentTrack) ++currentTrack;
    switchTrack(currentTrack);
  }

  // Fire when track ended
  var ended = function(){
    pause();
    audio.currentTime = 0;
    playCounts++;
    if (continous == true) isPlaying = true;
    if (repeat == 1){
      play();
    } else {
      if (shuffle === 'true'){
        shufflePlay();
      } else {
        if (repeat == 2){
          switchTrack(++currentTrack);
        } else {
          if (currentTrack < playlist.length) switchTrack(++currentTrack);
        }
      }
    }
  }

  var beforeLoad = function(){
    var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
    $('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
  }

  // Fire when track loaded completely
  var afterLoad = function(){
    if (autoplay == true) play();
  }

    var random = Math.floor(1 + Math.random() * 9);
    $('#background').css('background-image', 'url(./img/bg' + random + '.webp)');
  // Load track
  var loadMusic = function(i){
    var item = playlist[i],
      newaudio = $('<audio>').html('<source src="./music/'+item.title+' - '+item.artist+'.mp3">').appendTo('#player');
    
    $('.cover').html('<img src="./img/bg'+random+'.webp" alt="'+item.title+'">');
    $('.tag').html('<strong>'+item.title+'</strong><span class="artist">'+item.artist+'</span>');
    $('#playlist li').removeClass('playing').eq(i).addClass('playing');
    if ($('#playlist li').eq(i).offset().top > 600) {
      $('body').scrollTo('li.playing', {duration: 1500});
    }
    $('title').text(item.title + " - " + item.artist);
    audio = newaudio[0];
    audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
    audio.addEventListener('progress', beforeLoad, false);
    audio.addEventListener('durationchange', beforeLoad, false);
    audio.addEventListener('canplay', afterLoad, false);
    audio.addEventListener('ended', ended, false);

    // change background image
    // $('#background').css('background-image', 'url(./img/bg' + random + '.webp)');
  }

  loadMusic(currentTrack);
  $('.playback').on('click', function(){
    if ($(this).hasClass('playing')){
      pause();
    } else {
      play();
    }
  });
  $('.rewind').on('click', function(){
    if (shuffle === 'true'){
      shufflePlay();
    } else {
      switchTrack(--currentTrack);
    }
  });
  $('.fastforward').on('click', function(){
    if (shuffle === 'true'){
      shufflePlay();
    } else {
      switchTrack(++currentTrack);
    }
  });
  $('#playlist li').each(function(i){
    var _i = i;
    $(this).on('click', function(){
      switchTrack(_i);
    });
  });

  if (shuffle === 'true') $('.shuffle').addClass('enable');
  if (repeat == 1){
    $('.repeat').addClass('once');
  } else if (repeat == 2){
    $('.repeat').addClass('all');
  }

  $('.repeat').on('click', function(){
    if ($(this).hasClass('once')){
      repeat = localStorage.repeat = 2;
      $(this).removeClass('once').addClass('all');
    } else if ($(this).hasClass('all')){
      repeat = localStorage.repeat = 0;
      $(this).removeClass('all');
    } else {
      repeat = localStorage.repeat = 1;
      $(this).addClass('once');
    }
  });

  $('.shuffle').on('click', function(){
    if ($(this).hasClass('enable')){
      shuffle = localStorage.shuffle = 'false';
      $(this).removeClass('enable');
    } else {
      shuffle = localStorage.shuffle = 'true';
      $(this).addClass('enable');
    }
  });
  // 监听键盘事件
  $(document).keydown(function(event){ 
    if(event.keyCode == 37){ 
      if (shuffle === 'true'){
          shufflePlay();
      } else {
          switchTrack(--currentTrack);
      }
    } else if (event.keyCode == 39){ 
      if (shuffle === 'true'){
        shufflePlay();
      } else {
        switchTrack(++currentTrack);
      }
    } else if (event.keyCode == 32){
      event.preventDefault();
      if ($('.playback').hasClass('playing')){
        pause();
      } else {
        play();
      }
    }
  }); 
})(jQuery);