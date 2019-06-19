import React from 'react';
import { Link } from 'react-router';

// UserMenu는 컴포넌트폴더에 들어가 있다.



export default class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggle = this.toggle.bind(this); // 여전히 객체 생성과 동시에 버튼에게 내가 어느 위치의 버튼인지 주소를 알려준다. 
  }


  toggle(e) {
    e.stopPropagation();   // 이벤트 함수가 구동하기 전에 항상 무언가를 멈춘다.. 왜 그런가? 아마 데드록 회로와 같은 원리인거 같은데 해당 로직을 실행하면 다른 이벤트 실행을 막기 위한 장치로 보인다. 
    this.setState({        // 흔히 강박적으로 버튼을 갈기는.. 혹은 여러개의 버튼과 제스쳐를 동시에 쓰는 사람들이 존재한다. 그게 나다..-_-;; 그걸 막기 위한 장치들이 구성된것 같다. 
      open: !this.state.open,
    });
  }

  renderLoggedIn() {    // 로그인 되어 있을때 보여줄 화면
    const { open } = this.state;    
    const { user, logout } = this.props;  // this.props로 전달 받는다.어디서?  그건 이 UserMenu를 인스턴스화 하는 대상에게 전달 받을 것으로 예상된다.  결과적으로 layouts 폴더에 App.jsx에게서 받는다.
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@')); // 로그인이되면 @이를 뺀 아이디만 표시한다. 

    return (
      <div className="user-menu vertical">
        <a href="#" className="btn-secondary" onClick={this.toggle}>
          {open
            ? <span className="icon-arrow-up"></span>
            : <span className="icon-arrow-down"></span>}
          {emailLocalPart}
        </a>
        {open
          ? <a className="btn-secondary" onClick={logout}>Logout</a>
          : null}
      </div>
    );
  }


  renderLoggedOut() {   // 로그인이 되어 있지 않을때 보여주는 화면 로그인이 되어 있지 않으면 회원가입과 로그인 화면 두개를 링크를 선택 할 수 있다. 
    return (
      <div className="user-menu">
        <Link to="/signin" className="btn-secondary">Sign In</Link>
        <Link to="/join" className="btn-secondary">Join</Link>
      </div>
    );
  }


  render() {
    return this.props.user
      ? this.renderLoggedIn()
      : this.renderLoggedOut();
  }
}   // 유저가 있으면 즉 로그인이 되어 있으면 renderLoggedIn 아니면 renderLoggedOut을 실행한다.

UserMenu.propTypes = {
  user: React.PropTypes.object,
  logout: React.PropTypes.func,
};


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@다음 설명 로직은 import/ui/layouts/App.jsx입니다. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@