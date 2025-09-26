App({
  onLaunch() {
    console.log('湘土施肥宝启动')
  },
  
  globalData: {
    // 作物基础参数配置
    cropConfig: {
      '水稻': {
        defaultYield: 500,
        nRequirement: 18, // kg/亩
        pRequirement: 8,  // kg/亩 P2O5
        kRequirement: 12, // kg/亩 K2O
        nRatio: { base: 0.6, topdress: 0.4 }
      },
      '油菜': {
        defaultYield: 200,
        nRequirement: 12,
        pRequirement: 6,
        kRequirement: 10,
        nRatio: { base: 0.7, topdress: 0.3 }
      },
      '玉米': {
        defaultYield: 600,
        nRequirement: 20,
        pRequirement: 10,
        kRequirement: 15,
        nRatio: { base: 0.5, topdress: 0.5 }
      }
    },
    
    // 肥料养分含量
    fertilizerContent: {
      urea: 0.46,        // 尿素含氮量
      superphosphate: 0.12, // 过磷酸钙含P2O5
      potassiumChloride: 0.60 // 氯化钾含K2O
    }
  }
})