import React, { PureComponent } from 'react';
import Footer from './components/Footer';

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
