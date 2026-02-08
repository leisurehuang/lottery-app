// 预设主题配置
export const THEMES = {
  spring: {
    id: 'spring',
    name: '🧧 春节庆典',
    description: '红红火火过大年',
    colors: {
      primary: '#D32F2F',
      secondary: '#FFA000',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #D32F2F 0%, #FFA000 100%)',
      cardBackground: '#FFFBF0',
      text: '#212121',
      textSecondary: '#757575',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🧧',
      decoration: '🏮',
      pattern: 'lantern'
    }
  },
  golden: {
    id: 'golden',
    name: '🌟 金色华章',
    description: '富贵典雅中国风',
    colors: {
      primary: '#B8860B',
      secondary: '#DAA520',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)',
      cardBackground: '#FFFEF8',
      text: '#2C1810',
      textSecondary: '#6B4423',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🎊',
      decoration: '✨',
      pattern: 'cloud'
    }
  },
  corporate: {
    id: 'corporate',
    name: '💼 商务简约',
    description: '现代商务风格',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#667eea',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: '#FFFFFF',
      text: '#2D3748',
      textSecondary: '#718096',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🎉',
      decoration: '⭐',
      pattern: 'geometric'
    }
  },
  national: {
    id: 'national',
    name: '🇨🇳 中国红',
    description: '国庆喜庆氛围',
    colors: {
      primary: '#DE2910',
      secondary: '#FFDE00',
      accent: '#FF0000',
      background: 'linear-gradient(135deg, #DE2910 0%, #FFDE00 100%)',
      cardBackground: '#FFFBEB',
      text: '#8B1A1A',
      textSecondary: '#B85C5C',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🇨🇳',
      decoration: '🎆',
      pattern: 'star'
    }
  },
  midAutumn: {
    id: 'midAutumn',
    name: '🌕 中秋团圆',
    description: '月圆人团圆',
    colors: {
      primary: '#1A237E',
      secondary: '#4527A0',
      accent: '#FFD700',
      background: 'linear-gradient(135deg, #1A237E 0%, #4527A0 50%, #FFD700 100%)',
      cardBackground: '#FFF8E1',
      text: '#0D47A1',
      textSecondary: '#1976D2',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🌕',
      decoration: '🥮',
      pattern: 'moon'
    }
  },
  custom: {
    id: 'custom',
    name: '🎨 自定义',
    description: '自定义主题',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#667eea',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: '#FFFFFF',
      text: '#2D3748',
      textSecondary: '#718096',
      buttonText: '#FFFFFF'
    },
    elements: {
      emoji: '🎉',
      decoration: '⭐',
      pattern: 'geometric'
    }
  }
}

export const DEFAULT_THEME = 'spring'
