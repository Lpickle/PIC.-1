import React, { useState } from 'react'
import axios from 'axios'
import { useParams } from "react-router-dom";
import styled from 'styled-components';
import { useEffect } from 'react';
import { BsPencilFill, BsFillTrashFill, BsCheck } from "react-icons/bs";
import { useRef } from 'react';
import { TwoBtnModal } from "./twoBtnModal";

const Container = styled.section`
position: relative;
width: 100%;
height: max-content;

margin-top: 30px;

.timestamp {
  position: absolute;
  right: 15px;
  top: -13px;

  font-size: 0.8rem;
  color: #888;

  z-index: 1;
  }

  @media screen and (max-width : 500px){
    .timestamp {
      left: 0;
    }
  }
  
`

const CommentContent = styled.div`
  position: relative;

  display : flex;
  align-items: center;

  /* background-color: #FFF2AE; */
  box-sizing: border-box;

  min-height: 40px;
  height: max-content;
  border: 1px solid #eee;
  border-radius: 25px;

  box-shadow: 0px 2px 3px rgba(0,0,0,0.2);
`

const Content = styled.div`
  width: 100%;

  position: relative;

  padding-left: 130px;
  padding-top: 2px;
  
  box-sizing: border-box;

  display: flex;
  align-items: center;

  .user_wrapper {
    position: absolute;
    left: 0;
    display : flex;
    align-items: center;
  }

  .nick {
    position: relative;
    top: 2px;

    width: 100px;
    
    padding-top: 2px;

    font-size: 1rem;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  pre {
    width: 100%;
    word-break: break-all;
    white-space: pre-wrap;
    padding: 10px 100px 10px 10px;
    position: relative;
    top: 2px;
  }

  .edit_field {
    width: 85%;
    height: 100px;

    font-family: sans-serif;

    padding: 10px;
    margin: 5px 0;

    resize: none;

    border: 1px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;

    &:focus {
      background-color: #fffef7;
      outline: none;
    }
  }

  @media screen and (max-width : 500px){
    padding-left: 90px;
    min-height: 70px;

    .user_wrapper {
      width: 28%;
      display: grid;
      place-items: center;
      text-align: center;
    }

    .nick {
      width: 100px;
    }

    pre {
      position: relative;
      padding : 10px;
    }
  }
`
const ProfilePic = styled.div`
  /* position: absolute; */

  width: 35px;
  height: 35px;
  
  margin-right: 7px;
  
  background: ${props => props.url ? `url(${props.url})` : null};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  border-radius: 50%;

  @media screen and (max-width : 500px){
    margin-right: 0;
  }
  `

const BtnWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 10px;
  right: 14px;

  .btn {
    margin-left: 13px;
    color: #333;

    cursor: pointer;

    transition: 0.1s;
  }
  .edit:hover{
    color: #91d92e;
    transform: scale(1.2);
  }

  .delete:hover{
    color: #ff796b;
    transform: scale(1.2);
  }

  .done:hover{
    color: #91d92e;
    transform: scale(1.2);
  }

  @media screen and (max-width : 500px){
    top: -20px;
  }
`


export const Comment = ({ data }) => {
  const { description, author, nickname, _id, createdAt } = data
  const serverPath = process.env.REACT_APP_SERVER_PATH;
  const { id } = useParams()
  const sessionStorage = window.sessionStorage;
  const userId = sessionStorage.getItem("userId")
  const loginToken = sessionStorage.getItem("loginToken")

  const [text, setText] = useState(description)
  const [edit, setEdit] = useState(false)
  const [userPic, setUserPic] = useState(null)

  const [openLoginModal, setOpenLoginModal] = useState(false)

  const editField = useRef()

  useEffect(() => {
    const getProfilePic = async () => {
      const res = await axios.get(`${serverPath}/api/users/${author}`)
      setUserPic(res.data.userInfo.image)
    }

    if (data) {
      getProfilePic()
    }
  }, [])

  const headers = {
    headers: {
      "Authorization": loginToken
    }
  }


  const commentDelete = async () => {
    await axios.delete(`${serverPath}/api/posts/${id}/comments/${_id}`, headers)
    window.location.reload()
  }

  const modifyComment = async () => {
    await axios.patch(`${serverPath}/api/posts/${id}/comments/${_id}`, {
      newDescription: text
    }, headers)
    setEdit(false)
  }

  const editOn = () => {
    setEdit(true)
  }

  const handleChange = (e) => {
    setText(e.target.value)
  }

  const Timestamp = () => {
    const date = new Date(createdAt)

    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()

    const hour = date.getHours()
    const min = date.getMinutes()


    return (
      <div className="timestamp">{y}. {m + 1}. {d} / {hour}:{min}</div>
    )
  }

  const modalHandler = (modal) => {
    if (modal === "delete") {
      openLoginModal ? setOpenLoginModal(false) : setOpenLoginModal(true);
    }
  };


  return (
    <Container>
      {openLoginModal && <TwoBtnModal close={() => modalHandler('delete')} action={commentDelete} main={'댓글을 삭제하시겠습니까?'}/>}
      <CommentContent>
        <Content>
          <div className="user_wrapper">
            <ProfilePic url={userPic} />
            <div className='nick'>{nickname}</div>
          </div>
          {edit
            ? (
              <textarea className='edit_field' spellCheck={false} type="text" value={text} onChange={(e) => handleChange(e)} />)
            : (
              <pre>{text}</pre>
            )
          }
          <BtnWrapper>
            {author === userId && !edit ? <div className='btn edit' onClick={editOn}><BsPencilFill /></div> : null}
            {author === userId && !edit ? <div className='btn delete' onClick={() => modalHandler('delete')}><BsFillTrashFill /></div> : null}
            {edit ? <div className='btn done' onClick={modifyComment}><BsCheck size={'2rem'}/></div> : null}
          </BtnWrapper>
        </Content>
      </CommentContent>
      <Timestamp />
    </Container>
  )
}
