import '../Home/Home.css'

const Community = () => {
  const mockPosts = [
    { id: 1, title: '석사 준비 중인데 연구실 추천 좀 부탁드려요!', writer: 'skywalker', comments: 3 },
    { id: 2, title: '해외 대학원 지원 일정 같이 공유해요', writer: 'dreamer', comments: 5 },
    { id: 3, title: 'Findora UI 어때요?', writer: 'neo', comments: 2 }
  ]

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#B8DCCC] mb-2">커뮤니티</h1>
          <p className="text-gray-300 text-sm">
            질문하고 나누는 자유로운 공간입니다.
          </p>
        </div>

        {/* 글쓰기 버튼 */}
        <div className="text-right mb-6">
          <button className="bg-[#B8DCCC] text-black font-semibold px-4 py-2 rounded hover:bg-opacity-90">
            ✍ 글쓰기
          </button>
        </div>

        {/* 게시글 목록 */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div key={post.id} className="bg-white text-black rounded-lg px-6 py-4 shadow hover:-translate-y-1 transition">
              <h3 className="text-lg font-semibold text-[#B8DCCC]">{post.title}</h3>
              <div className="text-sm text-gray-600 mt-1">
                작성자: {post.writer} · 💬 {post.comments} 댓글
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Community
