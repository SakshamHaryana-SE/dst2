import React, { PureComponent } from 'react';
import Footer from './components/Footer';
import 'animate.css';

class App extends PureComponent {
  render() {
    const { component } = this.props;

    return (
      <div className='h-screen'>
        {component}
        <Footer />
      </div>
    );
  }
}

export default App;
