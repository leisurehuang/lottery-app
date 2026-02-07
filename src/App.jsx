import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ImportData from './pages/ImportData'
import PrizeConfig from './pages/PrizeConfig'
import Lottery from './pages/Lottery'
import Results from './pages/Results'

const STORAGE_KEY = 'lottery_app_data'

function App() {
  const [appData, setAppData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      employees: [],
      prizes: [],
      winners: [],
      currentLevel: 0
    }
  })

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
  }, [appData])

  const updateAppData = (newData) => {
    setAppData(prev => ({ ...prev, ...newData }))
  }

  const resetData = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
      setAppData({
        employees: [],
        prizes: [],
        winners: [],
        currentLevel: 0
      })
      navigate('/')
    }
  }

  return (
    <div className="container">
      <h1 className="heading">🎉 年会抽奖系统 🎉</h1>

      <nav className="card">
        <div className="flex-between">
          <div className="flex-gap">
            <Link to="/" className="button button-secondary">首页</Link>
            <Link to="/import" className="button button-secondary">导入数据</Link>
            <Link to="/config" className="button button-secondary">奖品配置</Link>
            <Link to="/lottery" className="button button-primary">开始抽奖</Link>
            <Link to="/results" className="button button-secondary">中奖名单</Link>
          </div>
          <button onClick={resetData} className="button button-danger">重置数据</button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage appData={appData} />} />
        <Route path="/import" element={<ImportData appData={appData} updateAppData={updateAppData} />} />
        <Route path="/config" element={<PrizeConfig appData={appData} updateAppData={updateAppData} />} />
        <Route path="/lottery" element={<Lottery appData={appData} updateAppData={updateAppData} />} />
        <Route path="/results" element={<Results appData={appData} updateAppData={updateAppData} />} />
      </Routes>
    </div>
  )
}

function HomePage({ appData }) {
  const { employees, prizes, winners } = appData

  const stats = [
    { label: '参与人数', value: employees.length, color: '#667eea' },
    { label: '奖项等级', value: prizes.length, color: '#764ba2' },
    { label: '已中奖人数', value: winners.length, color: '#48bb78' },
    { label: '奖品总数', value: prizes.reduce((sum, p) => sum + p.count, 0), color: '#ed8936' }
  ]

  return (
    <div className="fade-in">
      <div className="grid-2">
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div className="text-small">{stat.label}</div>
            <div className="heading" style={{ fontSize: '48px', margin: '0' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card mt-4">
        <h2 className="subheading">📊 数据概览</h2>
        {employees.length === 0 ? (
          <p className="text">还没有导入员工数据，请先<Link to="/import">导入数据</Link></p>
        ) : prizes.length === 0 ? (
          <p className="text">还没有配置奖品，请先<Link to="/config">配置奖品</Link></p>
        ) : (
          <div>
            <p className="text mb-4">✅ 数据已准备就绪，可以开始<Link to="/lottery">抽奖</Link>了！</p>
            <h3 className="subheading">奖项配置</h3>
            <div className="grid-2">
              {prizes.map((prize, index) => (
                <div key={index} className="card" style={{ background: '#f7fafc' }}>
                  <div className="flex-between">
                    <strong>{prize.name}</strong>
                    <span className="text-small">等级 {prize.level}</span>
                  </div>
                  <div className="text-small mt-4">数量：{prize.count}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
