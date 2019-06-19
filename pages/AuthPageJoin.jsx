import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';
import { Accounts } from 'meteor/accounts-base';




//  첫번째 코드 해석

// AuthPageJoin.jsx 의 경우 로그인 페이지를 정의하고 있습니다. jsx를 이용하여 js-html으로 뷰와 로직을 분리한 것이 아닌 html과 js의 로직이 통합된 모습을 보이고 있습니다. 
// 페이지(html+js = jsx)이며 생성자(constructor)를 보면 일단 상속을 받았기 때문에 부모객체 React에 props를 super(props); 전달해서 부모를 초기화하고 다시 자식객체에 내려오는 모습이고 
// 추가로 State를 설정했습니다. Props와 달리 State의 경우 뷰의 변환 상태를 통제하는 것으로 생각 됩니다. 왜 이런 선택을 했는가 생각해보면 결국 React DOM의 최대강점인 DOM tree에서 State의 변화를
// 캐치하고 그 기존 State와 비교 후 최신화시키기에 속도면에서 우수한 것으로 이해하고 있습니다. 여기서 State를 활용하는 방법으로 Redux가 나온 것같은데 이 부분은 좀 더 연구해야 될 것 같습니다. 
// 그리고 해당코드는 content와 link를 반환하며 이것은 AuthPage를 초기화시키는 props가 됩니다. 안드로이드로 치면 클래스를 인스턴스화 하는 과정이라 봅니다.
// Custom Button을 만들때 기존 Button을 상속하는 것과 같습니다. super()를 통해 부모객체부터 인스턴스화하는 과정인 것 같습니다. 


export default class JoinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  
  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const confirm = this.refs.confirm.value;
    const errors = {};

    if (!email) {
      errors.email = 'Email required';
    }
    if (!password) {
      errors.password = 'Password required';
    }
    if (confirm !== password) {
      errors.confirm = 'Please confirm your password';
    }   

    // 에러가 나면 errors에 key(email,password,confirm) 해당 에러(예: 'Email required')들을 저장한다 

    this.setState({ errors });   // error state에 상태를 전달한다. 
    if (Object.keys(errors).length) {
      return;
    }  // 비밀번호 패스워드 입력하면 그냥 넘어간다!!!

    Accounts.createUser({
      email,
      password,
    }, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }
// 버튼 클릭(로그인 버튼) 이벤트에 동작하는 함수에 연결되어 있는 부분인데
// 이부분이 상당히 흥미로운데 accounts-base라는 컴포넌트를 이용해서 너무 간단한 회원가입 로직이 완성되어 있습니다.
// 서버로 부터 err.reason를 받아서 이것을 State에 저장한다. 

  render() {
    const { errors } = this.state; //
    const errorMessages = Object.keys(errors).map(key => errors[key]); // errors.email = 'Email required'; 위 로직에서 보듯 email은 key가 되며 ''부분은 에러 메세지 출력 부분이 된다. 
    const errorClass = key => errors[key] && 'error'; //리턴값이 true or false인데 

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Join.</h1>
        <p className="subtitle-auth" >Joining allows you to make private lists</p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>   //에러 메세지를 긴거부터 짧은 순으로 리스트화 해서 보여준다. 
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>    
          {/* //errorClass가 jquery 문법이 적용되어 있다. 커스텀 기능이 모듈화되어 있어서 비밀번호의 길이라던가 비빌번호가 매칭이 안 된다거나 구현되어 있는 것같다.   */}
            <input type="email" name="email" ref="email" placeholder="Your Email"/>
            <span className="icon-email" title="Your Email"></span>
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input type="password" name="password" ref="password" placeholder="Password"/>
            <span className="icon-lock" title="Password"></span>
          </div>
          <div className={`input-symbol ${errorClass('confirm')}`}>
            <input type="password" name="confirm" ref="confirm" placeholder="Confirm Password"/>
            <span className="icon-lock" title="Confirm Password"></span>
          </div>
          <button type="submit" className="btn-primary">Join Now</button>
        </form>
      </div>
    );

    const link = <Link to="/signin" className="link-auth-alt">Have an account? Sign in</Link>;
// AuthPage에 전달할 링크 구성
    return <AuthPage content={content} link={link}/>;
  }
}

JoinPage.contextTypes = {
  router: React.PropTypes.object,
};


// 마지막 JoinPage.contextTypes = {
  // router: React.PropTypes.object,
// };
// 코드를 해석하자면 안드로이드로 치면 메니페스트 or context가 되는 것이 아닌가? 그런 추측이 가능합니다. "context는 일종의 전체 메타데이터 list로 
// "JoinPage는 contextTypes에 메타데이터가 있으니깐 Router는 contextTypes을 뒤져서 해당 메타데이터를 찾아서 경로를 찾아서 그것을 화면에 뿌려줘라~"라는 이야기를 하는 것 같습니다. 


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 다음 해석은 import/components/UserMenu.jsx입니다. @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@