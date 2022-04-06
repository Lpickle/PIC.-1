import axios from 'axios';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BtnComponent as Btn } from './BtnComponent';
import { PostThumbnail } from './postThumbnail';

import { Login } from "../modals/login";
import { Signup } from "../modals/signup";
import { BsChevronDoubleDown, BsCheckCircle } from 'react-icons/bs';

const Container = styled.section`

`

const InnerContainer = styled.div`
  position: relative;
  /* grid-column: 2 / 12; */
  width: 100%;
  height: max-content;
`

const ThumbnailContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  justify-items: center;
  grid-column-gap: 20px;
  grid-row-gap: 100px;
  
  width: 100%;
  /* min-height: 1200px; */
  height: max-content;
`

const SuggetionContainer = styled.div`
  grid-column: 1/ -1;

  position: relative;
  top : 200px;

  height: 400px;

  display: grid;
  justify-items: center;

  .msg {
    text-align: center;
    margin-bottom: 200px;
  }

  .msg p {
    color: #aaa;
    font-size: 0.9rem;

    &:first-child{
      font-size: 1.2rem;
      margin-bottom: 15px;
    }
  }
`

const BottomContainer = styled.section`
  position: absolute;
  bottom: -400px;

  /* z-index: 1; */

  margin-top: 100px;
  display: flex;
  justify-content: center;
  
  width: 100%;
  height: 250px;

  color: #888;

  user-select: none;

  .wrapper {
    position: relative;
    top : -88px;
    text-align: center;

    font-size: 1rem;

    svg {
      margin-bottom: 20px;
    }

    .to_top {
      margin-top: 8px;
      
      font-size: 0.9rem;
      text-decoration: underline;

      cursor: pointer;
    }
  }
`

export const PostContainer = ({ category, tags }) => {

  const serverPath = process.env.REACT_APP_SERVER_PATH
  const loginToken = window.localStorage.getItem('loginToken')
  const userId = window.localStorage.getItem('userId')

  const navigate = useNavigate()

  const [reqEndpoint, setReqEndpoint] = useState('')

  const [postsData, setPostsData] = useState([])
  const [pageLevel, setPageLevel] = useState(1);
  const [postEnd, setPostEnd] = useState(false)

  const [openLoginModal, setOpenLoginModal] = useState(false)
  const [openSignupModal, setOpenSignupModal] = useState(false);

  const [isLoading, setIsLoading] = useState(false)
  // const [viewmore, setViewmore] = useState(null)

  const viewmore = useRef()

  useEffect(() => {
    // 카테고리 props 가 변경되는 것을 감지하고, 그에 필요한 엔드포인트를 상태에 저장한다.
    if (category === 'my_pics') setReqEndpoint(`${serverPath}/api/posts?date=true&mypost=${userId}`)
    if (category === 'most_likes') setReqEndpoint(`${serverPath}/api/posts?like=true`)
    if (category === 'new_pics') setReqEndpoint(`${serverPath}/api/posts?date=true`)
    if (category === 'favorites') setReqEndpoint(`${serverPath}/api/posts?date=true&bookmark=${userId}`)

    if (category === 'tag_search' && tags.length) {
      setReqEndpoint(`${serverPath}/api/posts?date=true&hashtags=${tags}`)
    } else if (category === 'tag_search' && !tags.length) {
      setReqEndpoint(`${serverPath}/api/posts?date=true&hashtags=${['존재하지않는태그12341234']}`)
    }
    setPostEnd(false)
  }, [category, tags])


  useEffect(() => {
    (async () => {
      setPostsData([])
      // 데이터 초기화
      setPageLevel(1)
      // 페이지 레벨 초기화
      if (reqEndpoint) {
        try {
          const res = await axios.get(`${reqEndpoint}&level=1`)
          if (res.status === 200) {
            setPostsData(res.data.posts)
          }
        }
        catch (err) { }
      }
      setIsLoading(false)
    })()
  }, [reqEndpoint])

  const getPage = async (level) => {
    if (reqEndpoint) {
      try {
        const res = await axios.get(`${reqEndpoint}&level=${level}`)
        if (res.status === 200 && res.data.posts.length > 0) {
          setPostsData([...postsData, ...res.data.posts])
        }
        if (res.data.posts.length === 0) {
          setPostEnd(true)

        }
      }
      catch (err) {
        // console.log(err)
      }
    }
    setIsLoading(false)
  }

  const loadMore = () => {
    setPageLevel(pageLevel + 1)
  }

  useEffect(() => {
    getPage(pageLevel)
  }, [pageLevel])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && viewmore.current && !isLoading && postsData.length) {
        setIsLoading(true)
        viewmore.current.click()
      }
    }, { threshold: 1 })
    if (viewmore.current) {
      observer.observe(viewmore.current)
    }
  }, [postsData])

  const SuggestionMsg = () => {
    // 로그인 되어있지 않은 경우
    if (category === "favorites" || category === "my_pics") {
      if (!loginToken && !userId) {
        return (
          <SuggetionContainer>
            <div className="msg">
              <p>로그인이 필요합니다!</p>
              <p>로그인 또는 회원가입하여 서비스를 이용해보세요.</p>
            </div>
            <Btn action={() => setOpenLoginModal(true)}>로그인하기</Btn>
          </SuggetionContainer>
        )
      }
    }

    // 로그인이 되어있는 경우
    if (!postsData.length && category === "favorites") {
      return (
        <SuggetionContainer>
          <div className="msg">
            <p>아직 즐겨찾는 게시글이 없습니다.</p>
            <p>좋아요를 눌러 게시글을 추가해보세요!</p>
          </div>
          <Btn action={() => navigate('/new_pics')}>마음에 드는 게시글 찾으러 가기</Btn>
        </SuggetionContainer>
      )
    }
    if (!postsData.length && category === "my_pics") {
      return (
        <SuggetionContainer>
          <div className="msg">
            <p>아직 사진이 없습니다.</p>
            <p>역사적인 첫 사진을 업로드해보세요!</p>
          </div>
          <Btn action={() => navigate('/add_post')}>업로드하러 가기</Btn>
        </SuggetionContainer>
      )
    }
    return null
  }

  const modalHandler = (modal) => {
    if (modal === "login") {
      openLoginModal ? setOpenLoginModal(false) : setOpenLoginModal(true);
    }
    if (modal === "signup") {
      openSignupModal ? setOpenSignupModal(false) : setOpenSignupModal(true);
    }
  }
  console.log(pageLevel)
  return (
    <Container>
      {openLoginModal ? <Login closeFn={() => modalHandler("login")} setOpenLoginModal={setOpenLoginModal} setOpenSignupModal={setOpenSignupModal} /> : null}
      {openSignupModal ? <Signup closeFn={() => modalHandler('signup')} /> : null}
      <InnerContainer>
        <ThumbnailContainer>
          {
            postsData
              ? postsData.map((post, idx) => {
                return <PostThumbnail key={idx} data={post} idx={idx} action={() => navigate(`/posts/${post._id}`)} />
              })
              : null
          }
          <SuggestionMsg />
        </ThumbnailContainer>
        {
          postsData.length < 12
            ? null
            : (postEnd
              ? (
                <BottomContainer>
                  <div className='wrapper'>
                    <BsCheckCircle size={'2rem'} />
                    <div>마지막 사진을 불러왔습니다</div>
                    <div className='to_top' onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>위로 가기</div>
                  </div>
                </BottomContainer>
              )
              : (
                <BottomContainer >
                  <div className='wrapper'>
                    <BsChevronDoubleDown size={'2rem'} />
                    <div ref={viewmore} onClick={loadMore}>더보기</div>
                  </div>
                </BottomContainer>
              ))
        }
      </InnerContainer>
    </Container >
  );
};

