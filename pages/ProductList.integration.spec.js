import { mount } from '@vue/test-utils';
import axios from '@nuxtjs/axios';
import Vue from 'vue';
import ProductList from './';
import ProductCard from '@/components/ProductCard';
import Search from '@/components/Search';
import { makeServer } from '@/miragejs/server';

jest.mock('@nuxtjs/axios', () => ({
  get: jest.fn(),
}));

describe('Name of the group', () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: 'test' });
  });

  afterEach(() => {
    server.shutdown();
  });

  it('should mount the component', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.vm).toBeDefined();
  });

  it('should mount the Search component as a child', () => {
    const wrapper = mount(ProductList);
    expect(wrapper.findComponent(Search)).toBeDefined();
  });

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith('/api/products');
  });

  it('should mount the ProductCard component 10 times', async () => {
    const products = server.createList('product', 10);
    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    const cards = wrapper.findAllComponents(ProductCard);
    expect(cards).toHaveLength(10);
  });
});