import { useState } from 'react'
import { Link } from 'react-router-dom'

function ImportData({ appData, updateAppData }) {
  const [textData, setTextData] = useState('')
  const [error, setError] = useState('')

  const handleTextImport = () => {
    try {
      const lines = textData.trim().split('\n')
      const employees = []

      for (let line of lines) {
        line = line.trim()
        if (!line) continue

        const parts = line.split(/[,\t，]+/)

        if (parts.length < 2) {
          setError(`格式错误: "${line}" - 每行需要包含姓名和工号，用逗号或制表符分隔`)
          return
        }

        const [name, id] = parts.map(p => p.trim())

        if (!name || !id) {
          setError(`格式错误: "${line}" - 姓名和工号不能为空`)
          return
        }

        employees.push({ name, id })
      }

      if (employees.length === 0) {
        setError('没有找到有效的员工数据')
        return
      }

      updateAppData({ employees })
      setError('')
      alert(`成功导入 ${employees.length} 名员工！`)
    } catch (err) {
      setError('解析数据时出错: ' + err.message)
    }
  }

  const handleFileImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setTextData(event.target.result)
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    if (confirm('确定要清空所有员工数据吗？')) {
      updateAppData({ employees: [] })
      setTextData('')
    }
  }

  const exportTemplate = () => {
    const template = `张三,E001
李四,E002
王五,E003`
    setTextData(template)
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <Link to="/" className="button button-secondary">
          ← 返回首页
        </Link>
      </div>
      <div className="card">
        <h2 className="subheading">📥 导入员工数据</h2>

        {appData.employees.length > 0 && (
          <div className="card" style={{ background: '#c6f6d5', marginBottom: '20px' }}>
            <p className="text">
              ✅ 已导入 <strong>{appData.employees.length}</strong> 名员工
            </p>
          </div>
        )}

        <div className="card" style={{ background: '#f7fafc' }}>
          <h3 className="subheading">导入说明</h3>
          <p className="text mb-4">
            每行一个员工，格式：<code>姓名,工号</code> 或 <code>姓名  工号</code>（制表符分隔）<br />
            支持 CSV/TXT 文件导入，或直接粘贴文本
          </p>
          <button onClick={exportTemplate} className="button button-secondary mb-4">
            查看示例数据
          </button>
        </div>

        <div className="mt-4">
          <label className="text-small">
            方式一：上传文件（CSV/TXT）
          </label>
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileImport}
            className="input mt-4"
          />
        </div>

        <div className="mt-4">
          <label className="text-small">
            方式二：粘贴文本数据
          </label>
          <textarea
            value={textData}
            onChange={(e) => setTextData(e.target.value)}
            placeholder="张三,E001&#10;李四,E002&#10;王五,E003"
            className="input mt-4"
            rows="10"
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        {error && (
          <div className="card mt-4" style={{ background: '#fed7d7', color: '#c53030' }}>
            ❌ {error}
          </div>
        )}

        <div className="flex-gap mt-4">
          <button onClick={handleTextImport} className="button button-primary">
            导入数据
          </button>
          {appData.employees.length > 0 && (
            <button onClick={handleClear} className="button button-danger">
              清空数据
            </button>
          )}
        </div>

        {appData.employees.length > 0 && (
          <div className="card mt-4">
            <h3 className="subheading">已导入员工列表</h3>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>姓名</th>
                    <th>工号</th>
                  </tr>
                </thead>
                <tbody>
                  {appData.employees.map((emp, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{emp.name}</td>
                      <td>{emp.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImportData
