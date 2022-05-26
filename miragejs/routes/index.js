export default function routes() {
  this.namespace = 'api';
  // this.timing = 5000;

  this.resource('users');
  this.resource('products');

  this.get('messages', (schema, request) => {
    const {
      queryParams: { userId },
    } = request;

    return schema.messages.where({ userId });
  });
}
