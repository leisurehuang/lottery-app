import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import ImportData from './pages/ImportData'
import PrizeConfig from './pages/PrizeConfig'
import Lottery from './pages/Lottery'
import Results from './pages/Results'
import ThemeSettings from './pages/ThemeSettings'
import { THEMES, DEFAULT_THEME } from './config/themes'

const STORAGE_KEY = 'lottery_app_data'

const applyTheme = (themeId) => {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME]
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.colors.primary)
  root.style.setProperty('--color-secondary', theme.colors.secondary)
  root.style.setProperty('--color-accent', theme.colors.accent)
  root.style.setProperty('--color-background', theme.colors.background)
  root.style.setProperty('--color-card-background', theme.colors.cardBackground)
  root.style.setProperty('--color-text', theme.colors.text)
  root.style.setProperty('--color-text-secondary', theme.colors.textSecondary)
  root.style.setProperty('--color-button-text', theme.colors.buttonText)
  root.style.setProperty('--theme-emoji', `'${theme.elements.emoji}'`)
  root.style.setProperty('--theme-decoration', `'${theme.elements.decoration}'`)
}

function SettingMenu({ appData, updateAppData, resetData, onClose }) {
  const { employees = [], prizes = [] } = appData || {}

  const menuItems = [
    { to: '/import', icon: '📥', label: '导入数据', description: '导入员工名单' },
    { to: '/config', icon: '🎁', label: '奖品配置', description: '配置奖项和抽取模式' },
    { to: '/theme', icon: '🎨', label: '主题设置', description: '切换主题风格' },
    { to: '/results', icon: '📋', label: '中奖名单', description: '查看和导出结果' },
  ]

  return (
    <div className="setting-overlay" onClick={onClose}>
      <div className="setting-menu" onClick={(e) => e.stopPropagation()}>
        <div className="flex-between mb-4">
          <h3 className="subheading" style={{ margin: 0 }}>⚙️ 设置</h3>
          <button onClick={onClose} className="button button-secondary" style={{ padding: '8px 16px' }}>✕</button>
        </div>

        <div className="setting-stats mb-4">
          <div className="text-small">参与人数：{employees.length}</div>
          <div className="text-small">奖项数量：{prizes.length}</div>
        </div>

        <div className="setting-items">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="setting-item"
              onClick={onClose}
            >
              <div style={{ fontSize: '32px' }}>{item.icon}</div>
              <div>
                <div className="setting-item-label">{item.label}</div>
                <div className="text-small">{item.description}</div>
              </div>
            </Link>
          ))}

          <button
            onClick={() => {
              if (resetData()) {
                onClose()
              }
            }}
            className="setting-item setting-item-danger"
            style={{ width: '100%', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
          >
            <div style={{ fontSize: '32px' }}>🗑️</div>
            <div>
              <div className="setting-item-label" style={{ color: '#f56565' }}>重置数据</div>
              <div className="text-small">清除所有数据</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [appData, setAppData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        const theme = parsed.theme || DEFAULT_THEME
        applyTheme(theme)
        return {
          employees: Array.isArray(parsed.employees) ? parsed.employees : [],
          prizes: Array.isArray(parsed.prizes) ? parsed.prizes : [],
          winners: Array.isArray(parsed.winners) ? parsed.winners : [],
          currentLevel: parsed.currentLevel || 0,
          drawMode: parsed.drawMode || 'single',
          theme: theme
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
    applyTheme(DEFAULT_THEME)
    return {
      employees: [],
      prizes: [],
      winners: [],
      currentLevel: 0,
      drawMode: 'single',
      theme: DEFAULT_THEME
    }
  })

  const [showSettings, setShowSettings] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
    if (appData.theme) {
      applyTheme(appData.theme)
    }
  }, [appData])

  const updateAppData = (newData) => {
    setAppData(prev => ({ ...prev, ...newData }))
  }

  const resetData = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复。')) {
      const currentTheme = appData.theme || DEFAULT_THEME
      setAppData({
        employees: [],
        prizes: [],
        winners: [],
        currentLevel: 0,
        drawMode: 'single',
        theme: currentTheme
      })
      navigate('/')
      return true
    }
    return false
  }

  return (
    <div className="container">
      <nav className="navbar">
        <h1 className="navbar-title">
          {THEMES[appData.theme || DEFAULT_THEME].elements.emoji} 年会抽奖系统
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="button button-primary navbar-settings"
        >
          ⚙️ 设置
        </button>
      </nav>

      {showSettings && (
        <SettingMenu
          appData={appData}
          updateAppData={updateAppData}
          resetData={resetData}
          onClose={() => setShowSettings(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage appData={appData} updateAppData={updateAppData} />} />
        <Route path="/import" element={<ImportData appData={appData} updateAppData={updateAppData} />} />
        <Route path="/config" element={<PrizeConfig appData={appData} updateAppData={updateAppData} />} />
        <Route path="/theme" element={<ThemeSettings appData={appData} updateAppData={updateAppData} />} />
        <Route path="/results" element={<Results appData={appData} updateAppData={updateAppData} />} />
      </Routes>
    </div>
  )
}

function HomePage({ appData, updateAppData }) {
  const { employees = [], prizes = [], winners = [] } = appData || {}

  const stats = [
    { label: '参与人数', value: employees.length, color: '#667eea' },
    { label: '奖项等级', value: prizes.length, color: '#764ba2' },
    { label: '已中奖人数', value: winners.length, color: '#48bb78' },
    { label: '奖品总数', value: prizes.reduce((sum, p) => sum + (p.count || 0), 0), color: '#ed8936' }
  ]

  return (
    <div className="fade-in">
      <div className="stats-bar">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item" style={{ borderLeft: `3px solid ${stat.color}` }}>
            <div className="text-small">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {employees.length === 0 ? (
        <div className="card">
          <h2 className="subheading">📥 欢迎使用年会抽奖系统</h2>
          <p className="text">请先点击右上角 ⚙️ 设置 → 导入数据 来导入员工名单</p>
        </div>
      ) : prizes.length === 0 ? (
        <div className="card">
          <h2 className="subheading">🎁 配置奖品</h2>
          <p className="text">请先点击右上角 ⚙️ 设置 → 奖品配置 来设置奖项和抽取模式</p>
        </div>
      ) : (
        <Lottery appData={appData} updateAppData={updateAppData} />
      )}
    </div>
  )
}

export default App
