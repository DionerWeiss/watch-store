import { mount } from '@vue/test-utils';
import ProductCard from '@/components/ProductCard';
import { makeServer } from '@/miragejs/server';

const mountProductCard = (server) =>
  mount(ProductCard, {
    propsData: {
      product: server.create('product', {
        title: 'Relógio Bonito',
        price: '22.00',
        image:
          'https://images.unsplash.com/photo-1526045431048-f857369baa09?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
      }),
    },
  });

describe('ProductCard - unit', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should match snapshot', () => {
    const wrapper = mountProductCard(server);

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should mount the component', () => {
    const wrapper = mountProductCard(server);

    expect(wrapper.vm).toBeDefined();
    expect(wrapper.text()).toContain('Relógio Bonito');
    expect(wrapper.text()).toContain('$22.00');
  });
});
