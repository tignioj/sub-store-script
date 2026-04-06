async function operator(proxies = [], targetPlatform, context) {
  const $ = $substore

  // 你的订阅参数
  const serviceId = '你的服务ID' // 需要替换为你的 JustMySocks 服务 ID
  const userId = '你的用户ID' // 需要替换为你的 JustMySocks 用户 ID

  try {
    // 获取流量信息
    const { body, statusCode } = await $.http.get({
      url: `https://justmysocks6.net/members/getbwcounter.php?service=${serviceId}&id=${userId}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    })

    if (statusCode === 200) {
      // 解析返回的 JSON 数据
      // 格式: {"monthly_bw_limit_b":500000000000,"bw_counter_b":12300042346,"bw_reset_day_of_month":4}
      const data = JSON.parse(body)

      const monthlyLimit = data.monthly_bw_limit_b || 0   // 月流量总额（字节）
      const bwCounter = data.bw_counter_b || 0            // 已使用流量（字节）
      const resetDay = data.bw_reset_day_of_month || 1    // 重置日期

      // 计算下一次重置时间（Unix 时间戳）
      const now = new Date()
      let resetDate = new Date(now.getFullYear(), now.getMonth(), resetDay, 0, 0, 0)

      // 如果当前已过本月的重置日，则计算下个月的重置日
      if (now.getDate() >= resetDay) {
        resetDate = new Date(now.getFullYear(), now.getMonth() + 1, resetDay, 0, 0, 0)
      }

      const expireTimestamp = Math.floor(resetDate.getTime() / 1000)

      // 构造 subscription-userinfo 响应头
      // 格式: upload=字节数; download=字节数; total=总字节数; expire=Unix时间戳
      // 注意：该接口不区分上下行，我们将所有已用流量算作 download
      const userInfo = `upload=0; download=${bwCounter}; total=${monthlyLimit}; expire=${expireTimestamp}`

      // 设置响应头
      if ($options) {
        $options._res = {
          headers: {
            'subscription-userinfo': userInfo
          }
        }
      }

      // 打印日志（可在 Sub-Store 控制台查看）
      const usedGB = (bwCounter / 1073741824).toFixed(2)
      const totalGB = (monthlyLimit / 1073741824).toFixed(2)
      const resetDateStr = resetDate.toISOString().split('T')[0]

      $.info(`✅ 流量信息已更新`)
      $.info(`   已用: ${usedGB} GB / ${totalGB} GB`)
      $.info(`   重置日期: ${resetDateStr}`)
      $.info(`   subscription-userinfo: ${userInfo}`)
    } else {
      $.error(`❌ 获取流量信息失败: HTTP ${statusCode}`)
    }
  } catch (error) {
    $.error(`❌ 请求失败: ${error.message}`)
    // 即使失败也继续返回节点，不影响订阅使用
  }

  return proxies
}
