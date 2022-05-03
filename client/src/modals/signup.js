import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BsXCircleFill } from "react-icons/bs";
import { BtnComponent as Btn } from "../components/BtnComponent";


const ModalContainer = styled.div`
  position : fixed;
  display: grid;
  place-items: center;

  top:0; left: 0; bottom: 0; right: 0;

  width: 100vw;
  height: 100vh;

  z-index: 998;

`;


const Backdrop = styled.div`
  position : fixed;
  top:0; left: 0; bottom: 0; right: 0;

  background-color: rgba(0,0,0,0.3);

  z-index: 998;
`

const Modal = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  background-color: white;
  width: 400px;
  height: 700px;
  border-radius: 15px;
  z-index: 999;
  
  h3 {
    margin-bottom: 6px;
  } 

  .fields {
    display: grid;
    justify-content: center;
    width: 305px;
    margin-bottom: 20px;
  }

  .fields input {
    width: 305px;
    height: 40px;
    margin-bottom: 15px;
    padding-left: 5px;
    box-sizing: border-box;
    border: 1px solid #aaa;
    border-radius: 3px;
    &:focus {
      outline: 3px solid #ffd600;
      border: transparent;
    }
  }
  .form {
    position: relative;
  }

  @media screen and (max-width : 500px) {
    width: 92%;
    height: 80%;
    overflow-y: auto;
  }
`;

const InnerContainer = styled.div`
  position: relative;
  top: 15px;
  height: max-content;

    @media screen and (max-width : 500px) {
    margin-top: 80px;
    margin-bottom: 50px;
  }
`;

const CloseBtn = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;

  color: #ff796b;

  transition: 0.1s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
`

const Nofication = styled.div`
  position: absolute;
  top: 2px;
  right: 0;
  font-size: 0.8rem; ;
`;

const Hline = styled.div`
  margin-top : 15px;
  margin-bottom : 15px;

  width: 100%;
  height: 1px;

  background-color: #ddd;
`

export const Signup = ({ closeFn, setOpenLoginModal, setOpenSignupModal }) => {

  const serverPath = process.env.REACT_APP_SERVER_PATH;

  const [email, setEmail] = useState("");
  const [isNotUsingEmail, setIsNotUsingEmail] = useState(false);

  const [isValidEmailCode, setIsValidEmailCode] = useState(false);
  const [isChecked, setIsChecked] = useState(false)
  const [emailCode, setEmailCode] = useState("");

  const [codeInputValue, setCodeInputValue] = useState("");

  const [nickname, setNickname] = useState("");
  const [isValidNickname, setIsValidNickname] = useState(true);

  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState('')

  const [passwordCheck, setPasswordCheck] = useState(false)

  const naviagate = useNavigate()

  const validateEmail = (value) => {
    // 이메일 유효성 검사
    const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return emailRegex.test(value);
  };

  const emailInputHandler = (e) => {
    setEmail(e.target.value)
    setIsChecked(false)
    setIsNotUsingEmail(false)
    setEmailCode('')
  }

  const emailCheckHandler = (e) => {
    (async () => {
      setIsChecked(true)
      if (email && validateEmail(email)) {
        try {
          const res = await axios.post(`${serverPath}/api/users/email`, {
            email: email,
          });
          if (res.status === 200) {
            setIsNotUsingEmail(true);
          }
        } catch (err) {
          setIsNotUsingEmail(false);
        }
      }
    })()
  };

  const sendEmailCode = async () => {
    const res = await axios.post(`${serverPath}/api/users/mail`, {
      email: email,
    });
    if (res.status === 200) {
      setEmailCode(res.data.authNum);
    }
  };

  const emailCodeHandler = (e) => {
    setCodeInputValue(e.target.value)

    if (emailCode === e.target.value) {
      setIsValidEmailCode(true);
    } else {
      setIsValidEmailCode(false);
    }
  };

  const validateNickname = (value) => {
    const nicknameRegex = /^[가-힣|a-z|A-Z|0-9|_]{2,12}$/;
    return nicknameRegex.test(value);
  };

  const nicknameCheckHandler = (e) => {
    setNickname(e.target.value);
  };

  useEffect(() => {
    (async () => {
      if (nickname && validateNickname(nickname)) {
        try {
          const res = await axios.post(`${serverPath}/api/users/nickname`, {
            nickname: nickname,
          });
          if (res.status === 200) {
            setIsValidNickname(true);
          }
        } catch (err) {
          setIsValidNickname(false);
        }
      }
    })();
  }, [nickname, serverPath]);

  useEffect(() => {
    if (password === retypePassword) {
      setPasswordCheck(true)
    } else {
      setPasswordCheck(false)
    }
  }, [password, retypePassword])

  const SignupHandler = async () => {
    const res = await axios.post(`${serverPath}/api/users`, {
      email: email,
      nickname: nickname,
      password: password,
    });
    if (res.status === 201) {
      setOpenLoginModal(true)
      setOpenSignupModal(false)
    }
  };

  const EmailNotification = () => {
    if (isChecked && !isNotUsingEmail && email && validateEmail(email)) {
      return <Nofication>중복된 이메일입니다.</Nofication>;
    }
    if (isChecked && isNotUsingEmail && email.length > 0 && validateEmail(email)) {
      return <Nofication>사용 가능한 이메일입니다.</Nofication>;
    }
    if (email && !validateEmail(email)) {
      return <Nofication>올바른 이메일을 입력하세요.</Nofication>;
    }
    return null;
  };

  const EmailCodeBtn = () => {
    return isNotUsingEmail ? <Btn action={sendEmailCode}>인증</Btn> : <Btn action={emailCheckHandler}>중복확인</Btn>;
  };

  const EmailCodeNotification = () => {
    if (emailCode && !isValidEmailCode && codeInputValue) {
      return <Nofication>코드가 서로 다릅니다.</Nofication>;
    }
    if (emailCode && isValidEmailCode && codeInputValue) {
      return <Nofication>코드가 일치합니다.</Nofication>;
    }
    if (!emailCode && codeInputValue) {
      return <Nofication>인증코드 전송이 필요합니다.</Nofication>;
    }
    if (emailCode) {
      return <Nofication>메일에 전송된 코드를 입력해주세요.</Nofication>;
    }
    return null;
  };


  // 닉네임 유효성검사
  const NicknameNofication = () => {
    if (!validateNickname(nickname) && nickname.length > 12 && nickname) {
      return <Nofication>닉네임은 12글자를 넘길 수 없습니다!</Nofication>;
    }
    if (!validateNickname(nickname) && nickname.length < 2 && nickname) {
      return <Nofication>닉네임은 2글자 이상이여야 합니다!</Nofication>;
    }
    if (!validateNickname(nickname) && nickname) {
      return <Nofication>한글, 영문, 숫자, _ ,- 만 입력 가능합니다!</Nofication>;
    }
    if (!isValidNickname && nickname && validateNickname(nickname)) {
      return <Nofication>이미 사용중인 닉네임입니다!</Nofication>;
    }
    if (nickname && isValidNickname) {
      return <Nofication>사용가능한 닉네임입니다.</Nofication>;
    }
    return null;
  };

  // 패스워드 유효성검사
  const PasswordNofication = () => {
    if (password && password.length < 8) {
      return <Nofication>8자 이상이여야 합니다.</Nofication>;
    }
    return null;
  };


  // 패스워드 확인
  const RetypePasswordNofication = () => {
    if (!passwordCheck && retypePassword) {
      // 두 값이 다르고, 확인 필드에 값이 있는 경우
      return <Nofication>비밀번호가 서로 다릅니다!</Nofication>;
    }
    if (!passwordCheck && !retypePassword) {
      return <Nofication>비밀번호를 재입력하세요!</Nofication>;
    }
    return null;
  };

  // 회원가입
  const ConfirmBtnByCondition = () => {
    if (email && isNotUsingEmail && nickname && isValidNickname && password && retypePassword && passwordCheck && password.length >= 8) {
      // 모든 값이 입력되어 았고, 유효성 및 중복검사, 일치여부를 충족한 경우
      return (
        <Btn action={SignupHandler}>
          <span>회원가입</span>
        </Btn>
      );
    } else {
      return (
        <Btn disabled={true}>
          <span>회원가입</span>
        </Btn>
      );
    }
  };

  return (
    <div>
      <ModalContainer>
        <Backdrop onClick={closeFn} />
        <Modal>
          <CloseBtn onClick={closeFn}><BsXCircleFill size={'2rem'} /></CloseBtn>
          <InnerContainer>

            {/* 이메일 입력 */}
            <div className="fields">
              <div className="form">
                <h3>이메일</h3>
                <EmailNotification />
                <input autoFocus type="email" placeholder="이메일 입력" onChange={emailInputHandler} />
                <EmailCodeBtn />
              </div>
            </div>

            {/* 이메일 코드 6자리 입력 */}
            <div className="fields">
              <div className="form">
                <h3>인증코드</h3>
                <EmailCodeNotification />
                <input type="text" placeholder="6자리 인증코드 입력" onChange={emailCodeHandler} />
              </div>
            </div>

            {/* 닉네임 입력 */}
            <Hline />
            <div className="fields">
              <div className="form">
                <h3>닉네임</h3>
                <NicknameNofication />
                <input type="text" placeholder="닉네임을 입력합니다." onBlur={nicknameCheckHandler} />
              </div>

              {/* 비밀번호 및 비밀번호 확인 */}
              <div className="form">
                <h3>비밀번호 입력</h3>
                <PasswordNofication />
                <input
                  type={"password"}
                  placeholder="비밀번호를 입력합니다."
                  onBlur={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="form">
                <h3>비밀번호 입력 확인</h3>
                <RetypePasswordNofication />
                <input
                  type={"password"}
                  placeholder="다시 한 번 비밀번호를 입력합니다."
                  onChange={(e) => {
                    setRetypePassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <ConfirmBtnByCondition />
          </InnerContainer>
        </Modal>
      </ModalContainer>
    </div>
  );
};