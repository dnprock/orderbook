import { mount } from 'enzyme'
import App from './App'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

Enzyme.configure({ adapter: new Adapter() })

test('renders Orderbook title', () => {
  let wrapper = mount(<App />)
  expect(wrapper.text()).toContain('Order Book')
});
