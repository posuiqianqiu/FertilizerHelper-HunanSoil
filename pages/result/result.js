Page({
  data: {
    result: null,
    showAdvice: true // 控制施肥建议展开/收起
  },

  onLoad(options) {
    try {
      const data = JSON.parse(decodeURIComponent(options.data))
      this.setData({ result: data })
      
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: `${data.crop}施肥方案`
      })
    } catch (error) {
      console.error('解析结果数据失败:', error)
      wx.showToast({
        title: '数据加载失败',
        icon: 'none'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 切换施肥建议显示
  toggleAdvice() {
    this.setData({
      showAdvice: !this.data.showAdvice
    })
  },

  // 重新计算
  recalculate() {
    wx.navigateBack()
  },

  // 复制方案文本
  copyResult() {
    const { result } = this.data
    
    let text = `🌾 ${result.crop}施肥方案\n`
    text += `目标产量：${result.targetYield}kg/亩 × ${result.area}亩\n\n`
    
    text += `📊 推荐施肥量：\n`
    text += `氮肥(N)：${result.supplements.N}kg/亩 → 尿素 ${result.fertilizers.urea.perMu}kg/亩 (总计${result.fertilizers.urea.total}kg)\n`
    text += `磷肥(P₂O₅)：${result.supplements.P}kg/亩 → 过磷酸钙 ${result.fertilizers.superphosphate.perMu}kg/亩 (总计${result.fertilizers.superphosphate.total}kg)\n`
    text += `钾肥(K₂O)：${result.supplements.K}kg/亩 → 氯化钾 ${result.fertilizers.potassiumChloride.perMu}kg/亩 (总计${result.fertilizers.potassiumChloride.total}kg)\n\n`
    
    if (result.diagnosis.length > 0) {
      text += `🔍 土壤诊断：\n`
      result.diagnosis.forEach(item => {
        text += `${item}\n`
      })
      text += `\n`
    }
    
    text += `💡 施肥建议：\n${result.advice}\n\n`
    text += `⚠️ 本方案仅供参考，请结合实际情况调整\n`
    text += `📱 来源：湘土施肥宝小程序`

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        })
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        })
      }
    })
  },

  // 分享功能
  onShareAppMessage() {
    const { result } = this.data
    return {
      title: `${result.crop}施肥方案 - 湘土施肥宝`,
      path: '/pages/index/index',
      imageUrl: '' // 可以设置分享图片
    }
  }
})