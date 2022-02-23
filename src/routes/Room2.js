import { Suspense, useEffect, useState } from "react";
import { useParams } from "react-router";
import { connect } from "react-redux";
import Overworld from "../game/Overworld";
import { Person } from "../game/Person";
import Gallery2 from "../components/Gallery2";
import styled from "styled-components";
import LoadingComponent from "../components/Loading";
import RoomSideBar from "../components/RoomSidebar";
import { user } from "../config/api";
import VideoButton from "../components/VideoButton";
import ScreenBottomBar from "../components/ScreenBottomBar";

const pexel = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;
const images = [
  // Front
  {
    position: [0, 0, 2.5],
    rotation: [0, 0, 0],
    url: "https://www.comedywildlifephoto.com/images/wysiwyg/images/2020_winners/mark_fitzpatrick.jpg",
    center: "center",
  },
  // Back
  {
    position: [6, 0.1, 3.25],
    rotation: [0, -Math.PI / 4, 0],
    url: pexel(416430)
  },
  // {
  //   position: [6, 0, 2.75],
  //   rotation: [0, 0, 0],
  //   url: pexel(310452)
  // },
  // Left
  {
    position: [-6, 0.1, 3.25],
    rotation: [0, Math.PI / 4, 0],
    url: pexel(327482),
  },
  // {
  //   position: [-6, 0, 2.75],
  //   rotation: [0, 0, 0],
  //   url: pexel(325185),
  // },
  // {
  //   position: [-2, 0, 2.75],
  //   rotation: [0, Math.PI / 2.5, 0],
  //   url: pexel(358574),
  // },
  // // Right
  // {
  //   position: [1.75, 0, 0.25],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(227675),
  // },
  // {
  //   position: [2.15, 0, 1.5],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(911738),
  // },
  // {
  //   position: [2, 0, 2.75],
  //   rotation: [0, -Math.PI / 2.5, 0],
  //   url: pexel(1738986),
  // },
];


const StreamsContainer = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  top: 60px;
  width: 100%;
  height: 100px;
  justify-content: center;
  align-items: center;

  div {
    width: 200px;
    margin-right: 20px;

    .userVideo {
      width: 200px;
      border-radius: 10px;
      /*Mirror code starts*/
      transform: rotateY(180deg);
      -webkit-transform: rotateY(180deg); /* Safari and Chrome */
      -moz-transform: rotateY(180deg); /* Firefox */

      /*Mirror code ends*/
      &:hover {
        outline: 2px solid red;
        cursor: pointer;
      }
    }
  }
`;

const MyVideoBox = styled.div`
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 200px;
  z-index: 99;
`;

const MyVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
`;

const CamBtn = styled.div`
  display: none;
`;

const CharacterNickname = styled.div`
  span {
    color: white;
  }
`;

const ThreeCanvas = styled.div`
  canvas {
    width: 100vw;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  //  .game-container{
  //    position: fixed;
  //    width: 500px;
  //    height: 200px;
  //    right:0;
  //    left: 50%;
  //    transform: translateX(-50%);
  //  }
`;

const Room2 = ({ userData }) => {
  const params = useParams();
  const roomId = params.roomId;
  const [isLoading, setIsLoading] = useState(false);
  const [cameraPosition, setCameraPosition] = useState(0);
  const [yCameraPosition, setYCameraPosition] = useState(0);
  const downHandler = (e) => {
    switch (e.key) {
      case "x" || "X" || "ㅌ":
        window.location.replace(`/room/${roomId}`);
      // navigator(`/room/${roomId}`);
    }
  }
  // const upHandler = () => {

  // }
  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    // window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      // window.removeEventListener("keyup", upHandler);
    };
  }, []);
  useEffect(() => {
    userData.then((data) => {
      Overworld({
        config: document.querySelector(".game-container"),
        mainContainer: document.querySelector(".mainContainer"),
        nickname: data.nickname,
        setCameraPosition: setCameraPosition,
        setYCameraPosition: setYCameraPosition,
        Room: {
          RoomSrc: null,
          id: 123,
          roomNum: 2,
          roomId: roomId,
          gameObjects: {
            player: new Person({
              id: null,
              isPlayerControlled: true,
              x: 480,
              y: 200,
              src: data.character,
            }),
          },
        },
        adjust: {
          xaxios: 0,
          xratio: 1,
          yaxios: 0,
          yratio: 1,
        },
        otherMaps: [
          {
            x: 80,
            y: 96,
            url: `http://localhost:3000/room/${roomId}`,
          },
        ],
      });
    });
    // overworld.init();
  }, []);

  useEffect(() => {
    const loadingFn = () => {
      setIsLoading(true);
    };

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    loadingFn();
  }, []);

  return (
    <div className="mainContainer" style={{backgroundColor: "#191920" }}>
      {isLoading && <LoadingComponent background={true} />}
      <ThreeCanvas>
        <Suspense fallback={null}>
          <Gallery2 images={images} roomId={roomId} cameraPosition={cameraPosition} yCameraPosition={yCameraPosition} />
        </Suspense>
      </ThreeCanvas>
      <RoomSideBar />
      <div style={{
        display: "flex", justifyContent: "center",
        position: "fixed",
        bottom: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "center",
        backgroundColor: "rgb(19,19,20, 0)"
      }}>
        <div className="game-container" style={{ backgroundColor: "rgb(19,19,20, 0)"}}>
          <canvas className="game-canvas"></canvas>
          <CharacterNickname className="nickname">
          </CharacterNickname>
        </div>
      </div>
      <StreamsContainer id="streams"></StreamsContainer>
      <MyVideoBox>
        <MyVideo id="myFace" autoPlay="autoplay"></MyVideo>
        <CamBtn id="camBtn">
          <VideoButton />
        </CamBtn>
      </MyVideoBox>
      <ScreenBottomBar />
    </div>
  );
};

function mapStateProps(state) {
  return {
    userData: state,
  }
}

export default connect(mapStateProps)(Room2);
