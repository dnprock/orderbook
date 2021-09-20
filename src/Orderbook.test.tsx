import OrderBook from './OrderBook'
import { mount, shallow } from 'enzyme'
import Enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { convertBookDataToHash } from './utilities'
import snapshotJson from './tests/msg_snapshot.json'
import snapshot2Json from './tests/msg_2_snapshot.json'
import feed2Json1 from './tests/msg_2_feed_1.json'
import feed2Json2 from './tests/msg_2_feed_2.json'
import feed2Json3 from './tests/msg_2_feed_3.json'
import feed2Json4 from './tests/msg_2_feed_4.json'
import feed2Json5 from './tests/msg_2_feed_5.json'
import feed2Json6 from './tests/msg_2_feed_6.json'
import feed2Json7 from './tests/msg_2_feed_7.json'
import feed2Json8 from './tests/msg_2_feed_8.json'
import feed2Json9 from './tests/msg_2_feed_9.json'
import feed2Json10 from './tests/msg_2_feed_10.json'
import feed2Json11 from './tests/msg_2_feed_11.json'
import { FeedResponse } from './interfaces'

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
      buy: convertBookDataToHash(snapshotJson['bids'] as [number, number][]),
      sell: convertBookDataToHash(snapshotJson['asks'] as [number, number][])
    }
  })
  expect(wrapper.text()).toContain('47239.5') // check price
  expect(wrapper.html()).toContain('326444') // check total
})

test('renders snapshot and feed updates', () => {
  let wrapper = shallow(<OrderBook />)
  let instance = wrapper.instance() as OrderBook
  instance.setState({
    connected: true,
    bookData: {
      buy: convertBookDataToHash(snapshot2Json['bids'] as [number, number][]),
      sell: convertBookDataToHash(snapshot2Json['asks'] as [number, number][])
    }
  })
  expect(wrapper.html()).toContain('420584') // check total, buy side
  expect(wrapper.html()).toContain('445372') // check total, sell side
  // update order book with feed 1
  instance.updateFeed(feed2Json1 as FeedResponse)
  expect(wrapper.html()).toContain('925647') // check total, buy side
  expect(wrapper.html()).toContain('2772556') // check total, sell side
  // verify 47412.5 and 47410.5 prices are removed on buy side
  expect(wrapper.html()).not.toContain('47412.5')
  expect(wrapper.html()).not.toContain('47410.5')
  // verify 46467 price is added on buy side
  expect(wrapper.html()).toContain('46467')
  // verify 47400 size is updated to 57896 on buy side
  expect(wrapper.html()).toContain('57896')
  // verify 47416.5 and 47423.5 is added on sell side
  expect(wrapper.html()).toContain('47416.5')
  expect(wrapper.html()).toContain('47423.5')
  // verify 47431 is removed on sell side
  expect(wrapper.html()).not.toContain('47431')
  // verify 47439.5 size is updated to 16200 on sell side
  expect(wrapper.html()).toContain('16200')

  // update order book with the rest of the feeds
  instance.updateFeed(feed2Json2 as FeedResponse)
  instance.updateFeed(feed2Json3 as FeedResponse)
  instance.updateFeed(feed2Json4 as FeedResponse)
  instance.updateFeed(feed2Json5 as FeedResponse)
  instance.updateFeed(feed2Json6 as FeedResponse)
  instance.updateFeed(feed2Json7 as FeedResponse)
  instance.updateFeed(feed2Json8 as FeedResponse)
  instance.updateFeed(feed2Json9 as FeedResponse)
  instance.updateFeed(feed2Json10 as FeedResponse)

  expect(wrapper.html()).toContain('2298855') // check total, buy side
  expect(wrapper.html()).toContain('2902292') // check total, sell side
})