$(function () {

    let winHeight = $(window).height();
    // console.log('winHeight==>', winHeight);


    // 监听窗口变化
    $(window).resize(function () {

        // console.log('aaa');
        let thisHeight = $(this).height();
        if (winHeight - thisHeight > 140){
            $('.future').css({
                position:'static'
            })
        }
        else{
            $('.future').css({
                position:'fixed'
            })
        }
    })

    //点击展开隐藏
    $('.future-top').on('click', function () {
        if ($(this).data('name') == 0) {
            $('.future').css({
                borderRadius: '0.1rem',
                background: '#ddd',
            });

            $('.conceal').removeClass('hide').css({
                height: '3.25rem'
            })

            $(this).data('name', 1).text('关闭未来7天天气').css({
                color: '#555'
            })
        } else {
            $('.conceal').addClass('hide').css({
                height: '0'
            })
            $(this).data('name', 0).text('查看未来7天天气').css({
                color: '#fff',
                background: ''
            })
            $('.future').css({

                background: '',
            });
        }
    })


    //获取当前城市天气
    function getWeather(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/now',
            data: {
                location: city,
                key: '6ea57e1bb8e4479797b6e0dd61c16b88',
            },

            success(data) {


                let message = data.HeWeather6[0].now;
                // console.log('message==>', message);

                $('.temperature-top>.tmp').text(message.tmp);
                $('.temperature-bottom>div>.nowcond_txt').text(message.cond_txt);

                $('.wind>.windone').text(message.wind_sc + '级');
                $('.wind>.windtwo').text(message.wind_dir);
                $('.visibility>.visibilityone').text(message.vis + 'km');

                $('.humidityone').text(message.hum + '%');

                //获取经度
                let lg = data.HeWeather6[0].basic.lon;
                // console.log('lng==>', lg);

                //获取纬度
                let lt = data.HeWeather6[0].basic.lat;
                // console.log('lat==>', lt);
                //获取分钟降水
                getminurain(lg, lt);

                //获取24小时的天气
                gethourWeather(city);

                //获取未来7天的天气
                getsevenWearther(city);

            }
        })
    }


    //获取24小时的天气
    function gethourWeather(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/hourly',
            data: {
                location: city,
                key: '6ea57e1bb8e4479797b6e0dd61c16b88',
            },
            success(data) {
                let hourly = data.HeWeather6[0].hourly
                // console.log('hourly==>', hourly);

                $('.hourWeather-bottom').css({
                    width: (hourly.length * 0.9) + 'rem',
                })

                for (let i = 0; i < hourly.length; i++) {
                    let $str = $(`<div class="weatherBox">
                    <div class="time">
                        <span>${hourly[i].time.slice(-5)}</span>
                    </div>
                    <div class="weatherText">
                        <span>${hourly[i].cond_txt}</span>
                    </div>
                    <div class="img">
                        <img id="auto-img" src="./images/${hourly[i].cond_code}.png" alt="">
                    </div>
                    <div class="number">
                        <span>${hourly[i].tmp}°</span>
                    </div>
                </div>`);

                    $('.hourWeather-bottom').append($str);
                }

            }
        })
    };


    //声明一个数组来保存星期几，方便判断
    let arr = ['日', '一', '二', '三', '四', '五', '六'];


    //获取未来7天的天气
    function getsevenWearther(city) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/forecast',
            data: {
                location: city,
                key: '6ea57e1bb8e4479797b6e0dd61c16b88',
            },
            success(data) {
                // console.log('data==>', data);
                let forecast = data.HeWeather6[0].daily_forecast;
                // console.log('forecast==>', forecast);

                //设置当天的最低温度和最高温度
                $('.temperature-bottom>div>.nowfl').text(forecast[0].tmp_min + '°~' + forecast[0].tmp_max + '°');

                //获取当前的时间判断是白天还是夜晚;如果当前时间大于日出时间并且小于日落时间就是白天，否则就是夜晚
                let nowtime = new Date(data.HeWeather6[0].update.loc).getHours();
                // console.log('nowtime==>', nowtime);

                // console.log('dt==>', dt[104].src);

                for (let i = 0; i < forecast.length; i++) {
                    // console.log('dt==>', forecast[i].sr.slice(0, 2));
                    let $str = `<li>
                    <div class="date">
                        <span>周</span><span class="xing">${arr[new Date(forecast[i].date).getDay()]}</span>&nbsp;<span></span class="day">${forecast[i].date.slice(-5)}</span>
                    </div>
                    <div class="conceal-img">
                        <div class="img">
                            <img src="./images/${nowtime >= forecast[i].sr.slice(0, 2) && nowtime < forecast[i].ss.slice(0, 2) ? forecast[i].cond_code_d : forecast[i].cond_code_n}.png" alt="">
                        </div>
                        <div class="conceal-text">
                            <span>${nowtime >= forecast[i].sr.slice(0, 2) && nowtime < forecast[i].ss.slice(0, 2) ?forecast[i].cond_txt_d : forecast[i].cond_txt_n}</span>
                        </div>

                    </div>
                    <div class="future-number">
                        <span>${forecast[i].tmp_min+'~'+forecast[i].tmp_max}</span>
                    </div>
                    </li>`;

                    $('.conceal').append($str);
                }

            }
        })
    };

    //腾讯定位获取当前位置
    $.ajax({
        type: 'get',
        url: 'https://apis.map.qq.com/ws/location/v1/ip',

        dataType: 'jsonp',

        data: {
            key: 'I4EBZ-7LR6P-VDSDX-VLRGO-53A7F-KBBY3',
            output: 'jsonp'
        },

        success: function (data) {
            // console.log('data==>', data);
            let city = data.result.ad_info.city;

            $('.city>span').text(city);

            ///获取当前城市天气
            getWeather(city);


        }
    })

    //获取分钟降水
    function getminurain(lng, lat) {
        $.ajax({
            type: 'get',
            url: 'https://api.heweather.net/s6/weather/grid-minute',
            data: {

                key: '6ea57e1bb8e4479797b6e0dd61c16b88',
                location: lng + ',' + lat

            },
            success(data) {
                // console.log('data==>', data);
                if (data.HeWeather6[0].status == 'invalid param') {
                    $('.warn>span').text('暂无当前城市的天气预报');
                } else {
                    $('.warn>span').text(data.HeWeather6[0].grid_minute_forecast.txt);
                }


            }
        })
    };


    function createCity() {
        //获取输入框输入的值
        let city = $('.search>input').val().trim();
        // console.log('city==>', city);

        //判断输入是否为空
        if (!city) {

            return;
        }

        //设置城市
        $('.city>span').text(city);

        $('.warn>span').text('未来6小时' + city + '暴雨预警');

        //清空上一个城市的24小时天气
        $('.hourWeather-bottom').empty();

        //清空上一个城市保留的7天天气
        $('.conceal').empty();

        //获取当前城市的天气
        getWeather(city);


        //清空输入框内容
        $('.search>input').val('');
    }


    //搜索城市
    $('.search>img').on('click', function () {

        createCity();
    })

    //回车键搜索城市
    $('.search>input').on('keydown', function (e) {
        if (e.keyCode == 13) {

            createCity();

            //阻止浏览器默认行为
            e.preventDefault();

            //失去焦点
            this.blur();
        }
    })


})