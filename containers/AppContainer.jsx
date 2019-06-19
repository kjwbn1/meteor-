import { Meteor } from 'meteor/meteor';
// XXX: Session
import { Session } from 'meteor/session';
import { Lists } from '../../api/lists/lists.js';
import { createContainer } from 'meteor/react-meteor-data';
import App from '../layouts/App.jsx';

export default createContainer(() => {
  const publicHandle = Meteor.subscribe('lists.public');
  const privateHandle = Meteor.subscribe('lists.private');
  return {
    user: Meteor.user(),
    loading: !(publicHandle.ready() && privateHandle.ready()),
    connected: Meteor.status().connected,
    menuOpen: Session.get('menuOpen'),
    lists: Lists.find({ $or: [
      { userId: { $exists: false } },
      { userId: Meteor.userId() },
    ] }).fetch(),
  };
}, App);

// 마치 강을 거슬러 올라가는 연어 처럼 Container에 도착했습니다. 헉헉
// 여기는  App을 인스턴스화 합니다. user loading connected menuOpen lists의 props를 App에 전달 합니다. 

// AppContainer와 ListContainer가 있는데 잘생각해보면 컴포넌트는 부품이라면 Container는 부품이 조립이 끝이나고 필요한 정보만 오고가고 할 수 있도록 만들어진 또 하나의 모듈인데
// 모듈이라 부르기에는 덩치가 크기에 Container라고 부르는 것 같습니다. 그리고 Component는 레고와 같아서 여기저기 조립하고 뜯고 씹고 한다면 Container는 이미 완성된 상태에서 정해진 소통 루트를 통해서만
// 사용하는 상황으로 보입니다. 요약하면 추상화의 가장 끝단계로 보면 될 것 같습니다. 


// 여기까지가 코드 리뷰였습니다. Meteor의 메소드 오버라이딩 기능이나 publish subscribe같은 기능에 대해서 학습은 다 끝난 상태입니다. 전체적으로 정리만 남은 상황이긴한데 합격 발표일이 얼마 남지 않은 것
// 같아서 여기까지 정리하겠습니다. 






