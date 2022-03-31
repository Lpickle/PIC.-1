import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BsCameraFill } from "react-icons/bs";
import { IoLocateSharp as LocationPin, IoSearch } from "react-icons/io5";

import { PageTitle } from '../components/pageTitle';
import { TagSelection } from '../components/tagSelection';
import { LoadingIndicator } from "../components/loadingIndicator";
import { BtnComponent as Btn } from '../components/BtnComponent';

import { PlaceSearch } from '../modals/placeSearch';


const Container = styled.section`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 1200px;
  height: max-content;

  section{
    margin-bottom: 20px;
  }

  .category {
    font-size : 1.5rem;
    margin-bottom: 10px;
  }

  input,
  textarea {
    border-radius: 3px;
    border : 1px solid #aaa;
  }
`

const InnerContainer = styled.div`
  grid-column: 3 / 11;
  height: max-content;
`

const BoxContianer = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const UploadImageBox = styled.section`
  display: grid;
  place-items: center;

  width: calc(50% - 5px);
  aspect-ratio: 1 / 1;
  
  background-color: ${props => props.img ? '#000' : '#fff'};
  background-image: ${props => props.img ? `url(${props.img})` : null};
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;

  box-shadow: 0px 3px 5px rgba(0,0,0,0.3);

  border-radius: 10px;

  transition : 0.2s;
  
  color: #aaa;

  &:hover{
    background-color: ${props => props.img ? '#000' : '#FFEA7C'};
    color : #555;
  }

  .click_for_upload {
    text-align: center;

    user-select: none;

    svg{
      font-size: 3rem;
    }
  }
  cursor: pointer;
`

const KakaoMapBox = styled.section`
  width: calc(50% - 5px);
  aspect-ratio: 1 / 1;
  background-color: #aaa;
  box-shadow: 0px 3px 5px rgba(0,0,0,0.3);

  border-radius: 10px;
`

const BtnOnMap = styled.div`
  position: absolute;

  display: flex;
  justify-content: center;
  align-items: center;

  width: max-content;
  height: 1.5rem;
  padding: 0 6px;

  background-color: #fff;
  border-radius: 1.5rem;
  box-shadow: 0px 2px 3px rgba(0,0,0,0.3);

  color: #666;

  z-index: 2;

  cursor : pointer;

  span {  
    position: relative;
    top: 1px;

    font-size: 0.9rem;
  }

  svg {
    margin-left: 5px;
  }

  transition: 0.1s;

  &:hover {
    background-color: #ffd600;
    color: #000;
  }
`
const MyLocationBtn = styled(BtnOnMap)`
  top: 17px;
  right: 17px;
`

const LocationSearchBtn = styled(BtnOnMap)`
  bottom: 17px;
  right: 17px;
`


const TitleContainer = styled.section`
  input {
    width: 100%;
    height: 35px;

    box-sizing: border-box;

    padding-left: 10px;
    font-size: 1.2rem;

    outline : none;
    &:focus {
      outline: 3px solid #FFD600;
      border: #FFD600;
    }
  }
`

const TagContainer = styled.section`

`

const DescContainer = styled.section`
  textarea {
    width: 100%;
    min-height: 300px;
    box-sizing: border-box;
    padding: 10px;

    font-family: sans-serif;
    font-size: 1.1rem;

    resize: none;
    overflow: hidden;
    // 히든을 줌으로써 스크롤을 없앰 -> 크기에 맞게 늘어나니 스크롤은 보이지 않지만, 내용은 다 보인다.

    &:focus {
      outline: 3px solid #FFD600;
      border: #FFD600;
    }

  }
`



export const ModifyPost = () => {

  const kakao = window.kakao

  const serverPath = process.env.REACT_APP_SERVER_PATH
  const imgbbApi = process.env.REACT_APP_IMGBB_API_KEY
  const accessToken = window.localStorage.getItem('loginToken')

  const [imgBase64, setImgBase64] = useState(null)
  const [imgHostUrl, setImgHostUrl] = useState('')

  const [location, setLocation] = useState(null)
  const [address, setAddress] = useState([])

  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingMyLocation, setIsLoadingMyLocation] = useState(false)

  const [title, setTitle] = useState('')
  const [description, setDesctription] = useState('')
  const [tags, setTags] = useState(null)

  const [openSearchModal, setOpenSearchModal] = useState(false)

  const params = useParams()

  const imgInput = useRef()
  const kakaoMap = useRef()
  const descArea = useRef()




  // 게시글의 아이디를 받아서 ㅇㅋ
  // 해당 게시글의 내용을 가져오기위해 요청을 보냄 ㅇㅋ
  // 가져온 게시글의 정보를 이용해서 사진, 지도, 태그, 설명을 미리채움 반 ㅇㅋ

  // !!!! 태그가 문제임

  // 이후 patch 요청을 보낸다.


  // useState(() => {
  //   // axios.get(`${serverPath}/posts/${params.id}`)
  //   const data = {
  //     title: "고양이",
  //     description: "고앵이이이\n\n고\n\n앵\n\n이",
  //     photo: "https://i.ibb.co/RSJ4DBk/468081180d1c.jpg",
  //     location: {
  //       latitude: 37.496683618601395,
  //       longitude: 127.02467216931328,
  //       roadAdd: "제주특별자치도 제주시 첨단로 242",
  //       lotAdd: "제주특별자치도 제주시 영평동 2181",
  //     },
  //     hashtags: {
  //       keywords: ["제주도", "일상", "신나는", "화창한", "밤",],
  //       myTags: ["고앵이", "졸리다"]
  //     }
  //   };
  //   setTitle(data.title)
  //   setDesctription(data.description)
  //   setLocation(data.location)
  //   setTags(data.hashtags)
  //   setImgHostUrl(data.photo)
  // }, [])

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${serverPath}/api/posts/${params.id}`)
      const data = res.data.post
      console.log(data)

      if (res.status === 200) {
        setTitle(data.title)
        setDesctription(data.description)
        setLocation(data.location)
        setTags(data.hashtags)
        setImgHostUrl(data.photo)
      }
    })()
  }, [])


  // 이미지 읽어오기
  const uploadImage = (e) => {
    e.preventDefault()
    let img = e.target.files[0]

    const reader = new FileReader()

    reader.readAsDataURL(img)
    reader.onload = () => {
      setImgBase64(reader.result.split(',')[1])
    }
  }

  // 이미지가 읽히고 나면 요청 전송
  useEffect(() => {
    if (imgBase64) {
      (async () => {
        setIsUploading(true)

        const form = new FormData()
        form.append('key', imgbbApi)
        form.append('image', imgBase64)

        const res = await axios.post('https://api.imgbb.com/1/upload', form)
        setImgHostUrl(res.data.data.url)

      })()
    }
  }, [imgBase64])

  useEffect(() => {
    setTimeout(() => {
      setIsUploading(false)
    }, 900)

  }, [imgHostUrl])

  // 카카오 지도 API 사용
  useEffect(() => {
    console.log('맵리렌더')
    const container = kakaoMap.current
    let options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표, 추후에 위치 지정하기.
      level: 3
    }

    const map = new kakao.maps.Map(container, options)

    const marker = new kakao.maps.Marker()

    marker.setMap(map)

    // 현재 위치가 있는 경우 해당 위치에 마커를 표시한다.
    if (location) {
      marker.setPosition(new kakao.maps.LatLng(location.latitude, location.longitude))
      const latlng = marker.getPosition() // 이동한 좌표
      map.setCenter(latlng)
    }


    kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
      let latlng = mouseEvent.latLng
      marker.setPosition(latlng) // 클릭한 좌표

      setLocation({
        latitude: latlng.getLat(), //위도
        longitude: latlng.getLng() //경도
      })
    })
  }, [location])

  // location 상태가 바뀔 때 
  useEffect(() => {
    let geocoder = new kakao.maps.services.Geocoder()
    if (location) {

      geocoder.coord2Address(location.longitude, location.latitude, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0].road_address) {
          setAddress(
            {
              roadAdd: result[0].road_address.address_name, // 도로명 주소
              lotAdd: result[0].address.address_name // 지번 주소
            }
          )
        } else {
          setAddress(
            {
              roadAdd: null,
              lotAdd: result[0].address.address_name
              // 도로명 주소는 없을 수 있으므로, 도로명 주소가 없다면 null 을 전달한다.
            }
          )
        }
      })

    }
  }, [kakao.maps.services.Geocoder, kakao.maps.services.Status.OK, location])

  // 내 위치 가져오기
  const getMyLocation = () => {
    setIsLoadingMyLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          setLocation(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          )
          setIsLoadingMyLocation(false)
        }
      })
    } else {
      setIsLoadingMyLocation(false)
      // 모달 상태
    }
  }

  const autoResizing = () => {
    const textarea = descArea.current
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  // -> 주소검색, 지도 크게 보기, 내위치 

  const ImageContainer = () => {
    if (isUploading) {
      return (
        <LoadingIndicator size="7rem" />
      )
    }
    if (!isUploading && !imgHostUrl) {
      return (<div className='click_for_upload'>
        <BsCameraFill />
        <p>클릭하여 이미지 업로드</p>
      </div>)
    }
    if (imgHostUrl) {
      return null
    }
  }
  const patchPost = () => {
    const headers = {
      headers: {
        Authorization: accessToken
      }
    }
    const body = {
      newTitle: title,
      newDescription: description,
      newPhoto: imgHostUrl,
      newLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
        roadAdd: address.roadAdd,
        lotAdd: address.lotAdd
      },
      newHashtags: tags
    }
    axios.patch(`${serverPath}/api/posts/${params.id}`, body, headers)
  }

  const modalHandler = (modal) => {
    if (modal === "search") {
      openSearchModal ? setOpenSearchModal(false) : setOpenSearchModal(true);
    }
  }

  return (
    <Container>
      {openSearchModal ? <PlaceSearch setLocation={setLocation} closeFn={() => modalHandler('search')} /> : null}
      <InnerContainer>
        <PageTitle>게시글 수정</PageTitle>
        <BoxContianer>
          <input type="file" accept="image/*" style={{ display: 'none' }} ref={imgInput} onChange={uploadImage} />
          <UploadImageBox onClick={() => imgInput.current.click()} img={imgHostUrl}>
            <ImageContainer />
          </UploadImageBox>
          <KakaoMapBox ref={kakaoMap}>
            <MyLocationBtn onClick={getMyLocation}>
              <span>{isLoadingMyLocation ? '위치를 가져오는 중...' : '내 위치'}</span>
              <LocationPin />
            </MyLocationBtn>
            <LocationSearchBtn onClick={() => modalHandler('search')}>
              <span>주소로 검색하기</span>
              <IoSearch />
            </LocationSearchBtn>
          </KakaoMapBox>
        </BoxContianer>
        <TitleContainer>
          <h3 className='category'>사진 이름</h3>
          <input type="text" spellCheck={false} onChange={(e) => setTitle(e.target.value)} value={title} />
        </TitleContainer>
        <TagContainer>
          <h3 className='category'>태그</h3>
          { tags ? <TagSelection setTags={setTags} tags={tags} /> : null}
        </TagContainer>
        <DescContainer>
          <h3 className='category'>사진 설명</h3>
          <textarea ref={descArea} onKeyUp={autoResizing} spellCheck={false} onChange={(e) => setDesctription(e.target.value)} value={description}></textarea>
        </DescContainer>
        {title 
          ? <Btn action={patchPost} width={'100%'}>게시글 수정하기</Btn> 
          : <Btn disabled={true} width={'100%'}>게시글 수정하기</Btn>
        }
      </InnerContainer>
    </Container >
  );
};
