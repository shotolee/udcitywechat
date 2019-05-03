//构建日期/星期转换
const dayMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六' ]

Page({
  //一周的天数对应
  data: {
    weekWeather:[1,2,3,4,5,6,7],
    city: "广州市"
  },
  //页面加截 getWeekWeather 函数
  onLoad(options) {
    this.setData({
      city: options.city
    })
    this.getWeekWeather()
  },

  //下拉刷新
  onPullDownRefresh(){
    //如果触发回调函数，则立即停止页面刷新
    this.getWeekWeather(()=>{
      wx.stopPullDownRefresh()
    })
  },

  //带回调函数的函数，获取一周天气数据。
  getWeekWeather(callback) {
    wx.request({
      //请求接品URL
      url: 'https://test-miniprogram.com/api/weather/future',
      //data 参数，时间与日期
      data: {
        //获取当前日期与时间
        time: new Date().getTime(),
        //城市参数
        city: this.data.city
      },
        //数据成功后，将数据传递给 setWeekWeather 函数
      success: res=> {
        //先赋值给 result
        let result = res.data.result
       // 再将 result 实参传递给 setWeekWeather 形参
        this.setWeekWeather(result)
      },
      //回调参数，成功时快速停止页面刷新。
      complete: ()=>{
        //回调为true并眀执行回调函数
        callback && callback()
      }
    })
  },

  //setWeekWeahter 函数。
  //将result传递进入函数
  setWeekWeather(result) {
    //设置空数组，获取一周数据
    let weekWeather = []
    //设置循环。
    for (let i = 0; i < 7; i++) {
      //设置 date 变量，得到当前日期
      let date = new Date()
      //用 setDat有方法，计算得到未来 7 天的 date
      date.setDate(date.getDate() + i)
      //向数组追加得到的值。将 weekWeather 当成一个对象（或散列，我还没明白）存入数组。
      weekWeather.push({
        //星期
        day: dayMap[date.getDay()],
        //日期. jsp里getYear 已经被废止，因为只能从 1900-1999. getmonth（）会得到从 0-11，所以要加 1
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        // 直接从 result 里得到最小温度和最大温度。
        temp: `${result[i].minTemp}° - ${result[i].maxTemp}`,
        //计算图标路径
        iconPath: '/images/' + result[i].weather + '-icon.png'
      })
    }
    //转换当前星期为：“”今天
    weekWeather[0].day = '今天'
    //用 SetData方法，将值传给 page 里的 Data
    this.setData({
      weekWeather
    
    })
  }
})