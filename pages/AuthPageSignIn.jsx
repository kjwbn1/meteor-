import { Meteor } from 'meteor/meteor';
import React from 'react';
import AuthPage from './AuthPage.jsx';
import { Link } from 'react-router';

export default class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    const errors = {};

    if (!email) {
      errors.email = 'Email required';
    }
    if (!password) {
      errors.password = 'Password required';
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Meteor.loginWithPassword(email, password, err => {
      if (err) {
        this.setState({
          errors: { none: err.reason },
        });
      }
      this.context.router.push('/');
    });
  }

  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map(key => errors[key]);
    const errorClass = key => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">Sign In.</h1>
        <p className="subtitle-auth" >Signing in allows you to view private lists</p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map(msg => (
              <div className="list-item" key={msg}>{msg}</div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>
            <input type="email" name="email" ref="email" placeholder="Your Email"/>
            <span className="icon-email" title="Your Email"></span>
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input type="password" name="password" ref="password" placeholder="Password"/>
            <span className="icon-lock" title="Password"></span>
          </div>
          <button type="submit" className="btn-primary">Sign in</button>
        </form>
      </div>
    );

    const link = <Link to="/join" className="link-auth-alt">Need an account? Join Now.</Link>;

    return <AuthPage content={content} link={link}/>;
  }
}

SignInPage.contextTypes = {
  router: React.PropTypes.object,
};


// this.onSubmit = this.onSubmit.bind(this); 는 버튼 이벤트를 바인딩을 하였는데 버튼을 참조하기 위한 로직으로 보여집니다. 안드로이드로 생각하면 리스닝 패턴을 위한 객체참조를 아주 간단하게 구성시켜 놓은
// 모습입니다.
// event.preventDefault(); 이부분이 상당히 의문인데 왜 멈춘 뒤 이벤트 로직이 실행되도록 한건지 의문이였는데 아마 가끔 저 같이 참을성 없는 사람들이 버튼 연타를 다다다닥 거리는걸 방지하는 것 같습니다. 
// 
//  -------------->다음 설명은 import/ui/pages/AuthPageSignJoin.jsx 입니다. 