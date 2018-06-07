//index.js
const categoryMap = {
  gn: '国内',
  gj: '国际',
  cj: '财经',
  yl: '娱乐',
  js: '军事',
  ty: '体育',
  qt: '其他'
}
Page({
  data: {
    category: ['国内', '国际', '财经', '娱乐', '军事', '体育', '其他'],
    selectedCategory: '国内'
  },
  onLoad() {
    // this.setData
  },
  onTapCategory(event) {
    console.log(event);
    let category = event.currentTarget.dataset['category'];
    this.setData({
      selectedCategory: category
    });
  }

})
