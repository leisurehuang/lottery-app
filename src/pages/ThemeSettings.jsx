import { useState } from 'react'
import { THEMES, DEFAULT_THEME } from '../config/themes'
import { Link } from 'react-router-dom'

function ThemeSettings({ appData, updateAppData, onClose }) {
  const [currentTheme, setCurrentTheme] = useState(appData.theme || DEFAULT_THEME)

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId)
    const theme = THEMES[themeId]
    applyTheme(theme)
    updateAppData({ theme: themeId })
  }

  const applyTheme = (theme) => {
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

  return (
    <div className="fade-in">
      <div className="page-header">
        <Link to="/" className="button button-secondary">
          ← 返回首页
        </Link>
      </div>

      <div className="card">
        <h2 className="subheading">🎨 主题设置</h2>
        <p className="text mb-4">选择您喜欢的主题风格</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.values(THEMES).map((theme) => (
            <div
              key={theme.id}
              onClick={() => handleThemeChange(theme.id)}
              className={`theme-card ${currentTheme === theme.id ? 'theme-card-active' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`,
                border: currentTheme === theme.id ? '3px solid #FFD700' : '3px solid transparent',
                cursor: 'pointer',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)'
                e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '40px' }}>{theme.elements.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                    {theme.name}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                    {theme.description}
                  </div>
                </div>
              </div>

              {currentTheme === theme.id && (
                <div style={{
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  ✓ 当前主题
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                flexWrap: 'wrap'
              }}>
                {[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.accent
                ].map((color, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: color,
                      border: '2px solid rgba(255,255,255,0.5)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-4" style={{ background: '#f7fafc' }}>
          <h3 className="subheading">💡 主题说明</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div>
              <strong style={{ color: THEMES.spring.colors.primary }}>🧧 春节庆典</strong>
              <p className="text-small mt-4">
                红色为主，金色为辅，灯笼装饰，最适合春节年会
              </p>
            </div>
            <div>
              <strong style={{ color: THEMES.golden.colors.primary }}>🌟 金色华章</strong>
              <p className="text-small mt-4">
                金色渐变，富贵典雅，适合高端企业年会
              </p>
            </div>
            <div>
              <strong style={{ color: THEMES.corporate.colors.primary }}>💼 商务简约</strong>
              <p className="text-small mt-4">
                紫色渐变，现代简约，适合科技公司
              </p>
            </div>
            <div>
              <strong style={{ color: THEMES.national.colors.primary }}>🇨🇳 中国红</strong>
              <p className="text-small mt-4">
                国旗配色，国庆氛围，适合节日庆典
              </p>
            </div>
            <div>
              <strong style={{ color: THEMES.midAutumn.colors.primary }}>🌕 中秋团圆</strong>
              <p className="text-small mt-4">
                蓝金渐变，月圆主题，适合中秋活动
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSettings
