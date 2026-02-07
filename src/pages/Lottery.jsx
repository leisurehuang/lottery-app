import { useState, useEffect, useRef } from 'react'

function Lottery({ appData, updateAppData }) {
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(appData.currentLevel || 0)
  const [isRolling, setIsRolling] = useState(false)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [roundWinners, setRoundWinners] = useState([])
  const [displayNames, setDisplayNames] = useState([])
  const rollInterval = useRef(null)

  const { employees, prizes, winners } = appData

  const currentPrize = prizes.sort((a, b) => b.level - a.level)[currentPrizeIndex]
  const availableEmployees = employees.filter(
    emp => !winners.some(w => w.employeeId === emp.id)
  )

  useEffect(() => {
    if (isRolling && availableEmployees.length > 0) {
      rollInterval.current = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * availableEmployees.length)
        setDisplayNames([availableEmployees[randomIndex]])
      }, 50)
    }

    return () => {
      if (rollInterval.current) {
        clearInterval(rollInterval.current)
      }
    }
  }, [isRolling, availableEmployees])

  const startRoll = () => {
    if (!currentPrize) {
      alert('没有可抽奖的奖项')
      return
    }

    if (availableEmployees.length === 0) {
      alert('所有员工都已中奖！')
      return
    }

    const roundWinnersCount = winners.filter(
      w => w.prizeLevel === currentPrize.level
    ).length

    if (roundWinnersCount >= currentPrize.count) {
      alert('当前奖项已全部抽完！')
      return
    }

    setIsRolling(true)
    setCurrentWinner(null)
  }

  const stopRoll = () => {
    if (!isRolling) return

    clearInterval(rollInterval.current)

    const randomIndex = Math.floor(Math.random() * availableEmployees.length)
    const winner = availableEmployees[randomIndex]

    const winnerRecord = {
      employeeId: winner.id,
      employeeName: winner.name,
      prizeName: currentPrize.name,
      prizeLevel: currentPrize.level,
      timestamp: new Date().toISOString()
    }

    const newWinners = [...winners, winnerRecord]
    updateAppData({ winners: newWinners })

    setCurrentWinner(winner)
    setRoundWinners([...roundWinners, winner])
    setIsRolling(false)
    setDisplayNames([winner])
  }

  const nextPrize = () => {
    if (currentPrizeIndex < prizes.length - 1) {
      setCurrentPrizeIndex(currentPrizeIndex + 1)
      updateAppData({ currentLevel: currentPrizeIndex + 1 })
      setRoundWinners([])
      setCurrentWinner(null)
    } else {
      alert('所有奖项已抽取完毕！')
    }
  }

  const resetLottery = () => {
    if (confirm('确定要重置抽奖结果吗？此操作不可恢复。')) {
      updateAppData({ winners: [], currentLevel: 0 })
      setCurrentPrizeIndex(0)
      setRoundWinners([])
      setCurrentWinner(null)
    }
  }

  const currentPrizeWinners = winners.filter(
    w => w.prizeLevel === currentPrize?.level
  )

  const allPrizesCompleted = currentPrizeIndex >= prizes.length - 1 &&
    currentPrizeWinners.length >= currentPrize?.count

  if (!currentPrize) {
    return (
      <div className="card fade-in">
        <h2 className="subheading">🎰 抽奖</h2>
        <p className="text">
          {prizes.length === 0
            ? '请先<Link to="/config">配置奖品</Link>'
            : '抽奖已结束'}
        </p>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="card fade-in">
        <h2 className="subheading">🎰 抽奖</h2>
        <p className="text">请先<Link to="/import">导入员工数据</Link></p>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="grid-2">
        <div className="card">
          <h2 className="subheading">🎰 抽奖进行中</h2>

          <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div className="text-small">当前奖项</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0' }}>
              {currentPrize.name}
            </div>
            <div className="text-small">
              等级 {currentPrize.level} | 共 {currentPrize.count} 份
            </div>
          </div>

          <div className="card mt-4" style={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {displayNames.length > 0 ? (
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#667eea' }}>
                  {displayNames[0].name}
                </div>
                <div className="text-small mt-4">
                  {displayNames[0].id}
                </div>
              </div>
            ) : (
              <div className="text">准备抽奖...</div>
            )}
          </div>

          <div className="flex-gap mt-4" style={{ justifyContent: 'center' }}>
            {!isRolling ? (
              <button
                onClick={startRoll}
                className="button button-primary pulse"
                disabled={currentPrizeWinners.length >= currentPrize.count}
                style={{ fontSize: '20px', padding: '16px 48px' }}
              >
                {currentPrizeWinners.length >= currentPrize.count ? '本轮已完成' : '开始滚动'}
              </button>
            ) : (
              <button
                onClick={stopRoll}
                className="button button-primary"
                style={{ fontSize: '20px', padding: '16px 48px', background: '#48bb78' }}
              >
                停止
              </button>
            )}

            {currentPrizeWinners.length >= currentPrize.count && (
              <button
                onClick={nextPrize}
                className="button button-primary"
                style={{ fontSize: '20px', padding: '16px 48px' }}
              >
                下一等级
              </button>
            )}
          </div>

          <div className="flex-center mt-4">
            <button onClick={resetLottery} className="button button-danger">
              重置抽奖
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="subheading">📊 抽奖进度</h2>

          <div className="mb-4">
            <div className="flex-between">
              <span className="text-small">本轮进度</span>
              <span className="text-small">
                {currentPrizeWinners.length} / {currentPrize.count}
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '20px',
              background: '#e2e8f0',
              borderRadius: '10px',
              overflow: 'hidden',
              marginTop: '8px'
            }}>
              <div style={{
                width: `${(currentPrizeWinners.length / currentPrize.count) * 100}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div className="card" style={{ background: '#f7fafc', maxHeight: '400px', overflow: 'auto' }}>
            <h3 className="subheading">本轮中奖名单</h3>
            {currentPrizeWinners.length === 0 ? (
              <p className="text-small">暂无中奖人员</p>
            ) : (
              currentPrizeWinners.map((winner, index) => (
                <div
                  key={index}
                  className="card fade-in"
                  style={{ background: 'white', marginBottom: '12px' }}
                >
                  <div className="flex-between">
                    <strong>{winner.employeeName}</strong>
                    <span className="text-small">{winner.employeeId}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="card mt-4" style={{ background: '#f7fafc' }}>
            <h3 className="subheading">奖项列表</h3>
            {prizes.sort((a, b) => b.level - a.level).map((prize, index) => {
              const prizeWinners = winners.filter(w => w.prizeLevel === prize.level)
              const isCompleted = prizeWinners.length >= prize.count
              const isCurrent = prize.level === currentPrize.level

              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    background: isCurrent ? '#e6fffa' : 'white',
                    border: isCurrent ? '2px solid #38b2ac' : '1px solid #e2e8f0',
                    marginBottom: '8px'
                  }}
                >
                  <div className="flex-between">
                    <div>
                      <strong>{prize.name}</strong>
                      <span className="text-small">（等级 {prize.level}）</span>
                    </div>
                    <div className="text-small">
                      {prizeWinners.length} / {prize.count}
                      {isCompleted && ' ✅'}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card mt-4" style={{ background: '#f7fafc' }}>
            <h3 className="subheading">统计</h3>
            <div className="grid-2">
              <div>
                <div className="text-small">参与人数</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {employees.length}
                </div>
              </div>
              <div>
                <div className="text-small">剩余未中奖</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ed8936' }}>
                  {availableEmployees.length}
                </div>
              </div>
              <div>
                <div className="text-small">已中奖人数</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#48bb78' }}>
                  {winners.length}
                </div>
              </div>
              <div>
                <div className="text-small">完成进度</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                  {Math.round((winners.length / prizes.reduce((sum, p) => sum + p.count, 0)) * 100)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lottery
