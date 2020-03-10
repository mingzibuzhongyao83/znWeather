window.onload = function () {

    function windowinit() {
        //以iphone6屏为标准 375px
        let stadWidth = 375;

        //获取屏幕的宽度
        let screenWidth = screen.width;

        let fontSize = 0;

        //设置1rem等于100px
        if (screenWidth >= 1200) {
            fontSize = 200;
          } else {
            fontSize = screenWidth / stadWidth * 100;
          }
        let html = document.getElementsByTagName('html')[0];
        html.style.fontSize = fontSize + 'px';

    };

    //调用
    windowinit();

    //保存所有定时器序号
    let timers = [];
    //窗口发生变化时触发
    window.onresize = function () {
        //函数节流，防止函数抖动
        let timer = setTimeout(function () {
            //清除后续定时器，只保留第一个定时器，减少setRem()函数执行次数
            for (var i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }
            timers = [];
            // console.log('aaa');
            windowinit();
        }, 500)

        timers.push(timer);

    }

}