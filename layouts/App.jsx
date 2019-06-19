import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'; // XXX: SESSION
import { Lists } from '../../api/lists/lists.js';
import UserMenu from '../components/UserMenu.jsx';
import ListList from '../components/ListList.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      showConnectionIssue: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logout = this.logout.bind(this);  
  }

  componentDidMount() {    // 컴포넌트가 마운트되는 순간의 로직 화면에 보여진 후 로직이다.
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  componentWillReceiveProps({ loading, children }) {   // '/'로 접속한 뒤 리스트가 준비되면 불러온다. 빈화면을 보여주는 것이 아닌 일단 화면을 불러오고 데이터는 나중에 전달하기 위한 생각이 도입되어 있다.
    
    if (!loading && !children) {
      const list = Lists.findOne();
      this.context.router.replace(`/lists/${ list._id }`);
    }
  }  
  //UNSAFE_componentWillReceiveProps 이걸로 변화되었다고 한다.  컴포넌트가 마운트되고 newprops를 가져오기 전에 실행된다고 한다. 

  toggleMenu(menuOpen = !Session.get('menuOpen')) {
    Session.set({ menuOpen });
  }
//모바일용 호환성을 위한 로직을 위해서 Session을 사용했는데 왜 굳이 Session이지 라고 생각해보면 이 예제는 모바일에 동작가능하게 cordova로 만들어 졌기 때문에 사용한 것 아닌가 싶다.
//안드로이드로 치면 sharedpreference에 해당하는 기능으로 설명되어 있다. -_- 왜 그런지 모르겠다 좀 더 분석해보자. 

  logout() {
    Meteor.logout(); // 여기 로그아웃 있다. 이걸 아래 AuthPage.jsx 주소를 전닳한다. 로그아웃기능의 참조를 전달하는가 생각해보면 로그아웃 기능은 서버 디비와 연계되기에 로그아웃이 시행되는건 
                    // 전체 계층의 상단부 즉,layout이 배치되는 단계에서 시행되어야 한다. 그러나 실제 로그아웃 이벤트를 발생시키는 구간은 뷰에 있다. 그렇기 때문에 로그아웃을 prop로 계층 하단으로 이동시키는 것 같다.
                    // 일종의 인터페이스를 구현이 된건데 너무 모듈화가 되어서 형태를 알지 못 하지만 직관적으로 이해가 가능하다. 

    // if we are on a private list, we'll need to go to a public one
    // 로그아웃하면 해당 계정이 보안리스트로 작성한 것들은 보이지 않아야 한다. 
    if (this.props.params.id) {
      const list = Lists.findOne(this.props.params.id);
      if (list.userId) {
        const publicList = Lists.findOne({ userId: { $exists: false } });
        this.context.router.push(`/lists/${ publicList._id }`);
      }
    }
  }

  render() {
    const { showConnectionIssue } = this.state;
    const {
      user,
      connected,
      loading,
      lists,
      menuOpen,
      children,
      location,
    } = this.props;

    const closeMenu = this.toggleMenu.bind(this, false);
    // Session에 해당 값이 없으면 false 리턴한다. 

    // clone route components with keys so that they can
    // have transitions
    const clonedChildren = children && React.cloneElement(children, {
      key: location.pathname,
    });   //전환을 위한 라우터 컴포넌트를 저장한다고하는데 좀 더 분석해야겠습니다. 

    return (
      <div id="container" className={menuOpen ? 'menu-open' : ''}>
        <section id="menu">
          <UserMenu user={user} logout={this.logout}/>  
          <ListList lists={lists}/>
        </section>
        {showConnectionIssue && !connected
          ? <ConnectionNotification/>
          : null}
        <div className="content-overlay" onClick={closeMenu}></div>
        <div id="content-container">
          <ReactCSSTransitionGroup
            transitionName="fade"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            {loading
              ? <Loading key="loading"/>   // ReactCSSTransitionGroup  --> react-transition-group 변함. 간단하게 애니메이션 적용하는 api인 것 같다. 
              : clonedChildren}
          </ReactCSSTransitionGroup> 

        </div>
      </div>
    );
  }
}

App.propTypes = {
  user: React.PropTypes.object,      // current meteor user  
  connected: React.PropTypes.bool,   // server connection status
  loading: React.PropTypes.bool,     // subscription status
  menuOpen: React.PropTypes.bool,    // is side menu open?
  lists: React.PropTypes.array,      // all lists visible to the current user
  children: React.PropTypes.element, // matched child route component
  location: React.PropTypes.object,  // current router location
  params: React.PropTypes.object,    // parameters of the current route
};

App.contextTypes = {
  router: React.PropTypes.object,
};
// App도 라우터에 알려준다.


// /~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~그 다음 설명은 import/ui/container/AppContainer.jsx 입니다.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~