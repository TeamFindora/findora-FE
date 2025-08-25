import { Link } from 'react-router-dom'
import { useState } from 'react'
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline'

const Research = () => {
  // Real professor data from final_scholar_results.csv (first 49 entries)
  const mockLabs = [
    {
      id: 1,
      name: 'Computer Vision Lab',
      professor: 'Luc Van Gool',
      score: 4.8,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=TwMib_QAAAAJ&citpid=3',
      keywords: ['#computer vision', '#machine learning', '#AI', '#autonomous cars'],
      affiliation: 'ETH Zurich',
      scholarId: 'TwMib_QAAAAJ'
    },
    {
      id: 2,
      name: 'AI & Vision Lab',
      professor: 'Dacheng Tao',
      score: 4.7,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=RwlJNLcAAAAJ&citpid=2',
      keywords: ['#artificial intelligence', '#machine learning', '#computer vision', '#image processing'],
      affiliation: 'Nanyang Technological University',
      scholarId: 'RwlJNLcAAAAJ'
    },
    {
      id: 3,
      name: 'Robotics & AI Lab',
      professor: 'Daniela Rus',
      score: 4.9,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=910z20QAAAAJ&citpid=3',
      keywords: ['#Robotics', '#Wireless Networks', '#Distributed Computing'],
      affiliation: 'Massachusetts Institute of Technology',
      scholarId: '910z20QAAAAJ'
    },
    {
      id: 4,
      name: 'Machine Learning Lab',
      professor: 'Michael I. Jordan',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=yxUduqMAAAAJ&citpid=10',
      keywords: ['#machine learning', '#computer science', '#statistics', '#artificial intelligence'],
      affiliation: 'UC Berkeley',
      scholarId: 'yxUduqMAAAAJ'
    },
    {
      id: 5,
      name: 'Robotics & RL Lab',
      professor: 'Sergey Levine',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=8R35rCwAAAAJ&citpid=5',
      keywords: ['#Machine Learning', '#Robotics', '#Reinforcement Learning'],
      affiliation: 'UC Berkeley',
      scholarId: '8R35rCwAAAAJ'
    },
    {
      id: 6,
      name: 'Data Mining Lab',
      professor: 'Philip S. Yu',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=D0lL1r0AAAAJ&citpid=2',
      keywords: ['#Data mining', '#Database', '#Privacy'],
      affiliation: 'University of Illinois at Chicago',
      scholarId: 'D0lL1r0AAAAJ'
    },
    {
      id: 7,
      name: 'Data Science Lab',
      professor: 'Jiawei Han',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=Kv9AbjMAAAAJ&citpid=2',
      keywords: ['#data mining', '#database systems', '#data warehousing', '#information networks'],
      affiliation: 'University of Illinois',
      scholarId: 'Kv9AbjMAAAAJ'
    },
    {
      id: 8,
      name: 'ML & Biomedical Lab',
      professor: 'Heng Huang',
      score: 4.2,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=4OqLaDwAAAAJ&citpid=2',
      keywords: ['#Machine Learning', '#AI', '#Biomedical Data Science', '#Computer Vision'],
      affiliation: 'University of Maryland',
      scholarId: '4OqLaDwAAAAJ'
    },
    {
      id: 9,
      name: 'Computer Vision Lab',
      professor: 'Trevor Darrell',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=bh-uRFMAAAAJ&citpid=3',
      keywords: ['#Computer Vision', '#Artificial Intelligence', '#AI', '#Machine Learning'],
      affiliation: 'UC Berkeley',
      scholarId: 'bh-uRFMAAAAJ'
    },
    {
      id: 10,
      name: 'Robotics Lab',
      professor: 'Vijay Kumar',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=FUOEBDUAAAAJ&citpid=2',
      keywords: ['#Robotics'],
      affiliation: 'University of Pennsylvania',
      scholarId: 'FUOEBDUAAAAJ'
    },
    {
      id: 11,
      name: 'AI & Game Theory Lab',
      professor: 'Tuomas Sandholm',
      score: 4.7,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=0DpK1EMAAAAJ&citpid=3',
      keywords: ['#Artificial intelligence', '#auctions', '#market design', '#game theory'],
      affiliation: 'Carnegie Mellon University',
      scholarId: '0DpK1EMAAAAJ'
    },
    {
      id: 12,
      name: 'Graphics & VR Lab',
      professor: 'Dinesh Manocha',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=X08l_4IAAAAJ&citpid=3',
      keywords: ['#computer graphics', '#geometric modeling', '#motion planning', '#virtual reality'],
      affiliation: 'University of Maryland',
      scholarId: 'X08l_4IAAAAJ'
    },
    {
      id: 13,
      name: 'ML Systems Lab',
      professor: 'Eric P. Xing',
      score: 4.5,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      keywords: ['#Machine Learning', '#ML Systems', '#Statistics', '#Network Analysis'],
      affiliation: 'MBZUAI',
      scholarId: '5pKTRxEAAAAJ'
    },
    {
      id: 14,
      name: 'Algorithms Lab',
      professor: 'David P. Woodruff',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=kMmxbbIAAAAJ&citpid=4',
      keywords: ['#algorithms', '#machine learning', '#optimization', '#theoretical computer science'],
      affiliation: 'Carnegie Mellon University',
      scholarId: 'kMmxbbIAAAAJ'
    },
    {
      id: 15,
      name: 'Vision & AI Lab',
      professor: 'Alan L. Yuille',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=FJ-huxgAAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Computational Models of Mind and Brain', '#Machine Learning'],
      affiliation: 'Johns Hopkins University',
      scholarId: 'FJ-huxgAAAAJ'
    },
    {
      id: 16,
      name: 'Logic & Computation Lab',
      professor: 'Moshe Y. Vardi',
      score: 4.2,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=DQaARsgAAAAJ&citpid=2',
      keywords: ['#Logic and Computation'],
      affiliation: 'Rice University',
      scholarId: 'DQaARsgAAAAJ'
    },
    {
      id: 17,
      name: 'Robotics & ML Lab',
      professor: 'Pieter Abbeel',
      score: 4.8,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=vtwH6GkAAAAJ&citpid=3',
      keywords: ['#Robotics', '#Machine Learning', '#AI'],
      affiliation: 'UC Berkeley',
      scholarId: 'vtwH6GkAAAAJ'
    },
    {
      id: 18,
      name: 'Deep Learning Lab',
      professor: 'Yoshua Bengio',
      score: 4.9,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=kukA0LcAAAAJ&citpid=3',
      keywords: ['#Machine learning', '#deep learning', '#artificial intelligence'],
      affiliation: 'University of Montreal',
      scholarId: 'kukA0LcAAAAJ'
    },
    {
      id: 19,
      name: 'Computer Vision Lab',
      professor: 'Martial Hebert',
      score: 4.4,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      keywords: ['#Computer Vision', '#Robotics'],
      affiliation: 'Carnegie Mellon University',
      scholarId: '0ytii2EAAAAJ'
    },
    {
      id: 20,
      name: 'Geometric Computing Lab',
      professor: 'Leonidas J. Guibas',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=5JlEyTAAAAAJ&citpid=2',
      keywords: ['#geometric computing', '#computer vision', '#computer graphics', '#machine learning'],
      affiliation: 'Stanford University',
      scholarId: '5JlEyTAAAAAJ'
    },
    {
      id: 21,
      name: 'Vision & ML Lab',
      professor: 'Ming-Hsuan Yang',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=p9-ohHsAAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Machine Learning', '#Artificial Intelligence'],
      affiliation: 'UC Merced',
      scholarId: 'p9-ohHsAAAAJ'
    },
    {
      id: 22,
      name: 'Computer Vision Lab',
      professor: 'Mubarak Shah',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=p8gsO3gAAAAJ&citpid=4',
      keywords: ['#Computer Vision'],
      affiliation: 'University of Central Florida',
      scholarId: 'p8gsO3gAAAAJ'
    },
    {
      id: 23,
      name: 'Machine Learning Lab',
      professor: 'Tong Zhang',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=LurWtuYAAAAJ&citpid=5',
      keywords: ['#Machine Learning'],
      affiliation: 'HKUST',
      scholarId: 'LurWtuYAAAAJ'
    },
    {
      id: 24,
      name: 'Robotics Lab',
      professor: 'Yoshihiko Nakamura',
      score: 4.2,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=gkFd-RcAAAAJ&citpid=2',
      keywords: ['#Robotics', '#Humanoid', '#Bio-Medical', '#Neuro'],
      affiliation: 'MBZUAI',
      scholarId: 'gkFd-RcAAAAJ'
    },
    {
      id: 25,
      name: 'NLP Lab',
      professor: 'Daniel Klein',
      score: 4.3,
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      keywords: ['#Natural Language Processing', '#Machine Learning'],
      affiliation: 'UC Berkeley',
      scholarId: 'jJRiZR8AAAAJ'
    },
    {
      id: 26,
      name: 'Vision & AI Lab',
      professor: 'Song-Chun Zhu',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=Al8dyb4AAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Learning', '#Cognition', '#Robot Autonomy'],
      affiliation: 'Peking University',
      scholarId: 'Al8dyb4AAAAJ'
    },
    {
      id: 27,
      name: 'Systems Lab',
      professor: 'Kang G. Shin',
      score: 4.1,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=vY7MdLYAAAAJ&citpid=4',
      keywords: ['#Real-time systems', '#cyber-physical systems', '#computer networks', '#security'],
      affiliation: 'University of Michigan',
      scholarId: 'vY7MdLYAAAAJ'
    },
    {
      id: 28,
      name: 'Multimedia Lab',
      professor: 'Yi Yang',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=RMSuNFwAAAAJ&citpid=9',
      keywords: ['#multimedia', '#computer vision', '#machine learning'],
      affiliation: 'Zhejiang University',
      scholarId: 'RMSuNFwAAAAJ'
    },
    {
      id: 29,
      name: 'AI & ML Lab',
      professor: 'Zhi-Hua Zhou',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=rSVIHasAAAAJ&citpid=10',
      keywords: ['#Artificial Intelligence', '#Machine Learning', '#Data Mining'],
      affiliation: 'Nanjing University',
      scholarId: 'rSVIHasAAAAJ'
    },
    {
      id: 30,
      name: 'Database Lab',
      professor: 'Lei Chen',
      score: 4.2,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=gtglwgYAAAAJ&citpid=3',
      keywords: ['#Human Powered Machine Learning', '#Databases', '#Data Mining'],
      affiliation: 'HKUST',
      scholarId: 'gtglwgYAAAAJ'
    },
    {
      id: 31,
      name: 'Algorithms Lab',
      professor: 'Jon M. Kleinberg',
      score: 4.7,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=VX7d5EQAAAAJ&citpid=2',
      keywords: ['#algorithms', '#information networks', '#social networks', '#societal aspects'],
      affiliation: 'Cornell University',
      scholarId: 'VX7d5EQAAAAJ'
    },
    {
      id: 32,
      name: 'Robotics Lab',
      professor: 'Gaurav S. Sukhatme',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=lRUi-A8AAAAJ&citpid=3',
      keywords: ['#Robotics', '#Artificial Intelligence', '#Robot Networks', '#Motion Planning'],
      affiliation: 'USC',
      scholarId: 'lRUi-A8AAAAJ'
    },
    {
      id: 33,
      name: 'ML & AI Lab',
      professor: 'Jun Zhu',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=axsP38wAAAAJ&citpid=5',
      keywords: ['#Machine Learning', '#Bayesian Methods', '#Deep Generative Models', '#Adversarial Robustness'],
      affiliation: 'Tsinghua University',
      scholarId: 'axsP38wAAAAJ'
    },
    {
      id: 34,
      name: 'ML & AI Lab',
      professor: 'Andreas Krause',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=eDHv58AAAAAJ&citpid=3',
      keywords: ['#Machine Learning', '#Artificial Intelligence', '#Computational Sustainability', '#Submodularity'],
      affiliation: 'ETH Zurich',
      scholarId: 'eDHv58AAAAAJ'
    },
    {
      id: 35,
      name: 'NLP Lab',
      professor: 'Christopher D. Manning',
      score: 4.8,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=1zmDOdwAAAAJ&citpid=4',
      keywords: ['#Natural Language Processing', '#Computational Linguistics', '#Deep Learning'],
      affiliation: 'Stanford University',
      scholarId: '1zmDOdwAAAAJ'
    },
    {
      id: 36,
      name: 'Multimodal AI Lab',
      professor: 'Mohit Bansal',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=DN8QtscAAAAJ&citpid=6',
      keywords: ['#Natural Language Processing', '#Computer Vision', '#Machine Learning', '#Multimodal AI'],
      affiliation: 'UNC Chapel Hill',
      scholarId: 'DN8QtscAAAAJ'
    },
    {
      id: 37,
      name: 'Computer Vision Lab',
      professor: 'Pascal Fua',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=kzFmAkYAAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Machine Learning', '#Computer Asisted Eng.', '#Biomedical Imaging'],
      affiliation: 'EPFL',
      scholarId: 'kzFmAkYAAAAJ'
    },
    {
      id: 38,
      name: 'Vision & Robotics Lab',
      professor: 'Daniel Cremers',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=cXQciMEAAAAJ&citpid=4',
      keywords: ['#Computer Vision', '#Machine Learning', '#Optimization', '#Robotics'],
      affiliation: 'TU Munich',
      scholarId: 'cXQciMEAAAAJ'
    },
    {
      id: 39,
      name: 'NLP Lab',
      professor: 'Mirella Lapata',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=j67B9Q4AAAAJ&citpid=4',
      keywords: ['#natural language processing'],
      affiliation: 'University of Edinburgh',
      scholarId: 'j67B9Q4AAAAJ'
    },
    {
      id: 40,
      name: 'Graphics Lab',
      professor: 'Daniel Cohen-Or',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=fAxws1sAAAAJ&citpid=4',
      keywords: ['#Graphics', '#Imaging', '#Geometric Modeling'],
      affiliation: 'Tel Aviv University',
      scholarId: 'fAxws1sAAAAJ'
    },
    {
      id: 41,
      name: 'Computer Vision Lab',
      professor: 'Lior Wolf',
      score: 4.2,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      keywords: ['#Computer Vision', '#Deep Learning'],
      affiliation: 'Tel Aviv University',
      scholarId: 'UbFrXTsAAAAJ'
    },
    {
      id: 42,
      name: 'Game Theory Lab',
      professor: 'Vincent Conitzer',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=juRk4lQAAAAJ&citpid=3',
      keywords: ['#artificial intelligence', '#computer science', '#economics', '#philosophy'],
      affiliation: 'Carnegie Mellon University',
      scholarId: 'juRk4lQAAAAJ'
    },
    {
      id: 43,
      name: 'Computer Vision Lab',
      professor: 'Xiaoou Tang',
      score: 4.6,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=qpBtpGsAAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Pattern Recognition'],
      affiliation: 'CUHK',
      scholarId: 'qpBtpGsAAAAJ'
    },
    {
      id: 44,
      name: 'Robotics Lab',
      professor: 'Howie Choset',
      score: 4.1,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      keywords: ['#robotics', '#snake robots', '#medical robotics', '#locomotion'],
      affiliation: 'Carnegie Mellon University',
      scholarId: '4fvo61oAAAAJ'
    },
    {
      id: 45,
      name: 'NLP Lab',
      professor: 'Noah A. Smith',
      score: 4.5,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=TjdFs3EAAAAJ&citpid=3',
      keywords: ['#natural language processing', '#machine learning', '#computational social science'],
      affiliation: 'University of Washington',
      scholarId: 'TjdFs3EAAAAJ'
    },
    {
      id: 46,
      name: 'Computer Vision Lab',
      professor: 'Nuno Vasconcelos',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=Fykyo9gAAAAJ&citpid=2',
      keywords: ['#computer vision', '#deep learning', '#image processing', '#machine learning'],
      affiliation: 'UC San Diego',
      scholarId: 'Fykyo9gAAAAJ'
    },
    {
      id: 47,
      name: 'AI Lab',
      professor: 'Junchi Yan',
      score: 4.3,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=ga230VoAAAAJ&citpid=24',
      keywords: ['#AI4Science', '#Machine Learning', '#Autonomous Driving'],
      affiliation: 'Shanghai Jiao Tong University',
      scholarId: 'ga230VoAAAAJ'
    },
    {
      id: 48,
      name: 'Computer Vision Lab',
      professor: 'In-So Kweon',
      score: 4.2,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=XA8EOlEAAAAJ&citpid=2',
      keywords: ['#Computer Vision', '#Robotics'],
      affiliation: 'KAIST',
      scholarId: 'XA8EOlEAAAAJ'
    },
    {
      id: 49,
      name: 'Data Mining Lab',
      professor: 'Christos Faloutsos',
      score: 4.4,
      profileImage: 'https://scholar.googleusercontent.com/citations?view_op=view_photo&user=nd8lQQIAAAAJ&citpid=2',
      keywords: ['#Data Mining', '#Graph Mining', '#Databases'],
      affiliation: 'Carnegie Mellon University',
      scholarId: 'nd8lQQIAAAAJ'
    }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const labsPerPage = 5;

  const totalPages = Math.ceil(mockLabs.length / labsPerPage);
  const startIndex = (currentPage - 1) * labsPerPage;

  // 검색 및 정렬 필터링
  const filteredLabs = mockLabs.filter(lab =>
    lab.name.toLowerCase().includes(search.toLowerCase()) ||
    lab.professor.toLowerCase().includes(search.toLowerCase()) ||
    lab.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
  );

  const sortedLabs = [...filteredLabs].sort((a, b) => {
    switch (sortBy) {
      case 'score':
        return b.score - a.score;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'professor':
        return a.professor.localeCompare(b.professor);
      default:
        return 0;
    }
  });

  const paginatedLabs = sortedLabs.slice(startIndex, startIndex + labsPerPage);

  return (
    <div className="research-page min-h-screen bg-gray-50 text-gray-800 py-12 px-4">
      <div className="research-container">
        {/* 강조 섹션 - 연구실/교수 평가 */}
        <div className="research-hero-section bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="research-hero-content text-center mb-6">
            <h1 className="research-hero-title text-3xl font-bold text-gray-800 mb-2">연구실 / 교수 평가</h1>
            <p className="research-hero-description text-gray-600 text-lg">
              원하는 연구실과 교수를 검색하고, 평가를 남겨보세요
            </p>
          </div>
          
          {/* 검색창 */}
          <div className="research-search-section flex gap-2">
            <div className="research-search-input-wrapper flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="연구실 이름, 교수, 키워드 검색 (예: AI, UX, 머신러닝...)"
                className="research-search-input w-full pl-10 p-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select 
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="research-sort-select px-4 py-4 border border-gray-300 rounded-xl text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="score">평점 높은 순</option>
              <option value="name">이름순</option>
              <option value="professor">교수순</option>
            </select>
          </div>
        </div>

        {/* 연구실 리스트 */}
        <div className="research-labs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
          {paginatedLabs.length === 0 ? (
            <div className="research-empty-state col-span-2 text-center text-gray-400 py-12">
              <div className="research-empty-icon-wrapper mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300" />
              </div>
              <div className="research-empty-text text-xl">검색 결과가 없습니다.</div>
            </div>
          ) : paginatedLabs.map(lab => (
            <Link key={lab.id} to={`/research/detail?professor=${encodeURIComponent(lab.professor)}&id=${lab.scholarId}`} className="research-lab-link">
              <div className="research-lab-card bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                {/* 상단 헤더 */}
                {/* 교수 정보 - 프로필 이미지와 함께 */}
                <div className="research-lab-professor flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <img 
                        src={lab.profileImage} 
                        alt={`${lab.professor} 교수`}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(lab.professor)}&size=24&background=e5e7eb&color=6b7280`;
                        }}
                      />
                      <h3 className="text-base text-gray-800">{lab.professor}</h3>
                    </div>  
                <div className="research-lab-header flex items-start justify-between">
                  
                  <div className="research-lab-info flex-1">
                    <h3 className="research-lab-name text-xl font-bold text-gray-800 mb-2">{lab.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{lab.affiliation}</p>
                    
                    {/* 키워드 태그 */}
                    <div className="research-lab-keywords flex flex-wrap gap-2">
                      {lab.keywords.map((keyword, index) => (
                        <span 
                          key={index}
                          className="bg-[#B8DCCC]/20 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-[#B8DCCC]/30"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="research-lab-rating text-right">
                    <div className="research-rating-wrapper flex items-center gap-1 mb-1">
                      <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="research-lab-score font-semibold">{lab.score}</span>
                    </div>
                    <div className="research-rating-label text-xs text-gray-500">평균 평점</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="research-pagination flex justify-center mt-8">
            <div className="research-pagination-container flex items-center space-x-2">
              {/* 이전 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="research-pagination-button research-prev-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                이전
              </button>

              {/* 페이지 번호 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                // 현재 페이지 주변 5개 페이지만 표시
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`research-page-button px-3 py-2 rounded-lg text-sm transition ${
                        currentPage === page
                          ? 'bg-gray-800 text-white font-semibold'
                          : 'border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 3 ||
                  page === currentPage + 3
                ) {
                  return <span key={page} className="research-pagination-ellipsis px-2 text-gray-500">...</span>
                }
                return null
              })}

              {/* 다음 페이지 */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="research-pagination-button research-next-button px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;