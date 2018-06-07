//index.js
const categories = [
  { code: 'gn', name: '国内' },
  { code: 'gj', name: '国际' },
  { code: 'cj', name: '财经' },
  { code: 'yl', name: '娱乐' },
  { code: 'js', name: '军事' },
  { code: 'ty', name: '体育' },
  { code: 'other', name: '其他' }
]
Page({
  data: {
    categories: categories,
    selectedCategory: categories[0],
    newsList: [],
    hotNews: {
      title: '加载中...',
      source: '',
      date: '',
      firstImage: '/Images/cloudy-bg.png'
    }
  },
  onLoad() {
    this.getNewsList();
  },
  onTapCategory(event) {
    console.log(event);
    let category = event.currentTarget.dataset['category'];
    this.setData({
      selectedCategory: category
    });
    this.getNewsList();
  },
  onPullDownRefresh() {
    this.getNewsList(() => wx.stopPullDownRefresh());
  },
  getNewsList(cb) {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.selectedCategory.code
      },
      success: (res) => {
        console.log(res.data.result);
        let newsList = [];
        res.data.result.forEach(news => {
          let date = new Date(news.date);
          newsList.push({
            title: news.title,
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
            source: news.source === '' ? '未知来源' : news.source,
            firstImage: news.firstImage
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
    })
  }
});
