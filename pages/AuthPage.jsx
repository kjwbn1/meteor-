import React from 'react';
import MobileMenu from '../components/MobileMenu.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link }) => (
  <div className="page auth">
    <nav>
      <MobileMenu/>
    </nav>
    <div className="content-scrollable">
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: React.PropTypes.element,
  link: React.PropTypes.element,
};

export default AuthPage;


// AuthPage는 AuthPageJoin(로그인)과 AuthPageSignin(회원가입)을 보여줍니다. 회원가입 버튼을 누르면 회원가입을 로그인버튼을 누르면 로그인 화면으로 가는 구성을 가지고 있습니다. 
// AuthPage.propTypes의 경우 안드로이드의 타입 설정을 아래에 빼 놓은 모양입니다. 공식문서에는 타입을 확인하는 작업으로 나와있습니다. 디버깅을 위해서 만들어 놓은 것 같습니다. 
// 모양은 json 객체 형태를 취하고 있기에 습니다. 디버깅 과정에서 타입을 확인하기 위한 과정으로 이해됩니다. 


//  -------------->다음 설명은 import/ui/pages/AuthPageSignIn.jsx 입니다. 