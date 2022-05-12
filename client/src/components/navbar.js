import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { OneBtnModal } from "./oneBtnModal";
import { TwoBtnModal } from "./twoBtnModal";
import { Login } from "../modals/login";
import { Signup } from '../modals/signup';

import { GoListUnordered, GoPerson } from "react-icons/go";

const Container = styled.header`
  position : relative;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-width: 1200px;
  height: 50px;

  background-color: #ffd600;
  font-size: 1rem;

  z-index: 998;

  a {
    text-decoration: none;

    &:visited {
      color: #000;
    }
  }

  @media screen and (max-width : 500px) {
    min-width: 0;
    position: fixed;
    top: 0;
  }
`;

const InnerContainer = styled.div`
  position : relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 20px;
  min-width: 1200px;

  z-index: 998;

  .logo {
    grid-column: 1/3;
    /* background-color: #000; */
  }

  .left-btns,
  .right-btns {
    margin-top: 4px;
  }

  .left-btns {
    grid-column: 3/7;
  }

  .right-btns {
    grid-column: 9/-1;

    div {
      cursor: pointer;
    }
  }

  .menu_mobile_btn {
    position: absolute;
    top: calc(50% - 12px);
    left: 1rem;
  }

  .user_mobile_btn {
    position: absolute;
    top: calc(50% - 12px);
    right: 1rem;
  }

  .menu_mobile_btn,
  .user_mobile_btn {
    display: none;
  }

  @media screen and (max-width : 500px) {
    width: 100%;
    display: block;
    min-width: 0;
    grid-gap: 0;

    .left-btns,
    .right-btns {
      display: none;
    }

    .menu_mobile_btn,
    .user_mobile_btn {
      display: block;
    }
  }
`;

const Logo = styled.div`
  font-family: "Sriracha", cursive;
  font-size: 2.3rem;
  text-align: center;
  cursor: pointer;
  span {
    color: #e80707;
  }

  @media screen and (max-width : 500px) {
    display: none;
  }
`;

const MobileLogo = styled(Logo)`
  display: none;

  @media screen and (max-width : 500px) {
    display: block;
  }
`

const LeftLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  place-items: center;
`;

const RightLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  place-items: center;
`;


const MobileMenu = styled.section`
  position: absolute;
  top : 49px;
  
  display: grid;
  width: 100%;
  height: max-content;

  grid-row-gap: 30px;

  box-sizing: border-box;
  padding: 20px;

  background-color: #ffd600;

  font-size: 1.2rem;
  z-index: 800;

  .category,
  .search {
    display: grid;
    grid-row-gap: 20px;
  }
`

const Backdrop = styled.div`
    position: fixed;
    top: 0; bottom : 0; left: 0; right : 0;
    background-color: rgba(0, 0, 0, 0.2);

    z-index: 1;
`


const Hline = styled.div`
    display: block;
    
    width: 100%;
    height: 1px;

    background-color: #666;
`

export const Navbar = ({ isLogin }) => {
  const navigate = useNavigate();
  const sessionStorage = window.sessionStorage;

  const [openModal, setOpenModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openTwoBtnModal, setOpenTwoBtnModal] = useState(false);

  const [leftMobileMenuOpen, setLeftMobileMenuOpen] = useState(false)
  const [rightMobileMenuOpen, setRightMobileMenuOpen] = useState(false)
  // 각 모달 컴포넌트가 열리고 닫혀있는지 확인하는 상태

  const modalHandler = (modal) => {
    openModal ? setOpenModal(false) : setOpenModal(true);

    if (modal === "login") {
      openLoginModal ? setOpenLoginModal(false) : setOpenLoginModal(true);
    }
    if (modal === "signup") {
      openSignupModal ? setOpenSignupModal(false) : setOpenSignupModal(true);
    }
    if (modal === "logout") {
      openTwoBtnModal ? setOpenTwoBtnModal(false) : setOpenTwoBtnModal(true);
    }
  };


  const handleLogout = () => {
    sessionStorage.clear()
    window.location.reload()
  }

  const leftMobileMenuClick = () => {
    leftMobileMenuOpen ? setLeftMobileMenuOpen(false) : setLeftMobileMenuOpen(true)
    setRightMobileMenuOpen(false)
  }

  const rightMobileMenuClick = () => {
    rightMobileMenuOpen ? setRightMobileMenuOpen(false) : setRightMobileMenuOpen(true)
    setLeftMobileMenuOpen(false)
  }

  return (
    <div>
      {/* 로그인 모달 */}
      {openLoginModal ? <Login closeFn={() => modalHandler("login")} setOpenLoginModal={setOpenLoginModal} setOpenSignupModal={setOpenSignupModal} /> : null}
      {/* 회원가입 모달 */}
      {openSignupModal ? <Signup closeFn={() => modalHandler('signup')} setOpenLoginModal={setOpenLoginModal} setOpenSignupModal={setOpenSignupModal} /> : null}
      {/* 로그아웃 시 확인 모달 */}
      {openTwoBtnModal
        ? <TwoBtnModal main={"로그아웃 하시겠습니까?"} close={() => modalHandler("logout")} action={() => handleLogout()} navigate={"/main"} />
        : null}

      <Container>
        <InnerContainer>
          <Logo className="logo" onClick={() => navigate("/main")}>PIC<span>.</span></Logo>
          <MobileLogo className="logo">PIC<span>.</span></MobileLogo>

          <GoListUnordered className="menu_mobile_btn" size={'1.5rem'} onClick={leftMobileMenuClick} />
          <GoPerson className="user_mobile_btn" size={'1.5rem'} onClick={rightMobileMenuClick} />

          <LeftLinks className="left-btns">
            <Link className="my_pics" to="my_pics">내 사진</Link>
            <Link className="most_likes" to="most_likes">인기사진</Link>
            <Link className="new_pics" to="new_pics">최신사진</Link>
            <Link className="favorites" to="favorites">즐겨찾기</Link>
          </LeftLinks>
          <RightLinks className="right-btns">
            <Link className="location" to="location">위치 검색</Link>
            <Link className="keywords" to="keywords">키워드 검색</Link>
            <Link className="tags" to="tags">태그 검색</Link>
            {isLogin
              ? <Link className="mypage" to="mypage"> 마이페이지</Link>
              : <div className="login" onClick={() => modalHandler("login")}>로그인</div>}
            {isLogin
              ? <div className="logout" onClick={() => modalHandler("logout")}>로그아웃</div>
              : <div className="signup" onClick={() => modalHandler("signup")}>회원가입</div>}
          </RightLinks>

        </InnerContainer>
        {
          leftMobileMenuOpen && (
            <MobileMenu>
              <div className="category">
                <Link className="my_pics" to="my_pics" onClick={() => setLeftMobileMenuOpen(false)}>내 사진</Link>
                <Link className="most_likes" to="most_likes" onClick={() => setLeftMobileMenuOpen(false)}>인기사진</Link>
                <Link className="new_pics" to="new_pics" onClick={() => setLeftMobileMenuOpen(false)}>최신사진</Link>
                <Link className="favorites" to="favorites" onClick={() => setLeftMobileMenuOpen(false)}>즐겨찾기</Link>
              </div>
              <Hline />
              <div className="search">
                <Link className="location" to="location" onClick={() => setLeftMobileMenuOpen(false)}>위치 검색</Link>
                <Link className="keywords" to="keywords" onClick={() => setLeftMobileMenuOpen(false)}>키워드 검색</Link>
                <Link className="tags" to="tags" onClick={() => setLeftMobileMenuOpen(false)}>태그 검색</Link>
              </div>
            </MobileMenu>
          )
        }
        {
          rightMobileMenuOpen && (
            <MobileMenu>
              {isLogin
                ? <Link className="mypage" to="mypage" onClick={() => setRightMobileMenuOpen(false)} > 마이페이지</Link>
                : <div className="login" onClick={() => {
                  modalHandler("login")
                  setOpenSignupModal(false)
                  setRightMobileMenuOpen(false)
                }}>로그인</div>}
              {isLogin
                ? <div className="logout" onClick={() => {
                  modalHandler("logout")
                  setRightMobileMenuOpen(false)
                }}>로그아웃</div>
                : <div className="signup" onClick={() => {
                  modalHandler("signup")
                  setOpenLoginModal(false)
                  setRightMobileMenuOpen(false)
                }}>회원가입</div>}
            </MobileMenu>
          )
        }
      </Container>
      {leftMobileMenuOpen || rightMobileMenuOpen ? <Backdrop /> : null}
    </div>
  );
};