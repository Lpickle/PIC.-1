import react from "react";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Container = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, 1fr);

  width: 1200px;
  height: max-content;
`;

const InnerContainer = styled.div`
  grid-column: 3 / 11;

  display: flex;
  flex-direction: column;

  min-height: max-content;

  align-items: center;

  .BtnWrapper {
    width : 100%;
    display : flex;
    column-gap : 10px;
  }
`;

const KakaoMapBox = styled.section`
  width: 100%;
  aspect-ratio: 2 / 1;
  background-color: #aaa;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);

  border-radius: 10px;

  @media screen and (max-width: 500px) {
    width: 100%;
    aspect-ratio: 2 / 1;
  }
`;

const SelectDistance = styled.div`
  position : relative;

  display : grid;
  place-items : center;

  width : 50px;
  height : 20px;
  border : 1px solid #ddd;
  border-radius : 5px;

  box-shadow : 0px 2px 3px rgba(0,0,0,0.2);

  cursor : pointer;

  span {
    position : relative;
    top : 2px;
  }

  transition : 0.1s;

  &:hover {
    background-color : #FFEA7C;
  }
`;

export const LocationSearch = () => {
  // 일단 지도불러오기
  // -> 게시글의 위치에 마커 찍기
  // -> 마커 찍고나면 커스텀 오버레이 천천히 해보기
  // 거리 옵션 설정 버튼 만들기
  // 옵션태그 써서 정렬 기준 만들기
  // 썸네일 불러오기
  // -> 게시글 전체 한번에 불러와야함
  // -> 페이지네이션 없는 무한 스크롤 만들기.
  const serverPath = process.env.REACT_APP_SERVER_PATH
  const [centerPosition, setCenterPosition] = useState([]);
  const [distance, setDistance] = useState('100')

  const kakao = window.kakao;
  const kakaoMap = useRef();

  useEffect(() => {
    const mapContainer = kakaoMap.current;
    let options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const map = new kakao.maps.Map(mapContainer, options);

    const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
    // 마커 표시 될 위치

    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    kakao.maps.event.addListener(map, "dragend", () => {
      let latlng = map.getCenter(); // 현재 지도의 중심좌표를 가져옴.
      marker.setPosition(latlng);
      console.log(latlng, "HERE");

      setCenterPosition([latlng.Ma, latlng.La]);
    });
  }, []);

  useEffect(() => {
    // const res = axios.get(`${serverPath}/api/posts`)
    console.log('국군지휘통신사령부 요청가즈아')
  }, [centerPosition, distance])

  return (
    <Container>
      <InnerContainer>
        <KakaoMapBox ref={kakaoMap} />
        {centerPosition && (
          <div>
            현재 중앙 좌표 : {centerPosition}
          </div>
        )}
        {/* Ma -> 위도, La -> 경도 */}
        <div className="BtnWrapper">
          <SelectDistance onClick={() => setDistance('100')}><span>100m</span></SelectDistance>
          <SelectDistance onClick={() => setDistance('300')}><span>300m</span></SelectDistance>
          <SelectDistance onClick={() => setDistance('500')}><span>500m</span></SelectDistance>
          <SelectDistance onClick={() => setDistance('1000')}><span>1 km</span></SelectDistance>
          <SelectDistance onClick={() => setDistance('3000')}><span>3 km</span></SelectDistance>
        </div>
      </InnerContainer>
    </Container>
  );
};

// 위치에 대한 옵션 제공 -> 필요하지 않음
// -> 내 위치 혹은, 지도에서 주소검색 이용해서 위치를 정할 수 있음
// 그리고 그 위치를 중심좌표로 이용해서 주변 반경 nkm 의 사진을 불러 오는 것

// 저렇게 받아온 배열, 여기서 sort -> 좋아요 순 혹은 날짜 순으로 정렬해서 보여주기.
// if -> API 내부에서 페이지 값이 없을때, 반환하는 값이 없다면 할 수 없음
// 왜냐? 정렬을 하기 위해선 위치 조건에 부합하는 전체 게시물을 받아와서 정렬해야 하기 때문
// 만약 일부의 데이터만 가져와서 정렬한다? 원하는 값이 아니게됨.

// api 자체가 거리만 기준으로 하고, 페이지네이션 되어있다? 그럼 그냥 주변에서 가장 가까운 순의 사진만 보여 줄 수 있음
// -> 여기서는 상훈이 협조 필요

// 중심 좌표 기준 거리순(ok), 좋아요 순, 최신순
// 전체를 반환하나? 아니면 페이지네이션 되어있나.
// 만약 거리순에서, 전체반환이다? 프론트에서 해결 가능
// 페이지네이션? API 추가 필요

// 기능
// 1. 카카오 맵
// 1-1. 불러온 사진 지도 위에 마커에 표시하기
// 1-2. 거리 설정 버튼 추가하기
// 1-2-1. 거리 설정에 따라 지도의 확대 비율 조정
// 2. 무한스크롤
// 3. option 태그 이용한 정렬(거리, 최신, 좋아용)
