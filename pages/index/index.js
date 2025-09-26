const { calculateFertilizer } = require('../../utils/fertilizer')

Page({
  data: {
    // 作物选项
    crops: ['水稻', '油菜', '玉米'],
    cropIndex: 0,
    
    // 表单数据
    formData: {
      crop: '水稻',
      targetYield: 500,
      soilN: '',
      soilP: '',
      soilK: '',
      area: 1.0
    },
    
    // 输入验证
    errors: {}
  },

  onLoad() {
    this.updateDefaultYield()
  },

  // 作物选择变化
  onCropChange(e) {
    const index = e.detail.value
    const crop = this.data.crops[index]
    
    this.setData({
      cropIndex: index,
      'formData.crop': crop
    })
    
    this.updateDefaultYield()
  },

  // 更新默认目标产量
  updateDefaultYield() {
    const app = getApp()
    const crop = this.data.formData.crop
    const defaultYield = app.globalData.cropConfig[crop].defaultYield
    
    this.setData({
      'formData.targetYield': defaultYield
    })
  },

  // 输入框变化处理
  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    
    this.setData({
      [`formData.${field}`]: value,
      [`errors.${field}`]: '' // 清除错误提示
    })
  },

  // 表单验证
  validateForm() {
    const { formData } = this.data
    const errors = {}
    let isValid = true

    // 验证土壤养分值
    if (!formData.soilN || formData.soilN <= 0) {
      errors.soilN = '请输入有效的土壤速效氮值'
      isValid = false
    }
    
    if (!formData.soilP || formData.soilP <= 0) {
      errors.soilP = '请输入有效的土壤速效磷值'
      isValid = false
    }
    
    if (!formData.soilK || formData.soilK <= 0) {
      errors.soilK = '请输入有效的土壤速效钾值'
      isValid = false
    }

    // 验证目标产量
    if (!formData.targetYield || formData.targetYield <= 0) {
      errors.targetYield = '请输入有效的目标产量'
      isValid = false
    }

    // 验证种植面积
    if (!formData.area || formData.area <= 0) {
      errors.area = '请输入有效的种植面积'
      isValid = false
    }

    this.setData({ errors })
    return isValid
  },

  // 生成施肥方案
  generatePlan() {
    if (!this.validateForm()) {
      wx.showToast({
        title: '请检查输入信息',
        icon: 'none'
      })
      return
    }

    const { formData } = this.data
    
    try {
      // 转换数据类型
      const params = {
        crop: formData.crop,
        targetYield: parseFloat(formData.targetYield),
        soilN: parseFloat(formData.soilN),
        soilP: parseFloat(formData.soilP),
        soilK: parseFloat(formData.soilK),
        area: parseFloat(formData.area)
      }

      // 计算施肥方案
      const result = calculateFertilizer(params)
      
      // 跳转到结果页
      wx.navigateTo({
        url: `/pages/result/result?data=${encodeURIComponent(JSON.stringify(result))}`
      })
      
    } catch (error) {
      console.error('计算施肥方案失败:', error)
      wx.showToast({
        title: '计算失败，请重试',
        icon: 'none'
      })
    }
  }
})