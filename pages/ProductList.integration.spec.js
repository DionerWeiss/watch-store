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

  it('should display the error message when Promise rejects', async () => {
    axios.get.mockReturnValue(Promise.reject(new Error('any_error')));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!');
  });

  it('should filter the product list when a search is performed', async () => {
    const products = [
      ...server.createList('product', 10),
      server.create('product', {
        title: 'Meu relógio amado',
      }),
      server.create('product', {
        title: 'Meu outro relógio estimado',
      }),
    ];

    axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

    const wrapper = mount(ProductList, {
      mocks: {
        $axios: axios,
      },
    });

    await Vue.nextTick();

    const search = wrapper.findComponent(Search);
    search.find('input[type="search"]').setValue('relógio');
    await search.find('form').trigger('submit');

    const cards = wrapper.findAllComponents(ProductCard);
    // expect(wrapper.vm.searchTerm).Equal('relógio');
    expect(cards).toHaveLength(2);
  });
});
