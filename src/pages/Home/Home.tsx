import { useState, useEffect } from 'react'
import { isAuthenticated, getCurrentUser } from '../../api'
import { BeakerIcon, UserGroupIcon, AcademicCapIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import './Home.css'

const carouselImages = [
  {
    id: 1,
    src: 'https://cdn.britannica.com/12/76812-050-E9DC978E/loop-display-aurora-australis-lights-oxygen-atoms-May-6-1991.jpg',
    alt: 'first aurora'
  },
  {
    id: 2,
    src: 'https://assets.rockpapershotgun.com/images//2017/08/tlda3.jpg',
    alt: 'Students studying'
  },
  {
    id: 3,
    src: 'https://petapixel.com/assets/uploads/2025/05/Mars-Perseverance.jpg',
    alt: 'Graduation ceremony'
  }
]

const introCards = [
  {
    id: 1,
    icon: BeakerIcon,
    title: '연구실 / 교수평가',
    description: 'Find detailed information about research labs and professor evaluations to make informed decisions about your academic path.'
  },
  {
    id: 2,
    icon: UserGroupIcon,
    title: '커뮤니티',
    description: 'Connect with fellow students, alumni, and academic communities to share experiences and build networks.'
  },
  {
    id: 3,
    icon: AcademicCapIcon,
    title: '입시관',
    description: 'Access comprehensive admission information, requirements, and guidance for universities worldwide.'
  }
]

const topUniversities = [
  {
    id: 1,
    rank: 1,
    name: 'MIT',
    fullName: 'Massachusetts Institute of Technology',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/MIT_logo.svg/1200px-MIT_logo.svg.png'
  },
  {
    id: 2,
    rank: 2,
    name: 'Stanford',
    fullName: 'Stanford University',
    country: 'United States',
    logo: 'https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/block-s-right.png'
  },
  {
    id: 3,
    rank: 3,
    name: 'Harvard',
    fullName: 'Harvard University',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Harvard_University_coat_of_arms.svg/1200px-Harvard_University_coat_of_arms.svg.png'
  },
  {
    id: 4,
    rank: 4,
    name: 'Oxford',
    fullName: 'University of Oxford',
    country: 'United Kingdom',
    logo: 'https://oxfordvisit.com/wp-content/uploads/2022/05/oxford-university-logo_quad.jpg'
  },
  {
    id: 5,
    rank: 5,
    name: 'Cambridge',
    fullName: 'University of Cambridge',
    country: 'United Kingdom',
    logo: 'https://www.shutterstock.com/image-vector/university-cambridge-logo-vector-600nw-1845651232.jpg'
  },
  {
    id: 6,
    rank: 6,
    name: 'Princeton',
    fullName: 'Princeton University',
    country: 'United States',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Princeton_seal.svg'
  }
]

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = isAuthenticated()
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const currentUser = getCurrentUser()
        setUser(currentUser)
      } else {
        setUser(null)
      }
    }

    checkAuthStatus()

    const handleAuthChange = () => checkAuthStatus()
    window.addEventListener('auth-change', handleAuthChange)

    return () => {
      window.removeEventListener('auth-change', handleAuthChange)
    }
  }, [])

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="carousel relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 z-10 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`carousel-indicator rounded-full transition-colors ${index === currentImageIndex ? 'bg-emerald-100' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>

        {/* Search Box */}
        <div className="search-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4 z-30">
          <div className="search-div flex-col">
            <h1 className="antialiased font-bold tracking-wide text-5xl mb-5 text-center text-white">Find your aurora</h1>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search universities, programs, or professors..."
                className="bg-gray-800/50 w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="bg-gray-100/0 text-white py-3 rounded-lg font-semibold transition-colors text-sm">
                <MagnifyingGlassIcon className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Optional welcome message */}
      {(isLoggedIn && user) && (
        <div className="user-section text-center">
          <div className="welcome-message">
            <h2>안녕하세요, {user.nickname}님! 👋</h2>
            <p>오늘도 좋은 하루 보내세요!</p>
          </div>
        </div>
      )}

      {/* Intro Cards */}
      <section className="py-12 px-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {introCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
                <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Universities */}
      <section className="top-uni-ranks py-12 px-8 bg-gray-50">
        <h2 className="text-1xl md:text-2xl font-bold text-gray-800 mb-8">Top University Rankings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topUniversities.map((university) => (
            <div
              key={university.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 px-6 py-4 border border-gray-100 flex justify-between items-center"
            >
              <div className="university-rank w-10 h-10 md:w-12 md:h-12 text-black rounded-full flex items-center justify-center font-bold text-l md:text-lg flex-shrink-0 mr-4">
                {university.rank}
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">{university.name}</h3>
                <p className="text-gray-500 text-sm">{university.country}</p>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ml-4">
                <img
                  src={university.logo}
                  alt={`${university.name} logo`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full bg-gray-200 rounded items-center justify-center text-gray-500 text-xs font-semibold">
                  LOGO
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home