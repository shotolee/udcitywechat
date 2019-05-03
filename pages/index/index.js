const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require
('../../libs/qqmap-wx-jssdk.js')

Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '',
    hourlyWeather: [],
    todayDate: '',
    todayTemp: '',
  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  onLoad(){
    this.qqmapsdk = new QQMapWX({
      key: 'YZBBZ-YKYWD-GMB4B-POGVY-NYF3J-D3F45'
    })
    this.getNow()
  },
  getNow(callback){
   wx.request({
     url: 'https://test-miniprogram.com/api/weather/now',
     data: {
       city: '西安市'
     },
     success: res=> {
       console.log(res)
       let result = res.data.result
       this.setNow(result)
       this.setHourlyWeather(result)
       this.setTodayWeahter(result)
     },
     complete: ()=>{
       callback && callback()
     }
   })
  },

  //获取当前天气
  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    console.log(temp, weather)
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png',
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  //获取未来几小时的天气
  setHourlyWeather(result){
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setTodayWeahter(result){
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
      //  getMonth 方法取月份，取到的是 从 0 开始的值，0 表示 1 月。
    })
  },
  onTapDayWeahter(){
    wx.navigateTo({
      url: '/pages/list/list',
    })
  },

  //点击获取城市
  onTapLocation() {
    wx.getLocation({
      //匿名函数中，调用mapsdk,获取坐标位置数据
      success: res=> {
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          //获取成功坐标位置数据后，调用坐标转城市方法获得 city名称。
          success: res=> {
            let city = res.result.address_component.city
            console.log(city)
          }
        })
      },
    })
  }

})