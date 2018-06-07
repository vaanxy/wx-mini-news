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
    selectedCategory: categories[0], //当前选中的新闻类别，默认选中第一个
    newsList: [],
    hotNews: {
      title: '加载中...',
      source: '',
      date: '',
      firstImage: '/images/cloudy-bg.png'
    }
  },

  /**
   * 页面加载后，通过getNewsList函数从网络获取当前选中类别的新闻列表
   */
  onLoad() {
    this.getNewsList();
  },

  /**
   * 点击新闻类别选项卡时，切换新闻类别选项卡，
   * 并重新调用onTapCategory函数获取新选中类别的新闻列表数据
   */
  onTapCategory(event) {
    console.log(event);
    let category = event.currentTarget.dataset['category'];
    this.setData({
      selectedCategory: category
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
        type: this.data.selectedCategory.code
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
        this.setData({
          newsList: newsList.slice(1),
          hotNews: newsList[0]
        });
      },
      complete: () => {
        cb && cb();
      }
    });
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
