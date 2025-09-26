/**
 * 施肥计算工具函数
 */

// 土壤养分等级判断标准 (mg/kg)
const NUTRIENT_LEVELS = {
  N: { low: 100, medium: 150, high: 200 },
  P: { low: 20, medium: 40, high: 60 },
  K: { low: 100, medium: 150, high: 200 }
}

/**
 * 计算施肥方案
 * @param {Object} params 输入参数
 * @param {string} params.crop 作物类型
 * @param {number} params.targetYield 目标产量 kg/亩
 * @param {number} params.soilN 土壤速效氮 mg/kg
 * @param {number} params.soilP 土壤速效磷 mg/kg
 * @param {number} params.soilK 土壤速效钾 mg/kg
 * @param {number} params.area 种植面积 亩
 * @returns {Object} 施肥方案结果
 */
function calculateFertilizer(params) {
  const app = getApp()
  const { crop, targetYield, soilN, soilP, soilK, area } = params
  
  // 获取作物配置
  const cropConfig = app.globalData.cropConfig[crop]
  if (!cropConfig) {
    throw new Error('不支持的作物类型')
  }
  
  // 计算养分需求量 (根据目标产量调整)
  const yieldRatio = targetYield / cropConfig.defaultYield
  const nNeed = cropConfig.nRequirement * yieldRatio
  const pNeed = cropConfig.pRequirement * yieldRatio
  const kNeed = cropConfig.kRequirement * yieldRatio
  
  // 计算土壤供应量 (简化算法：mg/kg转换为kg/亩供应量)
  const nSupply = soilN * 0.15 / 1000 // 简化转换系数
  const pSupply = soilP * 0.1 / 1000
  const kSupply = soilK * 0.12 / 1000
  
  // 计算需补充的纯养分量
  const nSupplement = Math.max(0, nNeed - nSupply)
  const pSupplement = Math.max(0, pNeed - pSupply)
  const kSupplement = Math.max(0, kNeed - kSupply)
  
  // 计算肥料用量
  const fertilizerContent = app.globalData.fertilizerContent
  const ureaAmount = nSupplement / fertilizerContent.urea
  const superphosphateAmount = pSupplement / fertilizerContent.superphosphate
  const potassiumChlorideAmount = kSupplement / fertilizerContent.potassiumChloride
  
  // 生成缺素诊断
  const diagnosis = generateDiagnosis(soilN, soilP, soilK)
  
  // 生成施肥建议
  const advice = generateAdvice(crop, cropConfig.nRatio)
  
  return {
    crop,
    targetYield,
    area,
    supplements: {
      N: parseFloat(nSupplement.toFixed(1)),
      P: parseFloat(pSupplement.toFixed(1)),
      K: parseFloat(kSupplement.toFixed(1))
    },
    fertilizers: {
      urea: {
        perMu: parseFloat(ureaAmount.toFixed(1)),
        total: parseFloat((ureaAmount * area).toFixed(1))
      },
      superphosphate: {
        perMu: parseFloat(superphosphateAmount.toFixed(1)),
        total: parseFloat((superphosphateAmount * area).toFixed(1))
      },
      potassiumChloride: {
        perMu: parseFloat(potassiumChlorideAmount.toFixed(1)),
        total: parseFloat((potassiumChlorideAmount * area).toFixed(1))
      }
    },
    diagnosis,
    advice
  }
}

/**
 * 生成缺素诊断
 */
function generateDiagnosis(soilN, soilP, soilK) {
  const diagnosis = []
  
  if (soilN < NUTRIENT_LEVELS.N.low) {
    diagnosis.push(`⚠️ 氮素偏低（${soilN} mg/kg），可能导致植株矮小、分蘖少，建议增施氮肥`)
  } else if (soilN > NUTRIENT_LEVELS.N.high) {
    diagnosis.push(`✅ 氮素充足（${soilN} mg/kg），植株生长良好`)
  }
  
  if (soilP < NUTRIENT_LEVELS.P.low) {
    diagnosis.push(`⚠️ 磷素偏低（${soilP} mg/kg），可能影响根系发育和开花，建议增施磷肥`)
  } else if (soilP > NUTRIENT_LEVELS.P.high) {
    diagnosis.push(`✅ 磷素充足（${soilP} mg/kg），根系发育良好`)
  }
  
  if (soilK < NUTRIENT_LEVELS.K.low) {
    diagnosis.push(`⚠️ 钾素偏低（${soilK} mg/kg），可能导致抗逆性差、籽粒不饱满，建议增施钾肥`)
  } else if (soilK > NUTRIENT_LEVELS.K.high) {
    diagnosis.push(`✅ 钾素充足（${soilK} mg/kg），抗逆性强`)
  }
  
  return diagnosis
}

/**
 * 生成施肥建议
 */
function generateAdvice(crop, nRatio) {
  const baseRatio = Math.round(nRatio.base * 100)
  const topdressRatio = Math.round(nRatio.topdress * 100)
  
  return [
    `氮肥：${baseRatio}%作基肥，${topdressRatio}%在分蘖期追施`,
    `磷钾肥：全部作基肥一次性施用`,
    `建议配合腐熟有机肥1000-1500kg/亩，提高土壤活性`,
    `注意根据天气和作物长势适当调整用量`
  ].join('\n')
}

module.exports = {
  calculateFertilizer
}