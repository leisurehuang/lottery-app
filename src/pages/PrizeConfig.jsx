import { useState } from 'react'

function PrizeConfig({ appData, updateAppData }) {
  const [prizes, setPrizes] = useState(appData.prizes.length > 0 ? appData.prizes : [
    { level: 1, name: '幸运奖', count: 10 }
  ])
  const [newPrize, setNewPrize] = useState({ level: 1, name: '', count: 1 })

  const addPrize = () => {
    if (!newPrize.name.trim()) {
      alert('请输入奖品名称')
      return
    }
    if (newPrize.count < 1) {
      alert('奖品数量必须大于0')
      return
    }

    const exists = prizes.some(p => p.level === newPrize.level)
    if (exists) {
      alert(`等级 ${newPrize.level} 已存在`)
      return
    }

    setPrizes([...prizes, { ...newPrize }])
    setNewPrize({ level: prizes.length + 1, name: '', count: 1 })
  }

  const removePrize = (index) => {
    if (confirm('确定要删除这个奖品吗？')) {
      const newPrizes = prizes.filter((_, i) => i !== index)
      setPrizes(newPrizes)
    }
  }

  const updatePrize = (index, field, value) => {
    const newPrizes = [...prizes]
    newPrizes[index][field] = value
    setPrizes(newPrizes)
  }

  const savePrizes = () => {
    if (prizes.length === 0) {
      alert('请至少添加一个奖品')
      return
    }

    const sortedPrizes = [...prizes].sort((a, b) => b.level - a.level)
    updateAppData({ prizes: sortedPrizes })
    alert('奖品配置已保存！')
  }

  const loadPreset = () => {
    setPrizes([
      { level: 1, name: '幸运奖', count: 20 },
      { level: 2, name: '三等奖', count: 10 },
      { level: 3, name: '二等奖', count: 5 },
      { level: 4, name: '一等奖', count: 3 },
      { level: 5, name: '特等奖', count: 1 }
    ])
  }

  const clearPrizes = () => {
    if (confirm('确定要清空所有奖品配置吗？')) {
      setPrizes([])
      updateAppData({ prizes: [] })
    }
  }

  const totalPrizes = prizes.reduce((sum, p) => sum + p.count, 0)

  return (
    <div className="fade-in">
      <div className="card">
        <h2 className="subheading">🎁 奖品配置</h2>

        {appData.employees.length === 0 && (
          <div className="card" style={{ background: '#feebc8' }}>
            <p className="text">⚠️ 请先<Link to="/import">导入员工数据</Link></p>
          </div>
        )}

        <div className="card" style={{ background: '#f7fafc' }}>
          <h3 className="subheading">添加奖品</h3>
          <div className="grid-3">
            <div>
              <label className="text-small">等级（数字越大越先抽）</label>
              <input
                type="number"
                value={newPrize.level}
                onChange={(e) => setNewPrize({ ...newPrize, level: parseInt(e.target.value) || 1 })}
                className="input mt-4"
                min="1"
              />
            </div>
            <div>
              <label className="text-small">奖品名称</label>
              <input
                type="text"
                value={newPrize.name}
                onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                placeholder="例如：三等奖"
                className="input mt-4"
              />
            </div>
            <div>
              <label className="text-small">数量</label>
              <input
                type="number"
                value={newPrize.count}
                onChange={(e) => setNewPrize({ ...newPrize, count: parseInt(e.target.value) || 1 })}
                className="input mt-4"
                min="1"
              />
            </div>
          </div>
          <button onClick={addPrize} className="button button-primary mt-4">
            添加奖品
          </button>
        </div>

        <div className="flex-gap mt-4">
          <button onClick={loadPreset} className="button button-secondary">
            加载预设配置
          </button>
          {prizes.length > 0 && (
            <button onClick={clearPrizes} className="button button-danger">
              清空配置
            </button>
          )}
        </div>

        {prizes.length > 0 && (
          <div className="card mt-4">
            <div className="flex-between mb-4">
              <h3 className="subheading">奖品列表</h3>
              <div className="text">
                共 {prizes.length} 个奖项等级，总计 {totalPrizes} 份奖品
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>等级</th>
                  <th>奖品名称</th>
                  <th>数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {prizes.sort((a, b) => b.level - a.level).map((prize, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        value={prize.level}
                        onChange={(e) => updatePrize(index, 'level', parseInt(e.target.value) || 1)}
                        className="input"
                        style={{ width: '80px' }}
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={prize.name}
                        onChange={(e) => updatePrize(index, 'name', e.target.value)}
                        className="input"
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={prize.count}
                        onChange={(e) => updatePrize(index, 'count', parseInt(e.target.value) || 1)}
                        className="input"
                        style={{ width: '100px' }}
                        min="1"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => removePrize(index)}
                        className="button button-danger"
                        style={{ padding: '8px 16px' }}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={savePrizes} className="button button-primary mt-4" style={{ width: '100%' }}>
              💾 保存配置
            </button>

            {appData.prizes.length > 0 && appData.employees.length > 0 && totalPrizes > appData.employees.length && (
              <div className="card mt-4" style={{ background: '#feebc8' }}>
                <p className="text">
                  ⚠️ 奖品总数（{totalPrizes}）超过了员工人数（{appData.employees.length}），建议调整奖品数量
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PrizeConfig
