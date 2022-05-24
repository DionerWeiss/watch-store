import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server';

import CartItem from '@/components/CartItem';
import { CartManager } from '@/managers/CartManager';

const mountCartItem = (server) => {
  const cartManager = new CartManager();
  const product = server.create('product', {
    title: 'Lindo relógio',
    price: '22.33',
  });

  const wrapper = mount(CartItem, {
    propsData: {
      product,
    },
    mocks: {
      $cart: cartManager,
    },
  });

  return { wrapper, product, cartManager };
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

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem(server);
    const quantity = wrapper.find('[data-testid="quantity"]');

    expect(quantity.text()).toContain('1');
  });

  it('should increaase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem(server);
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="+"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('2');
    await button.trigger('click');
    expect(quantity.text()).toContain('3');
    await button.trigger('click');
    expect(quantity.text()).toContain('4');
  });

  it('should decreaase quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem(server);
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should not go bellow zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem(server);
    const quantity = wrapper.find('[data-testid="quantity"]');
    const button = wrapper.find('[data-testid="-"]');

    await button.trigger('click');
    await button.trigger('click');
    expect(quantity.text()).toContain('0');
  });

  it('should display a button to remove item from cart', () => {
    const { wrapper } = mountCartItem(server);
    const button = wrapper.find('[data-testid="remove-button"]');

    expect(button.exists()).toBe(true);
  });

  it('should call cart manager removeProduct() when button gets clicked', async () => {
    const { wrapper, cartManager, product } = mountCartItem(server);
    const spy = jest.spyOn(cartManager, 'removeProduct');

    await wrapper.find('[data-testid="remove-button"]').trigger('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(product.id);
  });
});
