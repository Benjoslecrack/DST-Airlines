import { useState, useEffect } from 'react'

function Creators() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animation d'apparition au chargement
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const creators = [
    {
      id: 1,
      name: 'Créateur 1',
      role: 'Lead Developer & Designer',
      description: 'Passionné par le développement web et l\'innovation technologique. Expert en React et interfaces utilisateur modernes.',
      skills: ['React', 'Node.js', 'UI/UX Design', 'TypeScript'],
      avatar: '👨‍💻',
      color: 'from-blue-500 to-cyan-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'creator1@dstairlines.com'
      }
    },
    {
      id: 2,
      name: 'Créateur 2',
      role: 'Full Stack Developer',
      description: 'Développeur passionné avec une expertise en architecture logicielle et systèmes temps réel. Spécialiste des applications web performantes.',
      skills: ['JavaScript', 'Python', 'Database Design', 'API Development'],
      avatar: '👩‍💻',
      color: 'from-purple-500 to-pink-500',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: 'creator2@dstairlines.com'
      }
    }
  ]

  return (
    <div className="creators-page">
      <div className={`page-container ${isVisible ? 'fade-in' : ''}`}>
        {/* Header animé */}
        <div className="creators-header">
          <div className="header-decoration"></div>
          <h1 className="creators-title">
            <span className="title-word">Notre</span>
            <span className="title-word">Équipe</span>
          </h1>
          <p className="creators-subtitle">
            Les créateurs passionnés derrière DST Airlines
          </p>
          <div className="header-line"></div>
        </div>

        {/* Cartes des créateurs */}
        <div className="creators-grid">
          {creators.map((creator, index) => (
            <div
              key={creator.id}
              className={`creator-card ${isVisible ? 'slide-in' : ''}`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Background animé */}
              <div className="card-background"></div>

              {/* Avatar */}
              <div className="creator-avatar-container">
                <div className={`creator-avatar gradient-${creator.color}`}>
                  <span className="avatar-emoji">{creator.avatar}</span>
                  <div className="avatar-ring"></div>
                  <div className="avatar-pulse"></div>
                </div>
              </div>

              {/* Informations */}
              <div className="creator-info">
                <h2 className="creator-name">{creator.name}</h2>
                <p className="creator-role">{creator.role}</p>
                <p className="creator-description">{creator.description}</p>

                {/* Compétences */}
                <div className="creator-skills">
                  {creator.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="skill-tag"
                      style={{ animationDelay: `${(index * 0.2) + (idx * 0.1)}s` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Liens sociaux */}
                <div className="creator-social">
                  <a
                    href={creator.socialLinks.github}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">🔗</span>
                    <span className="social-text">GitHub</span>
                  </a>
                  <a
                    href={creator.socialLinks.linkedin}
                    className="social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="social-icon">💼</span>
                    <span className="social-text">LinkedIn</span>
                  </a>
                  <a
                    href={`mailto:${creator.socialLinks.email}`}
                    className="social-link"
                  >
                    <span className="social-icon">✉️</span>
                    <span className="social-text">Email</span>
                  </a>
                </div>
              </div>

              {/* Effet de brillance au survol */}
              <div className="card-shine"></div>
            </div>
          ))}
        </div>

        {/* Section projet */}
        <div className={`project-section ${isVisible ? 'fade-in-up' : ''}`}>
          <div className="project-card">
            <div className="project-icon">✈️</div>
            <h2 className="project-title">À propos de DST Airlines</h2>
            <p className="project-description">
              DST Airlines est un projet innovant de suivi de vols en temps réel,
              développé avec passion en utilisant les technologies web les plus modernes.
              Notre objectif est de fournir une interface intuitive et performante pour
              la visualisation et l'analyse des données de vol.
            </p>
            <div className="project-stats">
              <div className="stat-item">
                <span className="stat-value">2024</span>
                <span className="stat-label">Année de création</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">React</span>
                <span className="stat-label">Framework principal</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">100%</span>
                <span className="stat-label">Passion investie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Particules décoratives */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Creators
