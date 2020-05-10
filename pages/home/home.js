import {
  getMultiData,
  getGoodsData
} from '../../service/home'

const TOP_DISTINCT = 1000
const types = ['pop', 'new', 'sell'];
Page({
  data: {
    banners: [],
    recommends: [],
    titles: [],
    goods: {
      "pop": {
        page: 0,
        list: []
      },
      "new": {
        page: 0,
        list: []
      },
      "sell": {
        page: 0,
        list: []
      }
    },
    currentType: 'pop',
    showBackTop: false,
    isTabFiexd: false,
    tabScrollTop:0
  },
  //初始化
  onLoad: function (options) {
    // 请求轮播图及推荐数据
    this._getMultiData()
    // tab-control
    const titles = ['流行', '新款', '精选']
    this.setData({
      titles
    })
    // 商品请求数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')
  },
  // -------------网络请求函数-----------
  _getMultiData() {
    getMultiData().then(res => {
      //  取出轮播图及推荐数据
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      // 将banners和recomnends放入data中
      this.setData({
        banners,
        recommends
      })
    })
  },
  _getGoodsData(type) {
    // 1 获取页码
    const page = this.data.goods[type].page + 1
    // 2 发送网络请求
    getGoodsData(type, page).then(res => {
      // 2.1 取出数据
      const list = res.data.data.list
      //  2.2 将数据设置到对应的type 的list中
      const oldList = this.data.goods[type].list
      oldList.push(...list)
      // 2.3 将数据设置到goods中的list中
      const typekey = `goods.${type}.list`;
      const pagekey = `goods.${type}.page`
      this.setData({
        [typekey]: oldList,
        [pagekey]: page
      })
    })

  },
  // -------------事件监听函数-----------
  handleclickControl(event) {
    // 取出index
    const index = event.detail.index
    const type = types[index];
    this.setData({
      currentType: type
    })
  },
  handleImageLoad() {
    wx.createSelectorQuery().select("#tab-control").boundingClientRect(rect =>{
      this.data.tabScrollTop = rect.top
    }).exec()
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getGoodsData(this.data.currentType)
  },
  onPageScroll(options) {
    const scrollTop = options.scrollTop;
    const flag1 = scrollTop >= TOP_DISTINCT;
    if (flag1 != this.data.showBackTop) {
      this.setData({
        showBackTop: flag1
      })
    }
  
    const flag2 = scrollTop >= this.data.tabScrollTop
    if(flag2 != this.data.isTabFiexd){
      this.setData({
        isTabFiexd: flag2
      })
    }
  }

})