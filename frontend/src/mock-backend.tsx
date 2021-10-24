/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// Interfaces go here:

export interface Node {
  id: number;
  name: string;
  image: string;
  subnodes: Array<number>;
  // access_level: number;
  editors: Array<number>;
  type: string;
}

export interface Subnode {
  id: number;
  // access_level: number;
  editors: Array<number>;
  type: string;
  content: string;
}

export interface Game {
  nodes: Array<number>;
  players: Array<number>;
  gms: Array<number>;
  users: Array<number>; // = players + gms, might be a better way to define this
  settings: Record<string, unknown>;
}

export interface User {
  id: number;
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: Array<number>;
}

// Hardcoded variables go here:
const global_subnodes = [
  {
    id: 1,
    node_id: 1,
    editors: [2],
    type: 'description',
    content: '',
  },
  {
    id: 2,
    node_id: 1,
    editors: [2],
    type: 'event',
    content: '',
  },
  {
    id: 3,
    node_id: 1,
    editors: [2],
    type: 'notes',
    content: '',
  },
];

const global_nodes = [
  {
    id: 1,
    name: 'The Soaring Skies',
    image: '/images/sky.jpg',
    image_alt: '',
    subnodes: [],
    editors: [],
    type: 'location',
  },
];

const global_users = [
  {
    id: 1,
    username: 'user1',
    password: 'user1',
    email: 'user1@user.com',
    games: [1],
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    games: [1],
  },
];

const game_1 = {
  nodes: [1],
  players: [1],
  gms: [2],
  users: [1, 2],
  settings: {},
};

// Functions mocking backend behaviour go here:

export const GET_node_by_id = (id: number): Node => {
  return global_nodes.filter((node) => node.id == id)[0];
};

export const GET_user_by_id = (id: number): User => {
  return global_users.filter((user) => user.id == id)[0];
};

export const GET_subnodes_by_node_id = (node_id: number): Array<Subnode> => {
  return global_subnodes.filter((subnode) => subnode.node_id == node_id);
};
