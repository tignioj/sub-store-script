async function operator(proxies = [], targetPlatform, context) {
  const $ = $substore

  // 参数优先级：脚本参数 > URL 参数 > 订阅 URL 参数 > 默认值
  let serviceId = 'YOUR_SERVICE_ID' // 默认 service ID（请替换或通过参数传递）
  let userId = 'YOUR_USER_ID' // 默认 user ID（请替换或通过参数传递）

  try {
    // 1. 尝试从脚本参数获取（Sub-Store 界面配置）
    if ($arguments?.service) {
      serviceId = $arguments.service
      $.info(`✓ 从脚本参数获取 service: ${serviceId}`)
    }
    if ($arguments?.id) {
      userId = $arguments.id
      $.info(`✓ 从脚本参数获取 id: ${userId}`)
    }

    // 2. 尝试从 URL 参数获取（通过 $options 传递）
    if ($options?.service) {
      serviceId = $options.service
      $.info(`✓ 从 $options 获取 service: ${serviceId}`)
    }
    if ($options?.id) {
      userId = $options.id
      $.info(`✓ 从 $options 获取 id: ${userId}`)
    }

    // 3. 从订阅源 URL 中自动提取（最方便：订阅链接本身包含 service 和 id 时无需任何额外配置）
    // 例如订阅链接为 https://jmssub.net/members/getsub.php?service=123&id=xxx 时自动识别
    if (context?.source) {
      $.info(`✓ context.source 存在，尝试提取 URL 参数`)
      for (const [key, value] of Object.entries(context.source)) {
        if (!key.startsWith('_') && value?.url) {
          $.info(`✓ 找到订阅: ${key}, URL: ${value.url}`)
          try {
            const urlObj = new URL(value.url)
            const urlService = urlObj.searchParams.get('service')
            const urlId = urlObj.searchParams.get('id')
            if (urlService) {
              serviceId = urlService
              $.info(`✓ 从订阅 URL 提取 service: ${serviceId}`)
            }
            if (urlId) {
              userId = urlId
              $.info(`✓ 从订阅 URL 提取 id: ${userId}`)
            }
            break
          } catch (parseError) {
            $.error(`解析订阅 URL 失败: ${parseError.message}`)
          }
        }
      }
    } else {
      $.info(`⚠ context.source 不存在`)
    }

    $.info(`🔍 最终使用的参数 - service: ${serviceId}, id: ${userId}`)

    // 检查参数是否有效
    if (serviceId === 'YOUR_SERVICE_ID' || userId === 'YOUR_USER_ID') {
      $.error('❌ 未配置有效的 service 和 id 参数，请通过脚本参数或订阅 URL 传递')
      return proxies
    }
  } catch (paramError) {
    $.error(`❌ 参数解析失败: ${paramError.message}`)
    return proxies
  }

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
      $.info(`   Service ID: ${serviceId}`)
      $.info(`   User ID: ${userId}`)
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
