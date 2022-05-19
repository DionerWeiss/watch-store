import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server';

import CartItem from '@/components/CartItem';

const mountCartItem = (server) => {
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  });

  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
  });

  return { wrapper, product };
};

describe('CartItem', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const { wrapper } = mountCartItem(server);

    expect(wrapper.vm).toBeDefined();
  });

  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem(server);
    const content = wrapper.text();

    expect(content).toContain(title);
    expect(content).toContain(price);
  });
});
