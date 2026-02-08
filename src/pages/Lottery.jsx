import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'

function Lottery({ appData, updateAppData }) {
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(appData.currentLevel || 0)
  const [roundWinners, setRoundWinners] = useState([])

  const drawMode = appData.drawMode || 'single'

  const [isRolling, setIsRolling] = useState(false)
  const [currentWinner, setCurrentWinner] = useState(null)
  const [displayNames, setDisplayNames] = useState([])
  const [isBatchRolling, setIsBatchRolling] = useState(false)
  const [batchAnimationKey, setBatchAnimationKey] = useState(0)
  const rollInterval = useRef(null)

  const { employees, prizes, winners } = appData

  const sortedPrizes = useMemo(() => {
    return [...prizes].sort((a, b) => b.level - a.level)
  }, [prizes])

  const currentPrize = sortedPrizes[currentPrizeIndex]
  const availableEmployees = employees.filter(
    emp => !winners.some(w => w.employeeId === emp.id)
  )

  const currentPrizeWinners = winners.filter(
    w => w.prizeLevel === currentPrize?.level
  )

  const remainingCount = currentPrize ? currentPrize.count - currentPrizeWinners.length : 0

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

  useEffect(() => {
    let tick = 0
    if (isBatchRolling && availableEmployees.length > 0) {
      const displayCount = Math.min(remainingCount, availableEmployees.length)

      const updateDisplay = () => {
        tick++
        console.log(`Batch rolling: tick=${tick}, count=${displayCount}`)
        const randomDisplay = [...availableEmployees].sort(() => Math.random() - 0.5).slice(0, displayCount)
        const displayWithTick = randomDisplay.map(emp => ({
          ...emp,
          __tick: tick,
          __random: Math.random(),
          __timestamp: Date.now()
        }))
        setDisplayNames(displayWithTick)
        setBatchAnimationKey(`${tick}-${Date.now()}`)
      }

      updateDisplay()
      rollInterval.current = setInterval(updateDisplay, 80)
    }

    return () => {
      if (rollInterval.current) {
        clearInterval(rollInterval.current)
      }
    }
  }, [isBatchRolling, availableEmployees, remainingCount])

  const startRoll = () => {
    if (!currentPrize) {
      alert('没有可抽奖的奖项')
      return
    }

    if (availableEmployees.length === 0) {
      alert('所有员工都已中奖！')
      return
    }

    if (remainingCount <= 0) {
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

  const startBatchRoll = () => {
    if (!currentPrize) {
      alert('没有可抽奖的奖项')
      return
    }

    if (availableEmployees.length === 0) {
      alert('所有员工都已中奖！')
      return
    }

    if (remainingCount <= 0) {
      alert('当前奖项已全部抽完！')
      return
    }

    if (remainingCount > availableEmployees.length) {
      alert(`剩余未中奖人数（${availableEmployees.length}）不足当前奖项名额（${remainingCount}）`)
      return
    }

    setRoundWinners([])
    setIsBatchRolling(true)
  }

  const stopBatchRoll = () => {
    if (!isBatchRolling) return

    clearInterval(rollInterval.current)

    const shuffled = [...availableEmployees].sort(() => Math.random() - 0.5)
    const newRoundWinners = shuffled.slice(0, remainingCount)

    const winnerRecords = newRoundWinners.map(winner => ({
      employeeId: winner.id,
      employeeName: winner.name,
      prizeName: currentPrize.name,
      prizeLevel: currentPrize.level,
      timestamp: new Date().toISOString()
    }))

    updateAppData({ winners: [...winners, ...winnerRecords] })
    setRoundWinners(newRoundWinners)
    setIsBatchRolling(false)
    setDisplayNames([])
  }

  const nextPrize = () => {
    if (currentPrizeIndex < sortedPrizes.length - 1) {
      setCurrentPrizeIndex(currentPrizeIndex + 1)
      updateAppData({ currentLevel: currentPrizeIndex + 1 })
      setRoundWinners([])
      setCurrentWinner(null)
      setIsBatchRolling(false)
      setDisplayNames([])
    } else {
      alert('所有奖项已抽取完毕！')
    }
  }

  const resetLottery = () => {
    if (confirm('确定要重置抽奖结果吗？此操作不可恢复。')) {
      if (rollInterval.current) {
        clearInterval(rollInterval.current)
      }
      updateAppData({ winners: [], currentLevel: 0 })
      setCurrentPrizeIndex(0)
      setRoundWinners([])
      setCurrentWinner(null)
      setIsBatchRolling(false)
      setDisplayNames([])
    }
  }

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

          <div className="card" style={{ background: 'var(--color-background)', color: 'white' }}>
            <div className="text-small">当前奖项</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '16px 0' }}>
              {currentPrize.name}
            </div>
            <div className="text-small">
              等级 {currentPrize.level} | 共 {currentPrize.count} 份 | 模式: {drawMode === 'single' ? '逐个抽取' : '一次性抽取'}
            </div>
          </div>

          {drawMode === 'single' ? (
            <>
              <div className="card mt-4" style={{ textAlign: 'center', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {displayNames.length > 0 ? (
                  <div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
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
                    disabled={remainingCount <= 0}
                    style={{ fontSize: '20px', padding: '16px 48px' }}
                  >
                    {remainingCount <= 0 ? '本轮已完成' : '开始滚动'}
                  </button>
                ) : (
              <button
                onClick={stopRoll}
                className="button button-primary"
                style={{ fontSize: '20px', padding: '16px 48px', background: 'var(--color-accent)' }}
              >
                停止
              </button>
                )}

                {remainingCount <= 0 && (
                  <button
                    onClick={nextPrize}
                    className="button button-primary"
                    style={{ fontSize: '20px', padding: '16px 48px' }}
                  >
                    下一等级
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="card mt-4" style={{ minHeight: '300px' }}>
                <h3 className="subheading">{isBatchRolling ? '抽奖中...' : roundWinners.length === 0 ? '准备抽奖' : '中奖名单'}</h3>
                {isBatchRolling ? (
                  <div className="batch-animation-grid" key={batchAnimationKey}>
                    {displayNames.map((emp, index) => (
                      <div
                        key={`${emp.__tick}-${emp.__random}-${index}`}
                        className="batch-rolling-card"
                        style={{ animationDelay: `${index * 0.05}s`, borderColor: 'var(--color-accent)' }}
                      >
                        <div className="batch-name" style={{ color: 'var(--color-primary)' }}>{emp.name}</div>
                        <div className="text-small">{emp.id}</div>
                      </div>
                    ))}
                  </div>
                ) : roundWinners.length === 0 ? (
                  <p className="text">点击下方按钮开始抽取</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {roundWinners.map((winner, index) => (
                      <div
                        key={index}
                        className="card fade-in"
                        style={{ background: 'white', textAlign: 'center' }}
                      >
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '8px' }}>
                          {winner.name}
                        </div>
                        <div className="text-small">{winner.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-gap mt-4" style={{ justifyContent: 'center' }}>
                {!isBatchRolling ? (
                  roundWinners.length === 0 ? (
                    <button
                      onClick={startBatchRoll}
                      className="button button-primary pulse"
                      style={{ fontSize: '20px', padding: '16px 48px' }}
                    >
                      开始滚动
                    </button>
                  ) : (
                    <button
                      onClick={nextPrize}
                      className="button button-primary"
                      style={{ fontSize: '20px', padding: '16px 48px' }}
                    >
                      下一等级
                    </button>
                  )
                ) : (
              <button
                onClick={stopBatchRoll}
                className="button button-primary"
                style={{ fontSize: '20px', padding: '16px 48px', background: 'var(--color-accent)' }}
              >
                停止
              </button>
                )}
              </div>
            </>
          )}

          <div className="flex-center mt-4">
            <button onClick={resetLottery} className="button button-danger">
              重置抽奖
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="subheading">📊 抽奖进度</h2>

          {drawMode === 'single' && (
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
                background: 'var(--color-background)',
                transition: 'width 0.3s ease'
              }} />
            </div>
            </div>
          )}

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
            {sortedPrizes.map((prize, index) => {
              const prizeWinners = winners.filter(w => w.prizeLevel === prize.level)
              const isCompleted = prizeWinners.length >= prize.count
              const isCurrent = prize.level === currentPrize?.level

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
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF8C00' }}>
                  {availableEmployees.length}
                </div>
              </div>
              <div>
                <div className="text-small">已中奖人数</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-accent)' }}>
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
