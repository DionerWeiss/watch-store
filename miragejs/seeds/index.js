const usersSeeder = (server) => {
  server.createList('user', 10);
};

const productSeeder = (server) => {
  server.createList('product', 25);
};

export default function seeds(server) {
  usersSeeder(server);
  productSeeder(server);
}
