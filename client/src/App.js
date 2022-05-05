import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import { Mypage } from "./pages/mypage";
import { ModifyMyinfo } from "./pages/modifyMyinfo";
import { AddPost } from "./pages/addPost";
import { ModifyPost } from "./pages/modifyPost";
import { PostDetails } from "./pages/postDetails";

import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";

import { TagSearch } from "./pages/tagSearch";
import { CommentContainer } from "./components/commentContainer";
import { NaverCallback } from "./pages/naverCallback";
import { KakaoCallback } from "./pages/kakaoCallback";
import { KeywordsSearch } from './pages/keywordsSearch';

import { LocationSearch } from "./pages/locationSearch";
import { MyPics } from "./pages/categories/myPics";
import { MostLikes } from "./pages/categories/mostLikes";
import { NewPics } from "./pages/categories/newPics";
import { Favorites } from "./pages/categories/favorites";
import { LandingPage } from "./pages/landingPage";

const GlobalStyles = createGlobalStyle`
    
    html {
      body{
        font-family: 'NanumSquareRound', sans-serif;
        color : #000;
      }

      a {
        color : black;
      }
    }


    
    ${reset}
    .main{
      /* overflow: hidden; */
      /* 모달이 열린 경우 뒤의 화면의 스크롤이 생기지 않게 하려면 위의 내용을 추가시켜 줘야한다. */
      /* 모달이 열린 경우를 상태로 저장하여 클래스이름을 조건부 렌더링하면 해결 가능할 듯 */
      /* true ? className="main activeModal" : className="main"*/
    }
`;

const Container = styled.div`
position: relative;
width: 100vw;
min-height: 100vh;
`

const InnerContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  
  height: max-content;
  min-height: 800px;
  
  margin-top: 100px;
  margin-bottom: 200px;

  @media screen and (max-width : 500px) {
    margin-top: 150px;
  }
`


export const App = () => {
  useEffect(() => {
    console.log(
      `⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠋⠉⠉⠉⠙⠛⢿⠿⠛⠛⠛⠛⠛⠿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡿⠁⠀⠀⢀⡀⠤⠤⢄⣀⠐⡄⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⠟⠀⠀⠀⠐⠁⠀⠀⢀⣀⣀⣉⣒⣄⠉⠉⠉⢉⣀⣂⠈⠙⠻⣿⣿
⣿⣿⣿⠟⠉⡄⠀⠀⠀⠠⠤⣐⠭⠒⠉⠉⠉⠉⣒⣳⠈⠛⠂⠀⠀⣒⣛⡢⠈⢿
⣿⣿⠁⠀⠀⠃⠀⠀⠈⠛⠛⠠⣤⣶⠖⠙⠀⡉⢻⡿⣶⣿⣿⠁⡂⠠⠈⢿⠗⢸
⣿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⠂⠭⠤⠤⠤⣤⠄⠊⠀⠀⠈⠀⠀⠀⠀⢀⣶⣿
⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠒⠉⠀⠀⠀⠈⠁⠒⠂⠈⠁⠘⢿⣿⣿
⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿
⡇⠀⠀⠀⠀⠀⠀⠀⠀⣾⣟⣛⣛⣻⡶⠶⠶⣶⣤⣤⣤⣤⣤⣤⣤⡶⠾⢃⣼⣿
⣷⡀⠀⠀⠀⠀⠀⠘⢄⡀⠀⠀⠉⠉⠙⠛⠛⠛⠓⠛⠻⠿⠿⠷⠿⠟⢃⣼⣿⣿
⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⡿⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿
⣿⡿⠁⠀⠀⢠⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡶⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠃⠀⠀⢀⡞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣇⠀⢠⢶⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡄⠀⢠⠞⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠋⢸⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡏⠀⠀⠀⠀⢰⣶⣤⣤⣤⣤⣤⣴⣦⡀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣷⣄⣀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣄⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿
Made By 박우용, 조승호, 이상훈, 최경락`
    )
  }, [])
  const sessionStorage = window.sessionStorage;
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('loginToken') && sessionStorage.getItem('userId')) {
      (async () => {
        const res = await axios.post(`${process.env.REACT_APP_SERVER_PATH}/api/users/auth/token/validate`,
          {
            token: sessionStorage.getItem("loginToken")
          });

        if (res.data.valid === true) {
          if (sessionStorage.getItem("loginToken") && sessionStorage.getItem("userId")) {
            setIsLogin(true)
          }
        } else if (res.data.valid === false) {
          const res = await axios.get(`${process.env.REACT_APP_SERVER_PATH}/api/users/auth/token`);
          if (res.status === 200) {
            sessionStorage.setItem("userId", res.data._id)
            sessionStorage.setItem("loginToken", res.data.accessToken)
            sessionStorage.setItem("loginMethod", "common")
            setIsLogin(true)
          } else {
            window.sessionStorage.clear()
            setIsLogin(false)
          }
        }
      })()
    }
  }, [])

  // 만약 엑세스 토큰이 유효하지 않은 경우에 위의 리프레시 토큰을 이용하여 갱신하는 로직을 실행
  // 엑세스 토큰이 유효하다면 세션 스토리지 내부의 토큰과 아이디를 꺼내 사용.
  // 만약 전부 유효하지 않다면 로그인 상태를 false 로 갱신하고, 세션 스토리지를 비운다.

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Container>
      <GlobalStyles />
      <Navbar isLogin={isLogin} />
      <InnerContainer>
        <Routes>
          <Route path="main" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />

          <Route path="most_likes" element={<MostLikes />} />
          <Route path="my_pics" element={<MyPics />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="new_pics" element={<NewPics />} />

          <Route path="add_post" element={<AddPost />} />

          <Route path="posts/:id" element={<PostDetails />} />
          <Route path="posts/:id/modify/" element={<ModifyPost />} />
          <Route path="posts/:id/comment" element={<CommentContainer />} />

          <Route path="tags" element={<TagSearch />} />
          <Route path="location" element={<LocationSearch />} />
          <Route path="keywords" element={<KeywordsSearch />} />

          <Route path="mypage/modify/" element={<ModifyMyinfo />} />
          <Route path="mypage" element={<Mypage />} />

          <Route path="callback/kakao" element={<KakaoCallback />} />
          <Route path="callback/naver" element={<NaverCallback />} />
        </Routes>
      </InnerContainer>
      <Footer />
    </Container>
  );
};
ß