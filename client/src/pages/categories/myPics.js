import styled from 'styled-components';

import { PageTitle } from '../../components/pageTitle';
import { AddPostFloatBtn } from "../../components/addPostFloatBtn";

import { PostContainer } from "../../components/postContainer";
import { useState } from 'react';
import { useEffect } from 'react';

const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 1200px;
  height: max-content;
`

const InnerContainer = styled.div`
  position: relative;
  grid-column: 2 / 12;
  height: max-content;
`
export const MyPics = () => {

  const [reqEndpoint, setReqEndpoint] = useState('')

  const serverPath = process.env.REACT_APP_SERVER_PATH
  const userId = window.sessionStorage.getItem('userId')

  useEffect(() => {
    setReqEndpoint(`${serverPath}/api/posts?date=true&mypost=${userId}`)
  }, [])

  return (
    <Container>
      <InnerContainer>
        {userId && <AddPostFloatBtn />}
        <PageTitle>나의 사진</PageTitle>
        <PostContainer category={'my_pics'} reqEndpoint={reqEndpoint} />
      </InnerContainer>
    </Container >
  );
};
