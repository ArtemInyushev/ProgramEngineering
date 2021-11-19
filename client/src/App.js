import './styles/style.css';
import Header from './components/Header';
import Content from './components/Content';
import withAuth from './hocs/withAuth';

function App() {  
  return (
    <div className="container">
      <Header />
      <Content />
    </div>
  );
}

export default withAuth(App);
