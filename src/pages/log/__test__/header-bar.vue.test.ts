import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { routeLocationKey, routerKey } from 'vue-router'
import HeaderBar from '../header-bar.vue'

describe('header-bar.vue', () => {
  it('display title', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const text = wrapper.find('div.header-bar>span').text()
    expect(text).eq(date)
  })

  it('display home button', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const one = wrapper.findAll('button').filter(x => x.text() === '首页')
    expect(one.length).eq(1)
  })

  it('display preview button', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const one = wrapper.findAll('button').filter(x => x.text() === '前一天')
    expect(one.length).eq(1)
  })

  it('display next button', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const one = wrapper.findAll('button').filter(x => x.text() === '后一天')
    expect(one.length).eq(1)
  })

  it('emit preview event', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const one = wrapper.findAll('button').filter(x => x.text() === '前一天')
    expect(one.length).eq(1)
    one[0].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('preview')
  })

  it('emit next event', () => {
    const date = '2025-04-15'
    const wrapper = doMount(date)
    const one = wrapper.findAll('button').filter(x => x.text() === '后一天')
    expect(one.length).eq(1)
    one[0].trigger('click')
    expect(wrapper.emitted()).toHaveProperty('next')
  })
})

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}

const mockRoute = {
  path: '/',
  params: { },
}

function doMount(date: string) {
  return mount(HeaderBar, {
    global: {
      provide: {
        [routerKey]: mockRouter,
        [routeLocationKey]: mockRoute,
      },
      mocks: {
        $router: mockRouter,
        $route: mockRoute,
      },
    },
    props: {
      date,
    },
  })
}
