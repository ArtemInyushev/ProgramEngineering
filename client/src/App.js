import './styles/style.css';
import { useEffect, useState } from 'react';
import { getUserRequest } from './api';
import Header from './components/Header';
import Content from './components/Content';
import withAuth from './hocs/withAuth';
import Spinner from './components/common/Spinner';

function App({ hasAuth, login }) {
  const [init, setState] = useState(true);

  useEffect(() => {
    const getData = async () => {
      let r = await getUserRequest();
      if(r.resultCode === 0) {
        login(r.data);
      }
      setState(false);
    }
    if(!hasAuth) getData();
  },[login, hasAuth])
  
  return (
    !init ? <div className="container">
      <Header />
      <Content />
    </div> : <div className="container-fluid d-flex justify-content-center align-items-center">
      <Spinner />
    </div>
  );
}

export default withAuth(App);
