import React from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LoadingIndicator } from '../components/loadingIndicator';

const Container = styled.div`
  position : relative;
  display: flex;
  justify-content: center;

  top: 200px;

  width: 100%;

  .wrapper {
    text-align: center;

    div {
      margin-bottom: 50px;
      font-size: 1.1rem;
      color: #888;
    }
  }
`

export const KakaoCallback = () => {

  const sessionStorage = window.sessionStorage
  const serverPath = process.env.REACT_APP_SERVER_PATH;
  const navigate = useNavigate()

  const userId = sessionStorage.getItem("userId")
  const loginToken = sessionStorage.getItem("loginToken")

  const kakaoCode = new URLSearchParams(window.location.search).get('code');
  (async () => {
    if (!kakaoCode && !userId && !loginToken) navigate('main')
    if (kakaoCode) {
      const res = await axios.post(`${serverPath}/api/users/oauth/kakao`, {
        code: kakaoCode
      })
      if (res.status === 200) {
        sessionStorage.setItem("userId", res.data._id)
        sessionStorage.setItem("loginToken", res.data.accessToken)
        sessionStorage.setItem("loginMethod", "social")
        window.location.reload()
      }
    } else {
      navigate()
    }
  })()

  return (
    <Container>
      <div className="wrapper">
        <div>리다이렉팅 중</div>
        <LoadingIndicator size={'5rem'} />
      </div>
    </Container>
  )
}