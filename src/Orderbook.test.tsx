import OrderBook from './OrderBook'
import { mount } from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import snapshotJson from './tests/msg_snapshot.json'

Enzyme.configure({ adapter: new Adapter() })

test('renders OrderBook title', () => {
  let wrapper = mount(<OrderBook />)
  expect(wrapper.text()).toContain('Order Book')
})

test('renders Loading if not connected', () => {
  let wrapper = mount(<OrderBook />)
  expect(wrapper.text()).toContain('Loading...')
})

test('not renders Loading if connected', () => {
  let wrapper = mount(<OrderBook />)
  wrapper.instance().setState({connected: true})
  expect(wrapper.text()).not.toContain('Loading...')
})

test('renders snapshot', () => {
  let wrapper = mount(<OrderBook />)
  wrapper.instance().setState({
    connected: true,
    bookData: {
      buy: snapshotJson['bids'],
      sell: snapshotJson['asks']
    }
  })
  expect(wrapper.text()).toContain('47239.5') // check price
  expect(wrapper.text()).toContain('326444') // check total
})