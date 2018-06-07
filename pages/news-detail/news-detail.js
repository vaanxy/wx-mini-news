// pages/news-detail/news-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsId: 0,
    newsDetail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   * 存储新闻列表页面传递过来的newsId,
   * 并调用getNewsDetail函数从网络获取数据
   */
  onLoad: function (options) {
    let newsId = options.newsId;
    console.log(newsId);
    if (newsId) {
      this.setData({
        newsId: newsId
      });
    }

  },

  /**
   * 下拉刷新，调用getNewsDetail函数重新取新闻详情信息
   */
  onPullDownRefresh: () => {
  
  },
  /**
   * 调用接口, 根据newsId获取新闻详情信息
   */
  getNewsDetail() {
    
  }
})