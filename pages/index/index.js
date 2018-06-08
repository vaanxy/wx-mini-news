//index.js

// 所有新闻类别标签的数据
const categories = [
  { code: 'gn', name: '国内' },
  { code: 'gj', name: '国际' },
  { code: 'cj', name: '财经' },
  { code: 'yl', name: '娱乐' },
  { code: 'js', name: '军事' },
  { code: 'ty', name: '体育' },
  { code: 'other', name: '其他' }
];

Page({
  data: {
    categories: categories,
    selectedCategoryCode: categories[0].code, //当前选中的新闻类别，默认选中第一个
    newsListMap: {},
    hotNews: {
      title: '加载中...',
      source: '',
      date: '',
      firstImage: '/images/cloudy-bg.png'
    },
    swiperHeight: 0
  },

  /**
   * 页面加载后，通过getNewsList函数从网络获取当前选中类别的新闻列表
   */
  onLoad() {
    this.setSwiperHeight();
    this.initNewsListMap();
    this.getNewsList();

  },

  /**
   * 初始化新闻类别和新闻列表的映射字典
   */
  initNewsListMap() {
    let newsList = [];
    let newsListMap = {};
    this.data.categories.forEach((category) => {
      newsListMap[category.code] = {
        newsList: [],
        hotNews: {
          title: '加载中...',
          source: '',
          date: '',
          firstImage: '/images/cloudy-bg.png'
        }
      };
    });
    this.setData({
      newsListMap: newsListMap
    });
  },

  /**
   * 由于swpier默认高度是150px,
   * 为了让swiper能够填充整个屏幕的高度，
   * 需要获取屏幕尺寸，动态计算swiper应该占用的高度(rpx)
   */
  setSwiperHeight() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          // 89为新闻类别选项卡的高度
          swiperHeight: 750 / res.windowWidth * res.windowHeight - 89
        })
      },
    });
  },

  /**
   * 点击新闻类别选项卡时，切换新闻类别选项卡，
   * 并重新调用onTapCategory函数获取新选中类别的新闻列表数据
   */
  onTapCategory(event) {
    console.log(event);
    let categoryCode = event.currentTarget.dataset['categoryCode'];
    this.setData({
      selectedCategoryCode: categoryCode
    });
    this.getNewsList();
  },

  /**
   * 下拉刷新，重新调用getNewsList函数加载当前类别的新闻列表信息，
   * 并需要传入回调函数，在网络请求完成后(无论成功/失败)停止下拉刷新
   */
  onPullDownRefresh() {
    this.getNewsList(() => wx.stopPullDownRefresh());
  },

  /**
   * @param: cb 回调函数, 
   * 若传入该函数参数，则会在网络获取数据完成后(无论成功/失败)执行,
   */
  getNewsList(cb) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.selectedCategoryCode
      },
      success: (res) => {
        console.log(res.data.result);
        let newsList = [];
        // 构造用于显示的新闻列表
        res.data.result.forEach(news => {
          let date = new Date(news.date);
          newsList.push({
            id: news.id,
            title: news.title,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            source: news.source === '' ? '未知来源' : news.source,
            firstImage: news.firstImage ? news.firstImage : '/images/sunny-bg.png'
          });
        });
        let newsListMap = this.data.newsListMap;
        newsListMap[this.data.selectedCategoryCode] = {
          newsList: newsList.slice(1),
          hotNews: newsList[0]
        }
        this.setData({
          newsListMap: newsListMap
        });
      },
      complete: () => {
        cb && cb();
      }
    });
  },

  bindChange(event) {
    console.log(event);
    // https://developers.weixin.qq.com/miniprogram/dev/component/swiper.html 
    // Bug & Tip:
    // 如果在 bindchange 的事件回调函数中使用 setData 改变 current 值，则有可能导致 setData 被不停地调用，
    // 因而通常情况下请在改变 current 值前检测 source 字段来判断是否是由于用户触摸引起。
    //
    // 通过Tap点击新闻类别选项卡时已经setData并获取网络数据，
    // 此时event.detail.source === '', 不需要再次重复setData及获取网络数据
    if (event.detail.source === 'touch') {
      this.setData({
        selectedCategoryCode: event.detail.currentItemId
      });
      this.getNewsList();
    } 

  },

  /**
   * 跳转到对应newsId的新闻详情页面
   */
  toNewsDetail(event) {
    let newsId = event.currentTarget.dataset.id;
    console.log(newsId);
    wx.navigateTo({
      url: '/pages/news-detail/news-detail?newsId=' + newsId,
    });
  }
});
